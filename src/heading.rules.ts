import MarkdownIt from 'markdown-it';
import Token from 'markdown-it/lib/token';


export function basicHeading(mit: MarkdownIt) {
  mit.renderer.rules.heading_open = function(tokens: Token[], i: number) {
    const token = tokens[i];
    return `<h${parseInt(token.tag.substring(1)) + 1}>`;
  };

  mit.renderer.rules.heading_close = function(tokens: Token[], i: number) {
    const token = tokens[i];
    return `</h${parseInt(token.tag.substring(1)) + 1}>`;
  };
};