import { buildIndex, clearDist, computeCheatsheet, getCheatsheetsList } from './engine.ts';

clearDist();

const cheatsheetsContext: any[] = [];
const cheatsheets: string[] = getCheatsheetsList();
for (let cheatsheet of cheatsheets) {
  cheatsheetsContext.push(await computeCheatsheet(cheatsheet));
}

buildIndex(cheatsheetsContext);