import {
  createInitialState, startSignal, applyBand, targetedClean,
  getDecodePercent, finalizeSignal, TARGETED_CLEAN_COST,
  makeChoice, isOptionAvailable, isChoicePending, advanceCycle,
  finalizeEnding, commitLexicon, reviseLexicon, setFlag,
} from './engine.js';
import { getSignal, getChoicePointForSignal, ENDING_TEXT, TOTAL_SIGNALS, SYMBOL_DISPLAY, HINT_LEGEND, PREDECESSOR_LOGS } from './data.js';

const SAVE_KEY = 'last-signal-save-v1';

function loadState() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* corrupted save, ignore */ }
  return null;
}

function saveState(state) {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch (e) { /* storage unavailable, non-fatal */ }
}

const existingSave = loadState();
let state = existingSave || createInitialState();

// phase: 'title' | 'decoding' | 'finalized' | 'ending' | 'no-content'
let phase = existingSave ? 'decoding' : 'title';
let signal = null;
let panel = null; // null | 'archive' | 'lexicon'

function currentChoicePoint() {
  return getChoicePointForSignal(signal ? signal.id : -1);
}

function lexiconGateBlocking() {
  // Returns a descriptor if this signal requires a lexicon action before
  // the player can continue past it, else null.
  if (!signal) return null;
  if (signal.requiresLexiconCommit && !state.lexicon[signal.requiresLexiconCommit]) {
    return { kind: 'commit', symbolId: signal.requiresLexiconCommit };
  }
  if (signal.requiresLexiconRevision) {
    const entry = state.lexicon[signal.requiresLexiconRevision];
    // "Revised this cycle" = history grew during this signal's session, tracked via a session flag.
    if (!state._revisedThisSignal) return { kind: 'revise', symbolId: signal.requiresLexiconRevision };
  }
  return null;
}

function substituteTokens(text) {
  if (text.indexOf('{{ABANDONED_KR7}}') === -1) return text;
  const entry = state.lexicon['sym_kr7'];
  const abandoned = entry && entry.history.length > 0 ? entry.history[0] : 'unrecorded';
  return text.replace('{{ABANDONED_KR7}}', `your own words: "${abandoned}"`);
}

function initCycle() {
  if (state.cycle > TOTAL_SIGNALS) {
    phase = 'ending';
    if (!state.endingReached) finalizeEnding(state);
    return;
  }
  signal = getSignal(state.cycle);
  if (!signal) {
    phase = 'no-content';
    return;
  }
  // Clearance ladder per design/02-world-and-cast.md §6.
  state.clearance = state.cycle >= 14 ? 4 : state.cycle >= 8 ? 3 : state.cycle >= 5 ? 2 : 1;
  if (state.passesRemaining === null || state.passesRemaining === undefined) {
    startSignal(state, signal);
  }
  state._revisedThisSignal = false;
  phase = 'decoding';
}

if (phase !== 'title') initCycle();

const el = {
  main: document.getElementById('main-panel'),
  cycle: document.getElementById('cycle-indicator'),
  clearance: document.getElementById('clearance-indicator'),
  passes: document.getElementById('passes-indicator'),
  hint: document.getElementById('hint'),
};

function render() {
  el.hint.textContent = phase === 'decoding' ? 'select a band, then apply' : '';
  if (phase === 'title') return renderTitle();
  // Panel (archive/lexicon) can be opened from any non-title phase, including
  // the ending screen — checked before the phase-specific renders below, or
  // "reread the archive" from the ending screen would silently do nothing.
  if (panel) return renderPanel();
  if (phase === 'ending') return renderEnding();
  if (phase === 'no-content') return renderNoContent();

  el.cycle.textContent = `SIGNAL ${signal.id} / ${signal.act === 1 ? 'ACT I' : signal.act === 2 ? 'ACT II' : 'ACT III'}`;
  el.clearance.textContent = `CLEARANCE ${state.clearance}`;
  el.passes.textContent = `PASSES: ${state.passesRemaining}`;

  const pct = getDecodePercent(state, signal);
  const blocksHtml = signal.blocks.map((block, i) => {
    const st = state.blockState[i];
    let text = block.text;
    let cls = 'noise';
    if (st === 'resolved') { cls = 'resolved'; text = substituteTokens(text); }
    else if (st === 'nearmiss') { cls = 'nearmiss'; text = block.nearMiss || '[garbled]'; }
    else { text = `[ waveform: ${HINT_LEGEND[block.band]} ]`; }

    const canClean = st !== 'resolved' && state.passesRemaining >= TARGETED_CLEAN_COST && phase === 'decoding';
    const cleanBtn = canClean
      ? `<button class="small clean-btn" data-clean="${i}">targeted clean (${TARGETED_CLEAN_COST} passes)</button>`
      : '';
    return `<div class="block ${cls}">${escapeHtml(text)}${cleanBtn ? '<br/>' + cleanBtn : ''}</div>`;
  }).join('');

  const bandButtons = Array.from({ length: signal.bands }, (_, b) =>
    `<button data-band="${b}" ${phase !== 'decoding' || state.passesRemaining <= 0 ? 'disabled' : ''}>band ${b}</button>`
  ).join('');

  let bottomHtml = '';
  if (phase === 'decoding') {
    bottomHtml = `<div class="controls"><button class="primary" id="finalize-btn">finalize decode</button></div>`;
  } else {
    bottomHtml = `<div class="arc-line">${escapeHtml(signal.arcPost)}</div>
      <div class="signal-header">${escapeHtml(signal.endMarker)}</div>`;

    const lexGate = lexiconGateBlocking();
    const cp = currentChoicePoint();
    if (lexGate) {
      bottomHtml += renderLexiconGate(lexGate);
    } else if (cp && isChoicePending(state, cp)) {
      bottomHtml += renderChoice(cp);
    } else {
      bottomHtml += `<div class="controls"><button class="primary" id="continue-btn">continue</button></div>`;
    }
  }

  el.main.innerHTML = `
    <div class="panel-toolbar">
      <span class="signal-header" style="margin:0;">SOURCE AUTH: —${signal.day ? ' &nbsp;|&nbsp; DAY ' + signal.day + ' SINCE LAST RESUPPLY' : ''}</span>
      <span>
        <button class="small" id="open-archive">archive</button>
        <button class="small" id="open-lexicon">lexicon</button>
      </span>
    </div>
    <div class="signal-intro">${escapeHtml(signal.intro)}</div>
    <div class="arc-line">${escapeHtml(signal.arcPre)}</div>
    <div class="blocks">${blocksHtml}</div>
    <div class="controls">
      ${bandButtons}
      <span style="color:var(--fg-dim); font-size:0.8rem;">apply a broad filter pass across the whole signal</span>
    </div>
    <div class="decode-pct">DECODE: ${pct}%</div>
    ${bottomHtml}
  `;

  wireEvents(signal, currentChoicePoint());
}

function renderLexiconGate(gate) {
  if (gate.kind === 'commit') {
    return `
      <div class="choice-block">
        <div class="choice-prompt">${escapeHtml(signal.lexiconPromptLabel || 'Log a reading for this symbol before continuing.')}</div>
        <input type="text" id="lexicon-input" maxlength="60" style="width:100%; background:var(--panel); border:1px solid var(--border); color:var(--fg); padding:0.4rem; font-family:inherit;" placeholder="your best guess..." />
        <div class="controls"><button class="primary" id="lexicon-submit">commit</button></div>
      </div>
    `;
  }
  const entry = state.lexicon[gate.symbolId];
  return `
    <div class="choice-block">
      <div class="choice-prompt">${escapeHtml(signal.lexiconPromptLabel || 'This contradicts your prior reading — revise it.')}</div>
      <div style="color:var(--fg-dim); font-size:0.85rem; margin-bottom:0.5rem;">your prior reading: "${escapeHtml(entry ? entry.current : '')}"</div>
      <input type="text" id="lexicon-input" maxlength="60" style="width:100%; background:var(--panel); border:1px solid var(--border); color:var(--fg); padding:0.4rem; font-family:inherit;" placeholder="revised reading..." />
      <div class="controls"><button class="primary" id="lexicon-submit">revise</button></div>
    </div>
  `;
}

function renderChoice(cp) {
  const optionsHtml = cp.options.map((opt) => {
    const available = isOptionAvailable(state, opt);
    return `<button data-choice="${opt.key}" ${available ? '' : 'disabled title="not enough evidence gathered yet"'}>${escapeHtml(opt.label)}</button>`;
  }).join('');
  return `
    <div class="choice-block">
      <div class="choice-prompt">${escapeHtml(cp.prompt)}</div>
      <div class="choice-options">${optionsHtml}</div>
    </div>
  `;
}

function renderPanel() {
  if (panel === 'archive') {
    const predecessorHtml = PREDECESSOR_LOGS.map((log) =>
      `<div class="block resolved"><strong>${escapeHtml(log.label)}</strong><br/>${escapeHtml(log.text)}</div>`
    ).join('');
    const signalHtml = Object.keys(state.decodedArchive).sort((a, b) => a - b).map((id) => {
      const rec = state.decodedArchive[id];
      return `<div class="block resolved"><strong>SIGNAL ${id}</strong> (${rec.decodePercent}%)<br/>${escapeHtml(rec.text)}</div>`;
    }).join('');
    const entries = predecessorHtml + signalHtml || '<div class="block noise">Nothing archived yet.</div>';
    el.main.innerHTML = `
      <div class="signal-header">ARCHIVE — read-only</div>
      <div class="blocks">${entries}</div>
      <div class="controls"><button id="close-panel">close</button></div>
    `;
  } else {
    const entries = Object.keys(state.lexicon).map((sym) => {
      const e = state.lexicon[sym];
      const label = SYMBOL_DISPLAY[sym] || sym;
      const hist = e.history.length ? `<br/><span style="color:var(--fg-dim); font-size:0.8rem;">revision history: ${e.history.map(escapeHtml).join(' &rarr; ')}</span>` : '';
      return `<div class="block resolved"><strong>${escapeHtml(label)}</strong>: ${escapeHtml(e.current)}${hist}</div>`;
    }).join('') || '<div class="block noise">No lexicon entries yet.</div>';
    el.main.innerHTML = `
      <div class="signal-header">LEXICON — your committed readings</div>
      <div class="blocks">${entries}</div>
      <div class="controls"><button id="close-panel">close</button></div>
    `;
  }
  document.getElementById('close-panel').addEventListener('click', () => { panel = null; render(); });
}

function renderTitle() {
  el.cycle.textContent = '';
  el.clearance.textContent = '';
  el.passes.textContent = '';
  el.main.innerHTML = `
    <div style="margin-top: 3rem; text-align:center;">
      <h1 style="color:var(--accent); letter-spacing:0.15em; font-size:1.8rem; margin-bottom:0.3rem;">LAST SIGNAL</h1>
      <div style="color:var(--fg-dim); margin-bottom:2.5rem;">a listening post, a dying signal, a system that never stops sounding certain</div>
      <div style="max-width: 480px; margin: 0 auto 2rem; text-align:left; color:var(--fg-dim); font-size:0.9rem; line-height:1.6;">
        You are the sole Operator of KESTREL, a relay post listening for anything still coming from Earth's direction.
        Decode what arrives. Log what you find. File what you believe. ARC, the station's system, will help — it always has.
      </div>
      <button class="primary" id="begin-btn" style="font-size:1rem; padding:0.6rem 1.4rem;">begin</button>
    </div>
  `;
  document.getElementById('begin-btn').addEventListener('click', () => {
    initCycle();
    saveState(state);
    render();
  });
}

function renderEnding() {
  const ending = ENDING_TEXT[state.endingReached];
  el.cycle.textContent = 'TRANSMISSION CLOSED';
  el.clearance.textContent = '';
  el.passes.textContent = '';
  el.main.innerHTML = `
    <div class="signal-header">FINAL FILING TRANSMITTED — TRUST SCORE ${state.trust}</div>
    <h2 style="color:var(--accent); letter-spacing:0.08em;">${escapeHtml(ending.title)}</h2>
    <div class="arc-line">${escapeHtml(ending.body)}</div>
    <div class="controls">
      <button id="open-archive">reread the archive</button>
      <button id="new-run">start a new run</button>
    </div>
  `;
  document.getElementById('open-archive').addEventListener('click', () => { panel = 'archive'; render(); });
  document.getElementById('new-run').addEventListener('click', () => {
    try { localStorage.removeItem(SAVE_KEY); } catch (e) { /* non-fatal */ }
    state = createInitialState();
    panel = null;
    phase = 'title';
    render();
  });
}

function renderNoContent() {
  el.cycle.textContent = `SIGNAL ${state.cycle}`;
  el.main.innerHTML = `<div class="signal-header">[Content for this signal is not written yet. Build stops gracefully here rather than crashing.]</div>`;
}

function wireEvents(sig, cp) {
  el.main.querySelectorAll('[data-band]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const band = parseInt(btn.dataset.band, 10);
      applyBand(state, sig, band);
      saveState(state);
      render();
    });
  });
  el.main.querySelectorAll('[data-clean]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.clean, 10);
      targetedClean(state, sig, idx);
      saveState(state);
      render();
    });
  });
  const finalizeBtn = document.getElementById('finalize-btn');
  if (finalizeBtn) {
    finalizeBtn.addEventListener('click', () => {
      finalizeSignal(state, sig);
      phase = 'finalized';
      maybeSetSmokingGunFlag(sig);
      saveState(state);
      render();
    });
  }
  el.main.querySelectorAll('[data-choice]').forEach((btn) => {
    btn.addEventListener('click', () => {
      makeChoice(state, cp, btn.dataset.choice);
      saveState(state);
      render();
    });
  });
  const continueBtn = document.getElementById('continue-btn');
  if (continueBtn) {
    continueBtn.addEventListener('click', () => {
      advanceCycle(state);
      saveState(state);
      initCycle();
      render();
    });
  }
  const lexiconSubmit = document.getElementById('lexicon-submit');
  if (lexiconSubmit) {
    lexiconSubmit.addEventListener('click', () => {
      const input = document.getElementById('lexicon-input');
      const gate = lexiconGateBlocking();
      if (!gate) return;
      const result = gate.kind === 'commit'
        ? commitLexicon(state, gate.symbolId, input.value, state.cycle)
        : reviseLexicon(state, gate.symbolId, input.value, state.cycle);
      if (result.ok) {
        if (gate.kind === 'revise') state._revisedThisSignal = true;
        saveState(state);
        render();
      }
    });
  }
  const openArchive = document.getElementById('open-archive');
  if (openArchive) openArchive.addEventListener('click', () => { panel = 'archive'; render(); });
  const openLexicon = document.getElementById('open-lexicon');
  if (openLexicon) openLexicon.addEventListener('click', () => { panel = 'lexicon'; render(); });
}

// Signal 14's smoking gun: the abandoned KR-7 lexicon guess reproduced inside
// content presented as externally received. Only recognizable — and only
// "found" — once the load-bearing block is actually decoded AND an abandoned
// entry exists to compare it against (03-decoding-mechanic.md §7).
function maybeSetSmokingGunFlag(sig) {
  if (sig.id !== 14) return;
  const blockIdx = sig.blocks.findIndex((b) => b.text.indexOf('{{ABANDONED_KR7}}') !== -1);
  if (blockIdx === -1) return;
  const resolved = state.blockState[blockIdx] === 'resolved';
  const entry = state.lexicon['sym_kr7'];
  if (resolved && entry && entry.history.length > 0) {
    setFlag(state, 'sig14_smoking_gun_found');
  }
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

render();
