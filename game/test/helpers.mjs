// Shared browser-driving helpers for the branching-narrative UI.
import { chromium } from 'playwright-core';

export async function launchPage(url) {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  const errors = [];
  page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', (err) => errors.push('pageerror: ' + err.message));
  await page.goto(url, { waitUntil: 'load' });
  return { browser, page, errors };
}

// Clicks to skip any in-progress typewriter animation, then waits until the
// next interactive element (advance hint, choice buttons, or an ending) exists.
export async function skipAndWait(page) {
  const trans = page.locator('.transmission');
  if (await trans.count() > 0) {
    try { await trans.click({ timeout: 500, force: true }); } catch { /* nothing to skip */ }
  }
  const prompt = page.locator('.choice-prompt');
  if (await prompt.count() > 0) {
    try { await prompt.click({ timeout: 500, force: true }); } catch { /* nothing to skip */ }
  }
  await page.waitForFunction(
    () => document.querySelector('.advance-hint') || document.querySelector('.choice-btn') || document.querySelector('.ending-title'),
    { timeout: 20000 },
  );
}

export async function beginFromTitle(page) {
  await page.waitForSelector('.title-name', { timeout: 10000 });
  await page.click('.title-prompt');
  await skipAndWait(page);
}

// Drives beats automatically; for choice nodes, clicks the button whose
// label starts with the next bracket marker in optionQueue (e.g. '[2]').
export async function playToEnding(page, optionQueue) {
  let qi = 0;
  for (let step = 0; step < 30; step++) {
    await skipAndWait(page);
    if (await page.locator('.ending-title').count() > 0) break;
    if (await page.locator('.choice-btn').count() > 0) {
      const label = optionQueue[qi++];
      const btn = page.locator('.choice-btn', { hasText: label }).first();
      await btn.click();
    } else if (await page.locator('.advance-hint').count() > 0) {
      await page.locator('.advance-hint').click();
    }
  }
  await page.waitForSelector('.ending-title', { timeout: 20000 });
  const body = page.locator('.ending-body');
  if (await body.count() > 0) {
    try { await body.click({ timeout: 500, force: true }); } catch { /* nothing to skip */ }
  }
  await page.waitForTimeout(200);
  return page.textContent('.ending-title');
}
