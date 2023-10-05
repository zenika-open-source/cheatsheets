import type MarkdownIt from 'markdown-it';
import MarkdownItContainer from 'markdown-it-container';
import type { TemplateType } from '../template.type';
import type Token from 'markdown-it/lib/token';
import { validateToken } from '../template.utils.ts';


function initializeTemplate(md: MarkdownIt) {

  md.use(MarkdownItContainer, 'row', {
    validate: validateToken('row'),
    render: (tokens: Token[], id: number) => {

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
      validate: validateToken('column'),
      render: (tokens: Token[], id: number) => {
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
      validate: validateToken('col-row'),
      render: (tokens: Token[], id: number) => {
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