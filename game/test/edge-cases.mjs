// Real-browser regression: progress survives a reload mid-story. A reload
// always lands back on the title screen (by design — no auto-continue), but
// the title screen must offer "resume transmission" and clicking it must
// restore the exact node the player was on, not restart from Signal 1.
import { launchPage, beginFromTitle, skipAndWait } from './helpers.mjs';

const URL = 'http://localhost:8787/';

const { browser, page, errors } = await launchPage(URL);
await beginFromTitle(page); // -> A1 (beat)
await page.locator('.advance-hint').click(); // A1 -> A2 (choice)
await skipAndWait(page);
await page.locator('.choice-btn', { hasText: '[2]' }).first().click(); // clinical -> A3
await skipAndWait(page);

const beforeReload = await page.textContent('.choice-prompt');
console.log('on A3 before reload, prompt:', JSON.stringify(beforeReload));

await page.reload({ waitUntil: 'load' });
await page.waitForSelector('.title-name', { timeout: 10000 });
const promptText = await page.textContent('.title-prompt');
if (!promptText.includes('resume')) {
  console.log('FAIL: title screen did not offer to resume after a mid-run reload. Saw:', promptText);
  process.exit(1);
}
console.log('ok   title screen offers resume after reload:', promptText.trim());

await page.click('.title-prompt');
await skipAndWait(page);
const afterResume = await page.textContent('.choice-prompt');
if (afterResume !== beforeReload) {
  console.log('FAIL: resumed to a different node. before:', beforeReload, 'after:', afterResume);
  process.exit(1);
}
console.log('ok   resumed to the exact same node (A3), not restarted');

const realErrors = errors.filter((e) => !e.includes('favicon'));
if (realErrors.length) {
  console.log('FAIL: console/page errors during reload-persistence flow:', JSON.stringify(realErrors));
  process.exit(1);
}
console.log('ok   zero console errors');

await browser.close();
console.log('\nReload-persistence checks passed.');
