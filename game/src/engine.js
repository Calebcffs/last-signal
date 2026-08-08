// Pure game logic for the branching-narrative engine. No DOM references —
// must run identically in a browser <script type="module"> and under plain
// `node`. All functions are state-in/state-out; nothing here reads
// localStorage or touches the page.

import { NODES, START_NODE, ENDINGS, VARIANTS } from './data.js';

export function createInitialState() {
  const state = {
    nodeId: null,
    flags: {
      BOND: null,
      PUSHED_BACK: false,
      INVESTIGATION: 0,
      RISK: false,
      CHAIN_ALARMED: false,
    },
    ended: false,
    endingId: null,
    endingBaseChosen: null,
  };
  enterNode(state, START_NODE);
  return state;
}

function applySets(state, sets) {
  for (const [key, val] of Object.entries(sets)) {
    if (val === '+1') {
      state.flags[key] = (state.flags[key] || 0) + 1;
    } else {
      state.flags[key] = val;
    }
  }
}

function enterNode(state, nodeId) {
  state.nodeId = nodeId;
  const node = NODES[nodeId];
  if (node.sets) applySets(state, node.sets);
}

export function getCurrentNode(state) {
  if (state.ended) return null;
  return NODES[state.nodeId];
}

export function isOptionAvailable(state, option) {
  if (!option.requires) return true;
  for (const [key, val] of Object.entries(option.requires)) {
    if (key === 'INVESTIGATION_MIN') {
      if (state.flags.INVESTIGATION < val) return false;
    } else if (state.flags[key] !== val) {
      return false;
    }
  }
  return true;
}

export function getAvailableOptions(state) {
  const node = getCurrentNode(state);
  if (!node || node.kind !== 'choice') return [];
  return node.options.filter((opt) => isOptionAvailable(state, opt));
}

export function isChoicePending(state) {
  const node = getCurrentNode(state);
  return !!node && node.kind === 'choice';
}

export function isBeatPending(state) {
  const node = getCurrentNode(state);
  return !!node && node.kind === 'beat';
}

export function computeEndingId(baseEndingKey, flags) {
  return flags.CHAIN_ALARMED ? 'T6' : baseEndingKey;
}

export function choose(state, optionKey) {
  const node = getCurrentNode(state);
  if (!node || node.kind !== 'choice') return state;
  const option = node.options.find((o) => o.key === optionKey);
  if (!option || !isOptionAvailable(state, option)) return state;

  if (option.sets) applySets(state, option.sets);

  if (option.next) {
    enterNode(state, option.next);
  } else if (option.endingBase) {
    state.endingBaseChosen = option.endingBase;
    state.endingId = computeEndingId(option.endingBase, state.flags);
    state.ended = true;
    state.nodeId = null;
  }
  return state;
}

export function advance(state) {
  const node = getCurrentNode(state);
  if (!node || node.kind !== 'beat') return state;
  enterNode(state, node.next);
  return state;
}

export function resolveVariants(flags) {
  const bond = flags.BOND || 'clinical';
  let cost;
  if (flags.RISK) cost = 'costly';
  else if (flags.PUSHED_BACK && flags.INVESTIGATION >= 2) cost = 'isolated';
  else cost = 'trusted';
  const proof = flags.INVESTIGATION >= 1 ? 'commit' : 'arithmetic';
  return { bond, cost, proof };
}

export function getEnding(state) {
  if (!state.ended || !state.endingId) return null;
  const endingId = state.endingId;
  const ending = ENDINGS[endingId];
  const v = resolveVariants(state.flags);
  const lines = ending.body.map((line) =>
    line
      .replace('{{bond}}', VARIANTS.bond[v.bond][endingId] || '')
      .replace('{{cost}}', VARIANTS.cost[v.cost][endingId] || '')
      .replace('{{proof}}', VARIANTS.proof[v.proof][endingId] || '')
  );
  return {
    id: endingId,
    title: ending.title,
    lines,
    overridden: state.endingBaseChosen && state.endingBaseChosen !== endingId,
  };
}
