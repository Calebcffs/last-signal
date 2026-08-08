// Real-browser regression: progress survives a reload mid-story. A reload
// always lands back on the title screen (by design — no auto-continue), but
// the title screen must offer "resume transmission" and clicking it must
// restore the exact node the player was on, not restart from the first screen.
import { launchPage, beginFromTitle, skipAndWait } from './helpers.mjs';

const URL = 'http://localhost:8787/';

const { browser, page, errors } = await launchPage(URL);
await beginFromTitle(page); // -> N1 (choice)
await page.locator('.choice-btn', { hasText: '[2]' }).first().click(); // clinical -> N2
await skipAndWait(page);

const beforeReload = await page.textContent('.choice-prompt');
console.log('on N2 before reload, prompt:', JSON.stringify(beforeReload));

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
console.log('ok   resumed to the exact same node (N2), not restarted');

const realErrors = errors.filter((e) => !e.includes('favicon'));
if (realErrors.length) {
  console.log('FAIL: console/page errors during reload-persistence flow:', JSON.stringify(realErrors));
  process.exit(1);
}
console.log('ok   zero console errors');

await browser.close();

// Stale-save case: a save pointing at a node ID that no longer exists (e.g.
// after a content rename) must not crash the title screen — it should be
// treated as no save at all. Caught for real: the branching graph's node
// IDs were renamed after this build was already live, so anyone who had
// played the previous version had exactly this save sitting in their
// browser.
{
  const { browser: browser2, page: page2, errors: errors2 } = await launchPage(URL);
  await page2.evaluate(() => {
    localStorage.setItem('last-signal-save-v3', JSON.stringify({
      nodeId: 'A3', // a node ID from the pre-rename graph — no longer exists
      flags: { BOND: 'clinical', PUSHED_BACK: false, INVESTIGATION: 0, RISK: false, CHAIN_ALARMED: false },
      ended: false,
      endingId: null,
      endingBaseChosen: null,
    }));
  });
  await page2.reload({ waitUntil: 'load' });
  await page2.waitForSelector('.title-name', { timeout: 10000 });
  const stalePrompt = await page2.textContent('.title-prompt');
  if (stalePrompt.includes('resume')) {
    console.log('FAIL: title screen offered to resume a save pointing at a node that no longer exists:', stalePrompt);
    process.exit(1);
  }
  console.log('ok   stale save (unknown node ID) is treated as no save:', stalePrompt.trim());

  const staleErrors = errors2.filter((e) => !e.includes('favicon'));
  if (staleErrors.length) {
    console.log('FAIL: console/page errors from a stale save:', JSON.stringify(staleErrors));
    process.exit(1);
  }
  console.log('ok   zero console errors from a stale save');
  await browser2.close();
}

console.log('\nReload-persistence checks passed.');
