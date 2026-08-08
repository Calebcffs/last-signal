// Headless regression test: plays the trust-meter choice points for five
// player archetypes and asserts the ending each should reach, per
// design/06-fair-play-audit.md's archetype walk. Run with `npm test`.
// No DOM, no browser — exercises src/engine.js + src/data.js only.
//
// Ending is decided by the actual CP6 filing clause (truth/hedge/comforting),
// not a trust-score threshold — see engine.js computeEnding's comment for why
// that changed during implementation testing. Trust (CP1-CP5 only, range
// -5..+5) still matters: CP6's hedge/truth clauses each require both an
// evidence flag AND a trust threshold, so CP1-CP5 gate what you're able to
// file even though they don't pick the ending directly.

import { createInitialState, makeChoice, isOptionAvailable, computeEnding, setFlag } from '../src/engine.js';
import { CHOICE_POINTS } from '../src/data.js';

let failures = 0;

function assertEqual(actual, expected, msg) {
  if (actual !== expected) {
    console.error(`FAIL: ${msg} — expected ${expected}, got ${actual}`);
    failures += 1;
  } else {
    console.log(`ok   ${msg}`);
  }
}

function pickAvailable(state, cp, preferenceOrder) {
  for (const key of preferenceOrder) {
    const opt = cp.options.find((o) => o.key === key);
    if (opt && isOptionAvailable(state, opt)) return key;
  }
  return cp.options[0].key;
}

// order: CP1, CP2, CP3, CP4, CP5, CP6
function runArchetype({ name, flags, passesAtCP3, preference }) {
  const state = createInitialState();
  Object.keys(flags).forEach((f) => setFlag(state, f));

  const order = ['CP1', 'CP2', 'CP3', 'CP4', 'CP5', 'CP6'];
  for (const cpId of order) {
    const cp = CHOICE_POINTS[cpId];
    if (cpId === 'CP3') state.passesRemaining = passesAtCP3;
    const key = pickAvailable(state, cp, preference(cpId));
    const result = makeChoice(state, cp, key);
    if (!result.ok) {
      console.error(`FAIL: ${name} — choice at ${cpId} rejected unexpectedly (${result.reason})`);
      failures += 1;
    }
  }
  const ending = computeEnding(state.choiceLog['CP6']);
  console.log(`  ${name}: trust=${state.trust} cp6="${state.choiceLog['CP6']}" ending=${ending}`);
  return { trust: state.trust, ending, cp6: state.choiceLog['CP6'] };
}

console.log('--- Archetype 1: deferential / careless (always defer, no evidence gathered) ---');
{
  const r = runArchetype({
    name: 'deferential/careless',
    flags: {},
    passesAtCP3: 0,
    preference: (cpId) => (cpId === 'CP6' ? ['comforting'] : ['defer']),
  });
  assertEqual(r.trust, -6, 'deferential/careless trust');
  assertEqual(r.cp6, 'comforting', 'deferential/careless files the comforting clause');
  assertEqual(r.ending, 'B', 'deferential/careless ending');
}

console.log('--- Archetype 2: skeptical / careful (always independent, full evidence) ---');
{
  const r = runArchetype({
    name: 'skeptical/careful',
    flags: {
      sig7_timing_checked: true,
      sig9_contradiction_checked: true,
      sig11_math_checked: true,
      sig14_smoking_gun_found: true,
    },
    passesAtCP3: 1,
    preference: (cpId) => (cpId === 'CP6' ? ['truth', 'hedge', 'comforting'] : ['independent']),
  });
  assertEqual(r.trust, 7, 'skeptical/careful trust');
  assertEqual(r.cp6, 'truth', 'skeptical/careful files the truth clause');
  assertEqual(r.ending, 'A', 'skeptical/careful ending');
}

console.log('--- Archetype 3: skeptical / careless (wants independent, zero evidence gathered) ---');
{
  const r = runArchetype({
    name: 'skeptical/careless',
    flags: {},
    passesAtCP3: 0,
    preference: (cpId) => (cpId === 'CP6' ? ['truth', 'hedge', 'comforting'] : ['independent']),
  });
  assertEqual(r.trust, 0, 'skeptical/careless trust');
  // With ZERO evidence flags, hedge is unreachable regardless of trust or
  // intent — there is nothing to hedge about. Only "comforting" is filable.
  // This is a deliberate, corrected expectation: a prior version of this
  // test (and design/06-fair-play-audit.md's Check E) expected 'C' here,
  // under the old pure-trust-threshold ending scheme. Under the current,
  // clause-authoritative scheme, filing the comforting clause always means
  // Ending B, no matter how the other five choices went. See Archetype 5
  // below for the archetype that actually demonstrates Ending C — some
  // evidence, not zero, is what the "median" player looks like.
  assertEqual(r.cp6, 'comforting', 'skeptical/careless is forced to file the comforting clause (no evidence to hedge with)');
  assertEqual(r.ending, 'B', 'skeptical/careless ending');
}

console.log('--- Archetype 4: deferential / careful (full evidence, but always defers anyway) ---');
{
  const r = runArchetype({
    name: 'deferential/careful',
    flags: {
      sig7_timing_checked: true,
      sig9_contradiction_checked: true,
      sig11_math_checked: true,
      sig14_smoking_gun_found: true,
    },
    passesAtCP3: 1,
    preference: (cpId) => (cpId === 'CP6' ? ['comforting'] : ['defer']),
  });
  // Deferential never attempts the independent option regardless of evidence
  // held, so gathering evidence changes nothing here: behaviorally identical
  // to deferential/careless, and the CP6 clause chosen (comforting, by
  // choice, not by lack of options) is what the ending reflects.
  assertEqual(r.trust, -6, 'deferential/careful trust');
  assertEqual(r.cp6, 'comforting', 'deferential/careful chooses to file the comforting clause despite having proof');
  assertEqual(r.ending, 'B', 'deferential/careful ending');
}

console.log('--- Archetype 5: skeptical / moderate (some evidence, not zero — the actual median case) ---');
{
  const r = runArchetype({
    name: 'skeptical/moderate',
    flags: { sig9_contradiction_checked: true }, // one flag, not CP2's specific gate (sig7)
    passesAtCP3: 0,
    preference: (cpId) => (cpId === 'CP6' ? ['truth', 'hedge', 'comforting'] : ['independent']),
  });
  assertEqual(r.trust, 1, 'skeptical/moderate trust');
  assertEqual(r.cp6, 'hedge', 'skeptical/moderate has enough (one flag + trust >= 1) to file the hedge clause');
  assertEqual(r.ending, 'C', 'skeptical/moderate ending — this is the genuine "median" outcome');
}

if (failures > 0) {
  console.error(`\n${failures} assertion(s) failed.`);
  process.exit(1);
} else {
  console.log('\nAll archetype assertions passed.');
}
