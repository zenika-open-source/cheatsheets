import MarkdownIt from 'markdown-it';

export type TemplateType = {
  initializeTemplate(mit: MarkdownIt): void;
  defaultParams: any;
}