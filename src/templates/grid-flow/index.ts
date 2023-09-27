import MarkdownIt from 'markdown-it';
import MarkdownItContainer from 'markdown-it-container';
import { basicHeading } from '../common';
import { TemplateType } from '../template.type';


function initializeTemplate(mit: MarkdownIt) {
  basicHeading(mit);

  mit.use(MarkdownItContainer, 'row', {
    render: (tokens: any, id: number) => {

      if (tokens[id].nesting === 1) {
        const row = tokens[id].info.split(' ')[2];
        if (row) {
          return `<div class="row" style="--row:${row}">`;
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
            return `<div class="col" style="--col:${col}">`;
          } else {
            return `<div class="col">`;
          }
        } else {
          return '</div>';
        }
      }
    })
    .use(MarkdownItContainer, 'col-row', {
      render: (tokens: any, id: number) => {
        if (tokens[id].nesting === 1) {
          const col = tokens[id].info.split(' ')[2];
          const row = tokens[id].info.split(' ')[3];
          if (col) {
            return `<div class="col row" style="--col:${col};--row:${row}">`;
          } else {
            return `<div class="col row">`;
          }
        } else {
          return '</div>';
        }
      }
    });
}

export default {
  initializeTemplate,
  defaultParams: {
    colNumber: 4
  }
} as TemplateType;