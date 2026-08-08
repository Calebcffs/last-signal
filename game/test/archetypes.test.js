// Headless regression: walks fixed choice sequences through the branching
// engine and asserts on final ending + key gating behavior. No DOM, no browser.
import assert from 'node:assert/strict';
import { createInitialState, choose, advance, getAvailableOptions, getEnding, isChoicePending } from '../src/engine.js';

function play(sequence) {
  let state = createInitialState();
  for (const step of sequence) {
    while (!state.ended && !isChoicePending(state)) {
      state = advance(state);
    }
    if (state.ended) break;
    state = choose(state, step);
  }
  while (!state.ended && !isChoicePending(state)) state = advance(state);
  return state;
}

function run(name, sequence, expectedEndingId) {
  const state = play(sequence);
  assert.equal(state.ended, true, `${name}: should have ended`);
  const ending = getEnding(state);
  assert.equal(ending.id, expectedEndingId, `${name}: expected ${expectedEndingId}, got ${ending.id}`);
  console.log(`ok  ${name} -> ${ending.id} (${ending.title})`);
}

run('full disclosure, evidence-heavy', ['warm', 'push', 'dig', 'flag', 'gather', 'truth'], 'T1');
run('kept faith, deferential throughout', ['clinical', 'routine', 'believe', 'clean', 'lookaway', 'comforting'], 'T2');
run('denial, never investigates', ['clinical', 'routine', 'believe', 'clean', 'lookaway', 'normal'], 'T4');
run('split signal, partial evidence', ['warm', 'push', 'dig', 'clean', 'gather', 'hedge'], 'T3');
run('mutiny, confronts ARC directly', ['clinical', 'routine', 'believe', 'clean', 'confront', 'mutiny'], 'T5');
run('broken chain overrides the chosen ending', ['clinical', 'routine', 'believe', 'direct', 'gather', 'comforting'], 'T6');
run('ghost shift, silence available from any path', ['clinical', 'routine', 'believe', 'clean', 'lookaway', 'silence'], 'T7');

// Gating: 'dig' shouldn't even appear at C1 without PUSHED_BACK.
{
  let state = createInitialState();
  state = advance(state); // A1 -> A2
  state = choose(state, 'clinical'); // A2 -> A3
  state = choose(state, 'routine'); // A3 -> B1 (no PUSHED_BACK)
  state = advance(state); // B1 -> C1
  const opts = getAvailableOptions(state).map((o) => o.key);
  assert.ok(!opts.includes('dig'), 'dig should be unavailable without PUSHED_BACK');
  assert.ok(opts.includes('believe'), 'believe should always be available at C1');
  console.log('ok  gating: dig hidden without PUSHED_BACK');
}

// Gating: J1's 'truth' requires INVESTIGATION >= 2; 'mutiny' requires RISK.
{
  let state = createInitialState();
  const seq = ['clinical', 'routine', 'believe', 'clean', 'lookaway'];
  for (const step of seq) {
    while (!isChoicePending(state)) state = advance(state);
    state = choose(state, step);
  }
  while (!isChoicePending(state)) state = advance(state);
  const opts = getAvailableOptions(state).map((o) => o.key);
  assert.ok(!opts.includes('truth'), 'truth should be unavailable with 0 investigation');
  assert.ok(!opts.includes('mutiny'), 'mutiny should be unavailable without RISK');
  assert.ok(opts.includes('normal'), 'normal should be available with 0 investigation');
  assert.ok(opts.includes('silence'), 'silence should always be available');
  console.log('ok  gating: J1 truth/mutiny hidden, normal/silence available');
}

console.log('\nAll archetype and gating tests passed.');
