// Pure game logic. No DOM references — must run identically in a browser
// <script type="module"> and under plain `node`. All functions are
// state-in/state-out; nothing here reads localStorage or touches the page.

export const TARGETED_CLEAN_COST = 2;

export function createInitialState() {
  return {
    cycle: 1,
    clearance: 1,
    trust: 0,
    passesRemaining: null, // set by startSignal
    blockState: [],        // per-block: 'noise' | 'resolved' | 'nearmiss'
    decodedArchive: {},    // signalId -> assembled revealed text (final, for archive/reread)
    lexicon: {},           // symbolId -> { current: string|null, history: string[] }
    evidenceFlags: {},     // flagName -> true
    choiceLog: {},         // cpId -> optionKey
    filingHistory: [],     // { atSignal, optionKey }
    endingReached: null,
  };
}

export function startSignal(state, signal) {
  state.passesRemaining = signal.passes;
  state.blockState = signal.blocks.map(() => 'noise');
  return state;
}

// Applies one broad filter pass at `bandIndex` across every unresolved block.
export function applyBand(state, signal, bandIndex) {
  if (state.passesRemaining <= 0) return { ok: false, reason: 'no-passes' };
  state.passesRemaining -= 1;
  signal.blocks.forEach((block, i) => {
    if (state.blockState[i] === 'resolved') return;
    if (block.band === bandIndex) {
      state.blockState[i] = 'resolved';
      if (block.setsFlag) setFlag(state, block.setsFlag);
    } else if (Math.abs(block.band - bandIndex) === 1) {
      state.blockState[i] = 'nearmiss';
    }
    // else stays 'noise'
  });
  return { ok: true };
}

// Forces one specific block to resolve correctly regardless of band accuracy.
export function targetedClean(state, signal, blockIndex) {
  if (state.passesRemaining < TARGETED_CLEAN_COST) return { ok: false, reason: 'no-passes' };
  state.passesRemaining -= TARGETED_CLEAN_COST;
  state.blockState[blockIndex] = 'resolved';
  const block = signal.blocks[blockIndex];
  if (block.setsFlag) setFlag(state, block.setsFlag);
  return { ok: true };
}

export function getDecodePercent(state, signal) {
  const resolved = state.blockState.filter((s) => s === 'resolved').length;
  return Math.round((resolved / signal.blocks.length) * 100);
}

export function finalizeSignal(state, signal) {
  const text = signal.blocks
    .map((block, i) => {
      if (state.blockState[i] === 'resolved') return block.text;
      if (state.blockState[i] === 'nearmiss') return block.nearMiss || '[garbled — near-miss band]';
      return '[UNRESOLVED]';
    })
    .join(' ');
  state.decodedArchive[signal.id] = {
    text,
    decodePercent: getDecodePercent(state, signal),
    blockState: [...state.blockState],
  };
  return state;
}

// --- Lexicon ---------------------------------------------------------------

export function commitLexicon(state, symbolId, guess, cycle) {
  const trimmed = (guess || '').trim().slice(0, 60);
  if (!trimmed) return { ok: false, reason: 'empty' };
  state.lexicon[symbolId] = { current: trimmed, history: [] };
  return { ok: true };
}

export function reviseLexicon(state, symbolId, newGuess, cycle) {
  const trimmed = (newGuess || '').trim().slice(0, 60);
  if (!trimmed) return { ok: false, reason: 'empty' };
  const entry = state.lexicon[symbolId];
  if (!entry) return commitLexicon(state, symbolId, newGuess, cycle);
  entry.history.push(entry.current);
  entry.current = trimmed;
  return { ok: true };
}

// --- Evidence flags ----------------------------------------------------------

export function setFlag(state, flagName) {
  state.evidenceFlags[flagName] = true;
  return state;
}

export function hasFlag(state, flagName) {
  return !!state.evidenceFlags[flagName];
}

// --- Choice points -----------------------------------------------------------

export function isOptionAvailable(state, option) {
  if (option.requiresFlag && !hasFlag(state, option.requiresFlag)) return false;
  if (option.requiresAnyFlag && !option.requiresAnyFlag.some((f) => hasFlag(state, f))) return false;
  if (option.requiresPasses && (state.passesRemaining ?? 0) < option.requiresPasses) return false;
  if (option.requiresTrust !== undefined && state.trust < option.requiresTrust) return false;
  return true;
}

export function makeChoice(state, choicePoint, optionKey) {
  const option = choicePoint.options.find((o) => o.key === optionKey);
  if (!option) return { ok: false, reason: 'no-such-option' };
  if (!isOptionAvailable(state, option)) return { ok: false, reason: 'not-available' };
  state.trust += option.delta;
  state.choiceLog[choicePoint.id] = optionKey;
  return { ok: true, delta: option.delta };
}

// --- Ending --------------------------------------------------------------

// Ending is determined by the actual CP6 filing clause, not a trust
// threshold — the epilogue text narrates a specific filing, so what's shown
// must match what was actually filed (design/01-canon-and-endings.md §6,
// corrected during implementation testing: a pure trust-threshold scheme let
// a player reach the "Full Disclosure" epilogue via CP1-CP5 alone while
// having filed only a hedge at CP6, which the text then contradicted).
// Trust still matters — it's CP1-CP5's accumulated score, and CP6's hedge/
// truth clauses require both the relevant evidence flag AND a trust
// threshold (see CP6's options in data.js), so CP1-CP5 aren't inert; they
// gate what you're able to file, and the filing itself decides the ending.
export function computeEnding(cp6Choice) {
  if (cp6Choice === 'truth') return 'A';
  if (cp6Choice === 'comforting') return 'B';
  return 'C'; // 'hedge', or (should not happen in practice) no CP6 choice logged
}

export function finalizeEnding(state) {
  state.endingReached = computeEnding(state.choiceLog['CP6']);
  return state;
}

// --- Cycle progression -----------------------------------------------------

export function advanceCycle(state) {
  state.cycle += 1;
  state.passesRemaining = null;
  state.blockState = [];
  return state;
}

export function isChoicePending(state, choicePoint) {
  if (!choicePoint) return false;
  return state.choiceLog[choicePoint.id] === undefined;
}
