// Points directly at the deployed Pages URL, not localhost — run this after
// any deploy to confirm the branching-narrative build is actually live.
import { launchPage, beginFromTitle, playToEnding } from './helpers.mjs';

const URL = 'https://calebcffs.github.io/last-signal/';

const { browser, page, errors } = await launchPage(URL);
await beginFromTitle(page);
console.log('title screen loaded and begin worked: ok');

const title = await playToEnding(page, ['[1]', '[2]', '[2]', '[2]', '[2]', '[1]', '[1]']);
console.log('reached ending:', title.trim(), '(expected FULL DISCLOSURE)');

await page.screenshot({ path: '/tmp/claude-1000/-home-calebclayton/516d029d-ad42-46e8-b57c-fefad6a07a50/scratchpad/live-site-check.png' });

const realErrors = errors.filter((e) => !e.includes('favicon'));
console.log('console/page errors:', JSON.stringify(realErrors));
if (realErrors.length || title.trim() !== 'FULL DISCLOSURE') process.exit(1);

await browser.close();
console.log('\nLive smoke test passed.');
