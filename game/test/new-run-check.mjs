import { chromium } from 'playwright-core';

const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
const page = await browser.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));

await page.goto('http://localhost:8787/', { waitUntil: 'load' });
await page.evaluate(() => {
  const s = {
    cycle: 16, clearance: 4, trust: 7, passesRemaining: null, blockState: [],
    decodedArchive: { 1: { text: 'x', decodePercent: 100, blockState: [] } }, lexicon: {},
    evidenceFlags: {}, choiceLog: {}, filingHistory: [], endingReached: null,
  };
  localStorage.setItem('last-signal-save-v1', JSON.stringify(s));
});
await page.reload({ waitUntil: 'load' });
await page.waitForSelector('#new-run');
await page.click('#new-run');
await page.waitForTimeout(100);

const titleVisible = await page.locator('#begin-btn').count();
console.log('title screen shown after new-run click:', titleVisible > 0 ? 'yes' : 'NO');

const saveAfter = await page.evaluate(() => localStorage.getItem('last-signal-save-v1'));
console.log('save cleared:', saveAfter === null ? 'yes' : 'NO (' + saveAfter + ')');

// Now begin again and confirm Signal 1 shows fresh, not stale ending state
await page.click('#begin-btn');
await page.waitForSelector('#main-panel .block');
const cycleText = await page.textContent('#cycle-indicator');
console.log('cycle after new begin:', cycleText);

console.log('page errors:', JSON.stringify(errors));
await browser.close();
