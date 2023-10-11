import type { CheatsheetContext } from './cheatsheet-context.interface.ts';
import { buildIndex, CategorizedCheatsheets, clearDist, computeCheatsheet, getCheatsheetsList } from './engine.ts';

clearDist();

const cheatsheetsContext: CheatsheetContext[] = [];
const cheatsheets: string[] = getCheatsheetsList();
for (let cheatsheet of cheatsheets) {
  cheatsheetsContext.push(await computeCheatsheet(cheatsheet));
}

const categorizedCheatsheets: CategorizedCheatsheets = cheatsheetsContext.reduce((prev: CategorizedCheatsheets, curr: CheatsheetContext) => {
  if (!Object.keys(prev).includes(curr.categoryId)) {
    prev[curr.categoryId] = [];
  }
  prev[curr.categoryId].push(curr);
  return prev;
}, {} as CategorizedCheatsheets)

buildIndex(categorizedCheatsheets);