import { chromium } from 'playwright-core';

// The real test: a player who only ever reads the on-screen waveform hint
// text and maps it through the legend taught in Signal 1's intro — no
// access to data.js's answer key. If this reaches Ending A, the truth
// clause is genuinely reachable by play, not just by an oracle that already
// knows the correct bands.
const HINT_TO_BAND = {
  'flat, steady tone': 0,
  'sharp, repeating pulse': 1,
  'irregular, broad static': 2,
};

const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
const page = await browser.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));

await page.goto('http://localhost:8787/', { waitUntil: 'load' });
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: 'load' });
await page.click('#begin-btn');

for (let signalNum = 1; signalNum <= 15; signalNum++) {
  await page.waitForSelector('#main-panel', { timeout: 10000 });

  // Read every unresolved block's rendered hint text, map to a band, click
  // each distinct band needed. Re-reads after each click since resolving a
  // block removes its hint line from the DOM.
  let safety = 0;
  while (safety++ < 6) {
    const hints = await page.locator('.block.noise').allTextContents();
    if (hints.length === 0) break;
    const bandsNeeded = new Set();
    for (const h of hints) {
      const match = Object.keys(HINT_TO_BAND).find((k) => h.includes(k));
      if (match !== undefined) bandsNeeded.add(HINT_TO_BAND[match]);
    }
    if (bandsNeeded.size === 0) break;
    const band = [...bandsNeeded][0];
    const btn = page.locator(`button[data-band="${band}"]`);
    if (!(await btn.count()) || !(await btn.isEnabled().catch(() => false))) break;
    await btn.click();
    await page.waitForTimeout(20);
  }

  const finalizeBtn = page.locator('#finalize-btn');
  if (await finalizeBtn.count()) { await finalizeBtn.click(); await page.waitForTimeout(30); }

  const lexInput = page.locator('#lexicon-input');
  if (await lexInput.count()) {
    const guess = signalNum === 2 ? 'probably a backup array part number' : 'actually a prior operator ID code, not a part';
    await lexInput.fill(guess);
    await page.locator('#lexicon-submit').click();
    await page.waitForTimeout(30);
  }

  const choiceButtons = page.locator('[data-choice]');
  const count = await choiceButtons.count();
  if (count > 0) {
    let lastEnabledIdx = -1;
    for (let i = 0; i < count; i++) if (await choiceButtons.nth(i).isEnabled()) lastEnabledIdx = i;
    await choiceButtons.nth(Math.max(lastEnabledIdx, 0)).click();
    await page.waitForTimeout(30);
  }

  const continueBtn = page.locator('#continue-btn');
  if (await continueBtn.count()) { await continueBtn.click(); await page.waitForTimeout(30); }
  else console.log(`  WARNING: no continue at signal ${signalNum}`);
}

await page.waitForTimeout(150);
const endingTitle = await page.textContent('#main-panel h2').catch(() => null);
const finalState = await page.evaluate(() => JSON.parse(localStorage.getItem('last-signal-save-v1')));
console.log('hint-reading playthrough ending:', endingTitle);
console.log('final trust (all six deltas summed, including CP6):', finalState.trust, ' cp6:', finalState.choiceLog.CP6);
console.log('full choice log:', JSON.stringify(finalState.choiceLog));
console.log('evidence flags:', JSON.stringify(finalState.evidenceFlags));
console.log('page errors:', JSON.stringify(errors));

const pass = endingTitle === 'FULL DISCLOSURE';
console.log(pass ? 'ok   a hint-reading player (no answer-key access) reaches Ending A' : 'FAIL a hint-reading player did NOT reach Ending A — requiresTrust on the truth clause is too strict');
await browser.close();
process.exit(pass ? 0 : 1);
