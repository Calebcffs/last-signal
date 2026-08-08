import { chromium } from 'playwright-core';

const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
const page = await browser.newPage();
const errors = [];
page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
page.on('pageerror', (err) => errors.push('pageerror: ' + err.message));

await page.goto('https://calebcffs.github.io/last-signal/', { waitUntil: 'load' });
await page.waitForSelector('#begin-btn', { timeout: 10000 });
console.log('title screen loaded: ok');

await page.click('#begin-btn');
await page.waitForSelector('#main-panel .block', { timeout: 10000 });
console.log('Signal 1 loaded: ok');

await page.click('button[data-band="1"]');
await page.waitForTimeout(200);
const decodePct = await page.textContent('.decode-pct');
console.log('decode after one band pass:', decodePct);

await page.screenshot({ path: '/tmp/claude-1000/-home-calebclayton/516d029d-ad42-46e8-b57c-fefad6a07a50/scratchpad/live-site-check.png' });

console.log('console/page errors:', JSON.stringify(errors.filter((e) => !e.includes('favicon'))));
await browser.close();
