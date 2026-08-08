// Headless regression: walks fixed choice sequences through the branching
// engine and asserts on final ending + key gating behavior, then brute-forces
// every reachable path to verify every assembled ending body is clean. No
// DOM, no browser.
import assert from 'node:assert/strict';
import { createInitialState, choose, getAvailableOptions, getEnding, isChoicePending } from '../src/engine.js';
import { VARIANTS } from '../src/data.js';

function play(sequence) {
  let state = createInitialState();
  for (const step of sequence) {
    if (state.ended || !isChoicePending(state)) break;
    state = choose(state, step);
  }
  return state;
}

function run(name, sequence, expectedEndingId) {
  const state = play(sequence);
  assert.equal(state.ended, true, `${name}: should have ended`);
  const ending = getEnding(state);
  assert.equal(ending.id, expectedEndingId, `${name}: expected ${expectedEndingId}, got ${ending.id}`);
  console.log(`ok  ${name} -> ${ending.id} (${ending.title})`);
}

run('full disclosure, evidence-heavy, reads the archive', ['warm', 'push', 'dig', 'flag', 'gather', 'open', 'truth'], 'T1');
run('kept faith, deferential throughout, skips the archive', ['clinical', 'routine', 'believe', 'clean', 'lookaway', 'close', 'comforting'], 'T2');
run('denial, never investigates', ['clinical', 'routine', 'believe', 'clean', 'lookaway', 'close', 'normal'], 'T4');
run('split signal, partial evidence, skips the archive', ['warm', 'push', 'dig', 'clean', 'gather', 'close', 'hedge'], 'T3');
run('mutiny, confronts ARC directly, reads the archive', ['clinical', 'routine', 'believe', 'clean', 'confront', 'open', 'mutiny'], 'T5');
run('broken chain overrides the chosen ending', ['clinical', 'routine', 'believe', 'direct', 'gather', 'close', 'comforting'], 'T6');
run('ghost shift, silence available from any path', ['clinical', 'routine', 'believe', 'clean', 'lookaway', 'open', 'silence'], 'T7');

// Gating: 'dig' shouldn't even appear at the "wrong note" choice without PUSHED_BACK.
{
  let state = createInitialState();
  state = choose(state, 'clinical');
  state = choose(state, 'routine'); // no PUSHED_BACK
  const opts = getAvailableOptions(state).map((o) => o.key);
  assert.ok(!opts.includes('dig'), 'dig should be unavailable without PUSHED_BACK');
  assert.ok(opts.includes('believe'), 'believe should always be available');
  console.log('ok  gating: dig hidden without PUSHED_BACK');
}

// Gating: the final filing's 'truth' requires INVESTIGATION >= 2; 'mutiny' requires RISK.
{
  let state = createInitialState();
  const seq = ['clinical', 'routine', 'believe', 'clean', 'lookaway', 'close'];
  for (const step of seq) state = choose(state, step);
  const opts = getAvailableOptions(state).map((o) => o.key);
  assert.ok(!opts.includes('truth'), 'truth should be unavailable with 0 investigation');
  assert.ok(!opts.includes('mutiny'), 'mutiny should be unavailable without RISK');
  assert.ok(opts.includes('normal'), 'normal should be available with 0 investigation');
  assert.ok(opts.includes('silence'), 'silence should always be available');
  console.log('ok  gating: final-filing truth/mutiny hidden, normal/silence available');
}

// Brute-force every reachable path and check every assembled ending body:
// no unresolved {{slot}} placeholders, no paragraph starting lowercase, no
// empty-string substitution. This is the check that would have caught the
// T5 {{proof}} capitalization bug — the earlier suite only ever rendered one
// of the sixteen reachable ending texts.
const seenTexts = new Set();
const perEnding = {};
const bodiesByEnding = {};

{
  function walk(state) {
    if (state.ended) {
      const ending = getEnding(state);
      for (const line of ending.lines) {
        assert.ok(!line.includes('{{'), `${ending.id}: unresolved placeholder in "${line}"`);
        assert.ok(line.length > 0, `${ending.id}: empty line in assembled body`);
        assert.match(line, /^[A-Z0-9\[]/, `${ending.id}: paragraph doesn't start with a capital: "${line}"`);
      }
      const fullText = ending.lines.join(' ');
      const tuple = `${ending.id}|${fullText}`;
      if (!seenTexts.has(tuple)) {
        seenTexts.add(tuple);
        perEnding[ending.id] = (perEnding[ending.id] || 0) + 1;
        (bodiesByEnding[ending.id] ||= []).push(fullText);
      }
      return;
    }
    if (!isChoicePending(state)) return;
    for (const opt of getAvailableOptions(state)) {
      walk(choose(structuredClone(state), opt.key));
    }
  }
  walk(createInitialState());

  const total = Object.values(perEnding).reduce((a, b) => a + b, 0);
  assert.equal(Object.keys(perEnding).length, 7, 'expected all 7 endings to be reachable');
  console.log(`ok  ${total} distinct assembled ending texts across 7 endings, all clean:`, perEnding);
}

// Inverse check: every authored variant string must actually appear in at
// least one reachable ending body. Without this, a variant can go dead
// (unreachable given the gating rules) and nothing would ever notice —
// which is exactly what happened to four strings before this check existed.
{
  const uncalled = [];
  for (const [dim, values] of Object.entries(VARIANTS)) {
    for (const [value, byEnding] of Object.entries(values)) {
      for (const [endingId, text] of Object.entries(byEnding)) {
        const bodies = bodiesByEnding[endingId] || [];
        const used = bodies.some((body) => body.includes(text));
        if (!used) uncalled.push(`${dim}.${value}.${endingId}`);
      }
    }
  }
  assert.deepEqual(uncalled, [], `dead/unreachable variant strings found: ${uncalled.join(', ')}`);
  console.log('ok  every authored variant string is reachable by at least one real path');
}

console.log('\nAll archetype, gating, and ending-assembly tests passed.');
