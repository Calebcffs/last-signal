// Real-browser regression: drives all seven endings through actual clicks
// on the rendered UI (not the engine directly — see archetypes.test.js for
// that), asserting zero console/page errors and the expected ending title.
import { launchPage, beginFromTitle, playToEnding } from './helpers.mjs';

const URL = 'http://localhost:8787/';

const ARCHETYPES = [
  { name: 'full disclosure', queue: ['[1]', '[2]', '[2]', '[2]', '[2]', '[1]', '[1]'], expect: 'FULL DISCLOSURE' },
  { name: 'kept faith', queue: ['[2]', '[1]', '[1]', '[1]', '[3]', '[2]', '[1]'], expect: 'KEPT FAITH' },
  { name: 'denial', queue: ['[2]', '[1]', '[1]', '[1]', '[3]', '[2]', '[2]'], expect: 'DENIAL' },
  { name: 'split signal', queue: ['[1]', '[2]', '[2]', '[1]', '[2]', '[2]', '[3]'], expect: 'SPLIT SIGNAL' },
  { name: 'mutiny', queue: ['[2]', '[1]', '[1]', '[1]', '[1]', '[1]', '[3]'], expect: 'MUTINY' },
  { name: 'broken chain', queue: ['[2]', '[1]', '[1]', '[3]', '[2]', '[2]', '[1]'], expect: 'BROKEN CHAIN' },
  { name: 'ghost shift', queue: ['[2]', '[1]', '[1]', '[1]', '[3]', '[1]', '[3]'], expect: 'GHOST SHIFT' },
];

let failed = false;

for (const { name, queue, expect } of ARCHETYPES) {
  const { browser, page, errors } = await launchPage(URL);
  await beginFromTitle(page);
  const title = (await playToEnding(page, queue)).trim();
  const realErrors = errors.filter((e) => !e.includes('favicon'));
  if (title !== expect) {
    console.log(`FAIL ${name}: expected "${expect}", got "${title}"`);
    failed = true;
  } else if (realErrors.length) {
    console.log(`FAIL ${name}: reached "${title}" but had console errors: ${JSON.stringify(realErrors)}`);
    failed = true;
  } else {
    console.log(`ok   ${name} -> ${title}`);
  }
  await browser.close();
}

if (failed) {
  console.log('\nSome archetypes failed.');
  process.exit(1);
}
console.log('\nAll seven endings reachable via real UI interaction, zero console errors.');
