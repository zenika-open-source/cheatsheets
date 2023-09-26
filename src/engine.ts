import MarkdownIt, { PluginSimple, PluginWithOptions } from 'markdown-it';
import { render } from 'ejs';
import type { Options } from 'ejs';
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync, StatsBase, StatsFs, Stats, statSync } from 'node:fs';
import { globSync } from 'glob';
import type { Dirent } from 'node:fs'
import highlightjs from 'markdown-it-highlightjs';
import type { CheatsheetContext } from './cheatsheet-context.interface.ts';
import type { TemplateType } from './templates/template.type.ts';
import { basicHeading } from './heading.rules.ts';

const templatesDir: string = './src/templates/';
const cheatsheetDir: string = './cheatsheets/';
const outDir: string = './dist/';
const ejsDefaultConfig: Options & { async: false } = { root: `${templatesDir}`, async: false };
const maxGeneratedCheatsheets: number = 10;

/**
 * Get list of available cheatsheets
 */
export function getCheatsheetsList(): string[] {
  return readdirSync(cheatsheetDir, { withFileTypes: true })
    .filter((dirent: Dirent) => dirent.isDirectory())
    .map((dir: Dirent) => dir.name);
}

/**
 * Remove old dist folder and create new empty one
 */
export function clearDist(): void {
  rmSync('./dist', { recursive: true, force: true });
  mkdirSync('./dist');
}

function cpGlobSync(glob: string, destination: string): void {
  const files: string[] = globSync(glob, { dotRelative: true, absolute: false });
  files.forEach((file: string) => {
    cpSync(file, `${destination}/${file.replace(/^.*[\\\/]/, '')}`);
  });
}

export function cleanGenerated() {
  const files: string[] = readdirSync(`${outDir}/`)
    .filter((dirent: string) => dirent.startsWith('generated-'));
  if (files.length > maxGeneratedCheatsheets) {
    const sortedFiled: string[] = files.map((dirent: string) => [dirent, statSync(`${outDir}/${dirent}`)] as [string, Stats])
      .sort((file1: [string, Stats], file2: [string, Stats]) => file1[1].birthtimeMs - file2[1].birthtimeMs)
      .map((dirent: [string, Stats]) => dirent[0]);

    while(sortedFiled.length > maxGeneratedCheatsheets) {
      const file: string = sortedFiled.shift() as string;
      rmSync(`${outDir}/${file}`, {recursive: true, force: true});
    }
  }
}

/**
 * Create specific markdown html generator for the template
 * @param template template name
 */
export async function createMarkdownEngine(template: string): Promise<MarkdownIt> {
  const markdown = new MarkdownIt({}).use(highlightjs);
  console.log(`Initialize ${template} template.`);
  // get template specific scripts and run it
  const templateScript: TemplateType = (await import(`.${templatesDir}${template}/index.ts`)).default;
  templateScript.initializeTemplate(markdown);
  return markdown;
}

/**
 * create template driven markdownit instance
 * @param cheatsheet name of the cheatsheet to build
 */
export async function computeCheatsheet(cheatsheet: string): Promise<CheatsheetContext> {

  console.log(`${cheatsheet} cheatsheet.`);

  // load cheatsheet configuration
  const config = JSON.parse(readFileSync(`${cheatsheetDir}${cheatsheet}/config.json`).toString());

  console.log(`Initialize ${config.template} template.`);
  // get template specific scripts and run it
  const templateConfiguration: TemplateType = (await import(`.${templatesDir}${config.template}/index.ts`)).default;
  const markdown = await createMarkdownEngine(config.template);

  basicHeading(markdown);
  templateConfiguration.initializeTemplate(markdown);

  console.log(`Render ${config.template} template.`);
  // render html body with markdownit
  const rendered = markdown.render(readFileSync(`${cheatsheetDir}${cheatsheet}/index.md`).toString());

  const context: CheatsheetContext = {
    cheatsheet,
    title: config.name,
    categoryId: config.categoryId,
    description: config.description,
    mainColor: config.mainColor,
    secondaryColor: config.secondaryColor,
    content: rendered,
    icon: config.icon,
    templateParams: { ...templateConfiguration.defaultParams, ...config.templateParams }
  };

  // create cheatsheet package with html page and assets
  generateCheatsheet(config.template, cheatsheet, context);
  return context;
}

/**
 * Generate cheatsheet files
 * @param template template name
 * @param cheatsheetOutDir name of the output folder
 * @param context cheatsheet context @see CheatsheetContext object
 */
export function generateCheatsheet(template: string, cheatsheetOutDir: string, context: CheatsheetContext) {
  console.log(`Create ${context.title} HTML page.`);
  mkdirSync(`${outDir}${cheatsheetOutDir}`);
  const html: string = render(readFileSync(`${templatesDir}${template}/index.ejs`, { encoding: 'utf-8' }), context, ejsDefaultConfig);
  writeFileSync(`${outDir}${cheatsheetOutDir}/index.html`, html);
  cpGlobSync(`${templatesDir}${template}/**/*.css`, `${outDir}${cheatsheetOutDir}/`);
  if (existsSync(`${cheatsheetDir}${context.cheatsheet}/assets`)) {
    cpSync(`${cheatsheetDir}${context.cheatsheet}/assets`, `${outDir}${cheatsheetOutDir}/assets`, { recursive: true });
  }

  // copy common files
  cpSync(`${templatesDir}/template-common.css`, `${outDir}/template-common.css`);
}

export type CategorizedCheatsheets = {
  [key: string]: CheatsheetContext[]
}

export function buildIndex(cheatsheetsCategories: CategorizedCheatsheets): void {
  const templates = readdirSync(templatesDir, {withFileTypes: true})
    .filter((dirent: any) => dirent.isDirectory())
    .filter((dir: any) => !['main', 'partials'].includes(dir.name))
    .map((dir: any) => dir.name);
  const categories = JSON.parse(readFileSync(`${cheatsheetDir}categories.json`, { encoding: 'utf-8' }));

  const context = {
    cheatsheetsCategories,
    categories,
    templates
  };
  console.log('Build index file');

  readdirSync(`${templatesDir}/main/`)
    .filter((dirent: string) => dirent.endsWith('.ejs'))
    .forEach((dirent: string) => {
      const html: string = render(readFileSync(`${templatesDir}/main/${dirent}`, { encoding: 'utf-8' }), context, ejsDefaultConfig);
      writeFileSync(`${outDir}/${dirent.substring(0, dirent.length - 3)}html`, html);
    });

  readdirSync(`${templatesDir}/main/`)
    .filter((dirent: string) => !dirent.endsWith('.ejs'))
    .forEach((dirent: string) => cpSync(`${templatesDir}/main/${dirent}`, `${outDir}/${dirent}`));
}
