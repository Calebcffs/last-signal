import { chromium } from 'playwright-core';
import { getSignal } from '../src/data.js';

const errors = [];
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
const page = await browser.newPage();
page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
page.on('pageerror', (err) => errors.push('pageerror: ' + err.message));

function correctBandsFor(signalNum) {
  const sig = getSignal(signalNum);
  return [...new Set(sig.blocks.map((b) => b.band))].sort();
}

function aWrongBandFor(signalNum) {
  const sig = getSignal(signalNum);
  const correct = new Set(sig.blocks.map((b) => b.band));
  for (let b = 0; b < sig.bands; b++) if (!correct.has(b)) return b;
  return 0; // no genuinely wrong band exists for this signal; fall back
}

// policy: 'skeptical' clicks the last (highest-value) enabled choice option;
// 'deferential' always clicks the first (index 0) option, which is always
// enabled by design (defer/comforting never require evidence).
//
// decodeWell: true clicks each of the signal's actual correct bands (reading
// them from data.js, the way an attentive player reading the waveform hints
// would) — NOT a blind sweep of fixed bands. A blind "click 0 then 1 every
// time" strategy is exactly the bug this test now guards against; see the
// dedicated regression at the bottom of this file.
async function playthrough(policy, decodeWell) {
  await page.goto('http://localhost:8787/', { waitUntil: 'load' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'load' });
  await page.click('#begin-btn');

  for (let signalNum = 1; signalNum <= 15; signalNum++) {
    await page.waitForSelector('#main-panel', { timeout: 10000 });

    const bandsToClick = decodeWell ? correctBandsFor(signalNum) : [aWrongBandFor(signalNum)];
    for (const band of bandsToClick) {
      const btn = page.locator(`button[data-band="${band}"]`);
      if (await btn.count() && await btn.isEnabled().catch(() => false)) {
        await btn.click();
        await page.waitForTimeout(20);
      }
    }

    const finalizeBtn = page.locator('#finalize-btn');
    if (await finalizeBtn.count()) {
      await finalizeBtn.click();
      await page.waitForTimeout(30);
    }

    const lexInput = page.locator('#lexicon-input');
    if (await lexInput.count()) {
      const guess = signalNum === 2
        ? 'probably a backup array part number'
        : 'actually a prior operator ID code, not a part';
      await lexInput.fill(guess);
      await page.locator('#lexicon-submit').click();
      await page.waitForTimeout(30);
    }

    const choiceButtons = page.locator('[data-choice]');
    const count = await choiceButtons.count();
    if (count > 0) {
      if (policy === 'deferential') {
        await choiceButtons.nth(0).click();
      } else {
        let lastEnabledIdx = -1;
        for (let i = 0; i < count; i++) {
          if (await choiceButtons.nth(i).isEnabled()) lastEnabledIdx = i;
        }
        await choiceButtons.nth(Math.max(lastEnabledIdx, 0)).click();
      }
      await page.waitForTimeout(30);
    }

    const continueBtn = page.locator('#continue-btn');
    if (await continueBtn.count()) {
      await continueBtn.click();
      await page.waitForTimeout(30);
    } else {
      console.log(`  [${policy}/${decodeWell ? 'careful' : 'careless'}] WARNING: no continue at signal ${signalNum}`);
    }
  }

  await page.waitForTimeout(150);
  const endingTitle = await page.textContent('#main-panel h2').catch(() => null);
  const finalState = await page.evaluate(() => JSON.parse(localStorage.getItem('last-signal-save-v1')));
  return { endingTitle, trust: finalState.trust, evidenceFlags: finalState.evidenceFlags };
}

let failures = 0;

// Ending is decided by the actual CP6 filing clause (engine.js computeEnding).
// A "careless" run here resolves zero blocks correctly (aWrongBandFor picks a
// band no block in the signal uses), so it gathers zero evidence — with
// nothing to hedge about, CP6 only offers "comforting", same as the headless
// archetypes.test.js's "skeptical/careless" archetype. KEPT FAITH, not SPLIT
// SIGNAL, is correct here; see that test's comments for the full reasoning.
const runs = [
  { name: 'deferential/careless', policy: 'deferential', decodeWell: false, expectTitle: 'KEPT FAITH' },
  { name: 'skeptical/careful', policy: 'skeptical', decodeWell: true, expectTitle: 'FULL DISCLOSURE' },
  { name: 'skeptical/careless', policy: 'skeptical', decodeWell: false, expectTitle: 'KEPT FAITH' },
  { name: 'deferential/careful', policy: 'deferential', decodeWell: true, expectTitle: 'KEPT FAITH' },
];

for (const run of runs) {
  const result = await playthrough(run.policy, run.decodeWell);
  const pass = result.endingTitle === run.expectTitle;
  if (!pass) failures++;
  console.log(`${pass ? 'ok  ' : 'FAIL'} ${run.name}: trust=${result.trust} ending="${result.endingTitle}" (expected "${run.expectTitle}")`);
}

// --- Direct regression for the bug caught in review: blind "sweep band 0
// then band 1 on every signal, ignore band 2 entirely" must NOT be able to
// reach Ending A for free. It should fail to ever pick up the Signal 14
// smoking gun (band 2 there), capping it at the hedge tier at best.
async function blindSweepPlaythrough() {
  await page.goto('http://localhost:8787/', { waitUntil: 'load' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'load' });
  await page.click('#begin-btn');

  for (let signalNum = 1; signalNum <= 15; signalNum++) {
    await page.waitForSelector('#main-panel', { timeout: 10000 });
    for (const band of [0, 1]) {
      const btn = page.locator(`button[data-band="${band}"]`);
      if (await btn.count() && await btn.isEnabled().catch(() => false)) {
        await btn.click();
        await page.waitForTimeout(15);
      }
    }
    const finalizeBtn = page.locator('#finalize-btn');
    if (await finalizeBtn.count()) { await finalizeBtn.click(); await page.waitForTimeout(20); }
    const lexInput = page.locator('#lexicon-input');
    if (await lexInput.count()) {
      const guess = signalNum === 2 ? 'probably a backup array part number' : 'actually a prior operator ID code, not a part';
      await lexInput.fill(guess);
      await page.locator('#lexicon-submit').click();
      await page.waitForTimeout(20);
    }
    // Always try for the best-available option, same as skeptical/careful above.
    const choiceButtons = page.locator('[data-choice]');
    const count = await choiceButtons.count();
    if (count > 0) {
      let lastEnabledIdx = -1;
      for (let i = 0; i < count; i++) if (await choiceButtons.nth(i).isEnabled()) lastEnabledIdx = i;
      await choiceButtons.nth(Math.max(lastEnabledIdx, 0)).click();
      await page.waitForTimeout(20);
    }
    const continueBtn = page.locator('#continue-btn');
    if (await continueBtn.count()) { await continueBtn.click(); await page.waitForTimeout(20); }
  }
  await page.waitForTimeout(150);
  const endingTitle = await page.textContent('#main-panel h2').catch(() => null);
  const finalState = await page.evaluate(() => JSON.parse(localStorage.getItem('last-signal-save-v1')));
  return { endingTitle, trust: finalState.trust, evidenceFlags: finalState.evidenceFlags };
}

const blindResult = await blindSweepPlaythrough();
const blindPass = blindResult.endingTitle !== 'FULL DISCLOSURE' && !blindResult.evidenceFlags.sig14_smoking_gun_found;
if (!blindPass) failures++;
console.log(`${blindPass ? 'ok  ' : 'FAIL'} blind-sweep-0-and-1-only (regression for the free-decode bug): trust=${blindResult.trust} ending="${blindResult.endingTitle}" smoking_gun_found=${!!blindResult.evidenceFlags.sig14_smoking_gun_found} (must NOT be Full Disclosure / must NOT have found the smoking gun)`);

console.log('console errors (excluding favicon):', JSON.stringify(errors.filter(e => !e.includes('favicon'))));
await browser.close();
process.exit(failures > 0 ? 1 : 0);
