import bodyParser from 'body-parser';
import * as crypto from 'crypto';
import cors from 'cors';
import express, { Request, Response } from 'express';
import { CheatsheetContext } from './cheatsheet-context.interface.ts';
import { cleanGenerated, createMarkdownEngine, generateCheatsheet } from './engine.ts';

const app = express();
app.use(cors());
const port: number = 3000;
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.post('/generate', urlencodedParser, async (req: Request, res: Response) => {
  const md: string = req.body.markdown;
  const template: string = req.body.template;
  const title: string = req.body.title;
  const mainColor: string = req.body.mainColor;
  const secondaryColor: string = req.body.secondaryColor;
  const markdownGenerator = await createMarkdownEngine(template);
  const context: CheatsheetContext = {
    cheatsheet: 'tmp',
    title,
    description: '',
    mainColor: mainColor ?? '#ff0000',
    secondaryColor: secondaryColor ?? '#ff0000',
    content: markdownGenerator.render(md),
    icon: ''
  };
  const uri = `generated-${crypto.randomUUID()}`;
  generateCheatsheet(template, uri, context);
  res.send({
    uri: `/${uri}/cheatsheet.html`
  });
  cleanGenerated();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
