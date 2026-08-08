// Real-browser regression: "play again" on the ending screen clears the
// save and returns to a clean title screen (no stale "resume" offer).
import { launchPage, beginFromTitle, playToEnding } from './helpers.mjs';

const URL = 'http://localhost:8787/';

const { browser, page, errors } = await launchPage(URL);
await beginFromTitle(page);
await playToEnding(page, ['[2]', '[1]', '[1]', '[1]', '[3]', '[1]']); // kept faith, fastest deferential path

await page.locator('.plain-btn', { hasText: 'play again' }).click();
await page.waitForSelector('.title-name', { timeout: 10000 });
const promptText = await page.textContent('.title-prompt');
if (promptText.includes('resume')) {
  console.log('FAIL: title screen still offers resume after "play again". Saw:', promptText);
  process.exit(1);
}
if (!promptText.toLowerCase().includes('begin')) {
  console.log('FAIL: expected a clean "begin" prompt, saw:', promptText);
  process.exit(1);
}
console.log('ok   "play again" clears save and returns to a clean title screen:', promptText.trim());

const realErrors = errors.filter((e) => !e.includes('favicon'));
if (realErrors.length) {
  console.log('FAIL: console/page errors:', JSON.stringify(realErrors));
  process.exit(1);
}
console.log('ok   zero console errors');

await browser.close();
console.log('\nNew-run check passed.');
