import MarkdownIt from 'markdown-it';
import MarkdownItContainer from 'markdown-it-container';
import { TemplateType } from '../template.type';
import { validateToken } from '../template.utils.ts';

function handleRule(tokens: any, id: number) {
  if (tokens[id].nesting === 1) {
    return `<div class="${tokens[id].info}">`;
  } else {
    return '</div>';
  }
}

function initializeTemplate(mit: MarkdownIt) {

  mit.use(MarkdownItContainer, 'recto', {
    validate: validateToken('recto'),
    render: (tokens: any, id: number) => {
      if (tokens[id].nesting === 1) {
        return `<div class="recto">`;
      } else {
        return '<div class="card-logo-container"><div class="card-logo"></div></div></div>';
      }
    }
  })
    .use(MarkdownItContainer, 'verso', {
      validate: validateToken('verso'),
      render: (tokens: any, id: number) => {
        if (tokens[id].nesting === 1) {
          return `<div class="verso">`;
        } else {
          return '<div class="card-logo-container"><div class="card-logo"></div></div></div>';
        }
      }
    })
    .use(MarkdownItContainer, 'head', {
      validate: validateToken('head'),
      render: handleRule
    })
    .use(MarkdownItContainer, 'card', {
      validate: validateToken('card'),
      render: (tokens: any, id: number) => {
        if (tokens[id].nesting === 1) {
          return `<div class="card" onclick="this.classList.toggle('flip')"><div class="inner-card">`;
        } else {
          return '</div></div>';
        }
      }
    })
    .use(MarkdownItContainer, 'img', {
      validate: validateToken('img'),
      render: (tokens: any, id: number) => {
        if (tokens[id].nesting === 1) {
          const size = tokens[id].info.split(' ')[1 ];
          return `<div class="img ${size}">`;
        } else {
          return '</div>';
        }
      }
    });
}

export default {
  initializeTemplate,
  defaultParams: {
    cardGradientColor1: 'rgba(191,30,104,1)',
    cardGradientColor2: 'rgba(238,34,56,1)',
    rectoCardLogo: '',
    versoCardLogo: '',
    cardHeadColor: 'white',
  }
} as TemplateType;