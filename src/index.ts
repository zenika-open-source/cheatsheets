import MarkdownIt from 'markdown-it';
import MarkdownItContainer from 'markdown-it-container';
import highlightjs from 'markdown-it-highlightjs';
import ejs from 'ejs';
const fs = require('fs');

const templatesDir: string = './src/templates/';
const cheatsheetDir: string = './cheatsheets/';
const outDir: string = './dist/';

const markdown = new MarkdownIt({})
  .use(highlightjs)
  .use(MarkdownItContainer, 'row', {
    render: (tokens: any, id: number) => {

      if (tokens[id].nesting === 1) {
        const row = tokens[id].info.split(' ')[2];
        if (row) {
          return `<div class="row-${row}">`;
        } else {
          return `<div class="row">`;
        }
      } else {
        return '</div>';
      }
    }
  })
  .use(MarkdownItContainer, 'column', {
    render: (tokens: any, id: number) => {

      if (tokens[id].nesting === 1) {
        const col = tokens[id].info.split(' ')[2];
        if (col) {
          return `<div class="col-${col}">`;
        } else {
          return `<div class="col">`;
        }
      } else {
        return '</div>';
      }
    }
  });

markdown.renderer.rules.heading_open = function(tokens, i) {
  const token = tokens[i];
  return `<h${parseInt(token.tag.substring(1)) + 1}>`;
};

markdown.renderer.rules.heading_close = function(tokens, i) {
  const token = tokens[i];
  return `</h${parseInt(token.tag.substring(1)) + 1}>`;
};

const cheatsheets = fs.readdirSync(cheatsheetDir, {withFileTypes: true})
  .filter((dirent: any) => dirent.isDirectory())
  .map((dir: any) => dir.name);

fs.rmSync('./dist', { recursive: true, force: true });
fs.mkdirSync('./dist');

for (let cheatsheet of cheatsheets) {
  console.log(`Building ${cheatsheet} cheatsheet.`);
  const config = JSON.parse(fs.readFileSync(`${cheatsheetDir}${cheatsheet}/config.json`).toString());
  const rendered = markdown.render(fs.readFileSync(`${cheatsheetDir}${cheatsheet}/index.md`).toString());
  const context = {
    title: config.name,
    mainColor: config.mainColor,
    secondaryColor: config.secondaryColor,
    content: rendered,
    icon: config.icon
  };

  fs.mkdirSync(`${outDir}${cheatsheet}`);
  const html = ejs.render(fs.readFileSync(`${templatesDir}${config.template}/index.ejs`).toString(), context);
  fs.writeFileSync(`${outDir}${cheatsheet}/cheatsheet.html`, html);
  fs.cpSync(`${templatesDir}${config.template}/style.css`, `${outDir}${cheatsheet}/style.css`);
  fs.cpSync(`${cheatsheetDir}${cheatsheet}/assets`, `${outDir}${cheatsheet}/assets`, { recursive: true });
}
