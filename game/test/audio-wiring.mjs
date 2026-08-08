// Real-browser regression: confirms the typewriter's terminal-blip sound is
// actually wired up and firing — not just present as dead code. Every other
// browser test clicks to skip the typewriter (that's the point, for speed),
// which means the blip path had never executed end to end until this test.
// Patches AudioContext.prototype.createOscillator to count calls, then lets
// one short screen type out unskipped.
import { launchPage } from './helpers.mjs';

const URL = 'http://localhost:8787/';

const { browser, page, errors } = await launchPage(URL);

await page.addInitScript(() => {
  window.__oscCount = 0;
  const proto = window.AudioContext.prototype;
  const original = proto.createOscillator;
  proto.createOscillator = function patched(...args) {
    window.__oscCount += 1;
    return original.apply(this, args);
  };
});
await page.goto(URL, { waitUntil: 'load' }); // reload so the init script is present for this load

await page.waitForSelector('.title-name', { timeout: 10000 });
await page.click('.title-prompt'); // begin -> triggers ensureAudio() on a real user gesture, intro starts typing unskipped

// let a few characters of the intro type out without skipping
await page.waitForTimeout(600);

const oscCount = await page.evaluate(() => window.__oscCount);
const ctxState = await page.evaluate(() => {
  // main.js keeps its AudioContext in module scope, not on window — infer
  // liveness from whether any oscillators were actually created instead.
  return window.__oscCount > 0 ? 'blips-fired' : 'silent';
});

console.log('oscillators created during unskipped typing:', oscCount, `(${ctxState})`);
if (oscCount === 0) {
  console.log('FAIL: no terminal-blip sound fired during unskipped typewriter animation.');
  process.exit(1);
}

const realErrors = errors.filter((e) => !e.includes('favicon'));
if (realErrors.length) {
  console.log('FAIL: console/page errors:', JSON.stringify(realErrors));
  process.exit(1);
}
console.log('ok   zero console errors');

await browser.close();
console.log('\nAudio wiring check passed — the typewriter blip genuinely fires.');
