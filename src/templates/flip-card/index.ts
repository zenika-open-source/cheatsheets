import MarkdownIt from 'markdown-it';
import MarkdownItContainer from 'markdown-it-container';
import { TemplateType } from '../template.type';

function handleRule(tokens: any, id: number) {
  if (tokens[id].nesting === 1) {
    return `<div class="${tokens[id].info}">`;
  } else {
    return '</div>';
  }
}

function initializeTemplate(mit: MarkdownIt) {

  mit.use(MarkdownItContainer, 'recto', {
      render: (tokens: any, id: number) => {
        if (tokens[id].nesting === 1) {
          return `<div class="recto">`;
        } else {
          return '<div class="card-logo-container"><div class="card-logo"></div></div></div>';
        }
      }})
    .use(MarkdownItContainer, 'verso', {
      render: (tokens: any, id: number) => {
        if (tokens[id].nesting === 1) {
          return `<div class="verso">`;
        } else {
          return '<div class="card-logo-container"><div class="card-logo"></div></div></div>';
        }
      }})
    .use(MarkdownItContainer, 'head', {
      render: handleRule
    })
    .use(MarkdownItContainer, 'card', {
      render: (tokens: any, id: number) => {
        if (tokens[id].nesting === 1) {
          return `<div class="card" onclick="this.classList.toggle('flip')"><div class="inner-card">`;
        } else {
          return '</div></div>';
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