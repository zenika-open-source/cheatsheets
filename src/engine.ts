import { render } from 'ejs';
import type { Options } from 'ejs';
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { globSync } from 'glob';
import type { Dirent } from 'node:fs'
import MarkdownIt from 'markdown-it';
import highlightjs from 'markdown-it-highlightjs';
import type { CheatsheetContext } from './cheatsheet-context.interface.ts';
import type { TemplateType } from './templates/template.type.ts';
import { basicHeading } from './heading.rules.ts';

const templatesDir: string = './src/templates/';
const cheatsheetDir: string = './cheatsheets/';
const outDir: string = './dist/';
const ejsDefaultConfig: Options & { async: false } = { root: `${templatesDir}`, async: false };


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

/**
 * create template driven markdownit instance
 * @param cheatsheet name of the cheatsheet to build
 */
export async function computeCheatsheet(cheatsheet: string): Promise<CheatsheetContext> {
  const markdown = new MarkdownIt({}).use(highlightjs);

  console.log(`${cheatsheet} cheatsheet.`);

  // load cheatsheet configuration
  const config = JSON.parse(readFileSync(`${cheatsheetDir}${cheatsheet}/config.json`).toString());

  console.log(`Initialize ${config.template} template.`);
  // get template specific scripts and run it
  const templateConfiguration: TemplateType = (await import(`.${templatesDir}${config.template}/index.ts`)).default;
  basicHeading(markdown);
  templateConfiguration.initializeTemplate(markdown);

  console.log(`Render ${config.template} template.`);
  // render html body with markdownit
  const rendered = markdown.render(readFileSync(`${cheatsheetDir}${cheatsheet}/index.md`).toString());

  const context: CheatsheetContext = {
    cheatsheet,
    title: config.name,
    description: config.description,
    mainColor: config.mainColor,
    secondaryColor: config.secondaryColor,
    content: rendered,
    icon: config.icon,
    templateParams: { ...templateConfiguration.defaultParams, ...config.templateParams }
  };

  console.log(`Create ${config.template} HTML page.`);

  // create cheatsheet package with html page and assets
  mkdirSync(`${outDir}${cheatsheet}`);
  const html: string = render(readFileSync(`${templatesDir}${config.template}/index.ejs`, { encoding: 'utf-8' }), context, ejsDefaultConfig);
  writeFileSync(`${outDir}${cheatsheet}/index.html`, html);
  cpGlobSync(`${templatesDir}${config.template}/**/*.css`, `${outDir}${cheatsheet}/`);

  if (existsSync(`${cheatsheetDir}${cheatsheet}/assets`)) {
    cpSync(`${cheatsheetDir}${cheatsheet}/assets`, `${outDir}${cheatsheet}/assets`, { recursive: true });
  }

  // copy common files
  cpSync(`${templatesDir}/template-common.css`, `${outDir}/template-common.css`);
  return context;
}

export function buildIndex(cheatsheetsContext: CheatsheetContext[]): void {
  const context = {
    cheatsheetsContext
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
