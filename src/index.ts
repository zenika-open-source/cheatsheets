import ejs from 'ejs';
import fs from 'fs';
import MarkdownIt from 'markdown-it';
import highlightjs from 'markdown-it-highlightjs';
import { TemplateType } from './templates/template.type';

const templatesDir: string = './src/templates/';
const cheatsheetDir: string = './cheatsheets/';
const outDir: string = './dist/';

// get list of available cheatsheets
const cheatsheets = fs.readdirSync(cheatsheetDir, {withFileTypes: true})
  .filter((dirent: any) => dirent.isDirectory())
  .map((dir: any) => dir.name);

// remove old dist folder if exist
fs.rmSync('./dist', { recursive: true, force: true });

// create dist folder
fs.mkdirSync('./dist');

for (let cheatsheet of cheatsheets) {
  // create template driven markdownit instance
  const markdown = new MarkdownIt({}).use(highlightjs);

  console.log(`${cheatsheet} cheatsheet.`);
  // load cheatsheet configuration
  const config = JSON.parse(fs.readFileSync(`${cheatsheetDir}${cheatsheet}/config.json`).toString());

  console.log(`Initialize ${config.template} template.`);
  // get template specific scripts and run it
  const templateScript: TemplateType = (await import(`.${templatesDir}${config.template}/index.ts`)).default;
  templateScript.initializeTemplate(markdown);

  console.log(`Render ${config.template} template.`);
  // render html body with markdownit
  const rendered = markdown.render(fs.readFileSync(`${cheatsheetDir}${cheatsheet}/index.md`).toString());

  const context = {
    title: config.name,
    mainColor: config.mainColor,
    secondaryColor: config.secondaryColor,
    content: rendered,
    icon: config.icon
  };

  console.log(`Create ${config.template} HTML page.`);
  // create cheatsheet package with html page and assets
  fs.mkdirSync(`${outDir}${cheatsheet}`);
  const html = ejs.render(fs.readFileSync(`${templatesDir}${config.template}/index.ejs`).toString(), context);
  fs.writeFileSync(`${outDir}${cheatsheet}/cheatsheet.html`, html);
  fs.cpSync(`${templatesDir}${config.template}/style.css`, `${outDir}${cheatsheet}/style.css`);
  fs.cpSync(`${cheatsheetDir}${cheatsheet}/assets`, `${outDir}${cheatsheet}/assets`, { recursive: true });
}
