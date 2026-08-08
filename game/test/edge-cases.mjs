import { chromium } from 'playwright-core';

const errors = [];
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
const page = await browser.newPage();
page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
page.on('pageerror', (err) => errors.push('pageerror: ' + err.message));

let failures = 0;
function check(cond, msg) {
  if (cond) { console.log('ok   ' + msg); } else { console.log('FAIL ' + msg); failures++; }
}

// --- Edge case A: reload mid-decode preserves progress ---
await page.goto('http://localhost:8787/', { waitUntil: 'load' });
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: 'load' });
await page.click('#begin-btn');
await page.waitForSelector('#main-panel .block');
await page.click('button[data-band="1"]');
await page.waitForTimeout(50);
const passesBeforeReload = await page.textContent('#passes-indicator');
const pctBeforeReload = await page.textContent('.decode-pct');
await page.reload({ waitUntil: 'load' });
await page.waitForSelector('#main-panel .block');
const passesAfterReload = await page.textContent('#passes-indicator');
const pctAfterReload = await page.textContent('.decode-pct');
check(passesBeforeReload === passesAfterReload, `passes survive reload (${passesBeforeReload} -> ${passesAfterReload})`);
check(pctBeforeReload === pctAfterReload, `decode % survives reload (${pctBeforeReload} -> ${pctAfterReload})`);

// --- Edge case B: running out of passes never blocks finalize/continue (no softlock) ---
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: 'load' });
await page.click('#begin-btn');
await page.waitForSelector('#main-panel .block');
// Burn all passes on a band nothing uses, so decode stays at 0% and passesRemaining hits 0.
for (let i = 0; i < 6; i++) {
  const btn = page.locator('button[data-band="2"]');
  if (await btn.isEnabled().catch(() => false)) { await btn.click(); await page.waitForTimeout(20); }
}
const passesAtZero = await page.textContent('#passes-indicator');
check(passesAtZero.includes('0'), `passes hit zero (${passesAtZero})`);
const finalizeStillClickable = await page.locator('#finalize-btn').isEnabled().catch(() => false);
check(finalizeStillClickable, 'finalize button still clickable with zero passes and 0% decode');
await page.locator('#finalize-btn').click();
await page.waitForTimeout(50);
const continueVisible = await page.locator('#continue-btn').count();
check(continueVisible > 0, 'continue button appears after finalizing a fully-missed signal (no softlock)');

// --- Edge case C: targeted-clean disabled once passes drop below its cost ---
// Burns passes one at a time, reading the live indicator rather than
// assuming a fixed starting count (which changed once, silently breaking
// this test — read dynamically now so a future balance tweak can't do that
// again).
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: 'load' });
await page.click('#begin-btn');
await page.waitForSelector('#main-panel .block');

async function passesLeft() {
  const txt = await page.textContent('#passes-indicator');
  return parseInt(txt.replace(/\D/g, ''), 10);
}
while (await passesLeft() > 2) {
  await page.locator('button[data-band="2"]').click();
  await page.waitForTimeout(30);
}
const cleanBtnCountAt2 = await page.locator('[data-clean]').count();
check(cleanBtnCountAt2 > 0, `targeted-clean available with ${await passesLeft()} passes left (cost is 2)`);
await page.locator('button[data-band="2"]').click();
await page.waitForTimeout(30);
const cleanBtnCountAt1 = await page.locator('[data-clean]').count();
check(cleanBtnCountAt1 === 0, 'targeted-clean correctly disabled with only 1 pass left');

console.log('console errors (excluding favicon):', JSON.stringify(errors.filter(e => !e.includes('favicon'))));
await browser.close();
process.exit(failures > 0 ? 1 : 0);
