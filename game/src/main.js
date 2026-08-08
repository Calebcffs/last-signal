import {
  createInitialState, choose, advance, getCurrentNode,
  getAvailableOptions, getEnding, isChoicePending,
} from './engine.js';
import { TITLE, INTRO_LINES } from './data.js';

const SAVE_KEY = 'last-signal-save-v2';
const root = document.getElementById('app');

let engineState = null;

function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
function persist() {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(engineState)); } catch { /* ignore */ }
}
function clearSave() {
  try { localStorage.removeItem(SAVE_KEY); } catch { /* ignore */ }
}

// ---- sound: a synthesized terminal blip per revealed character, no audio assets ----
let audioCtx = null;
function ensureAudio() {
  try {
    if (!audioCtx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      audioCtx = new Ctx();
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
  } catch { /* audio unavailable, game still works silently */ }
}
function blip() {
  if (!audioCtx) return;
  const t = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'square';
  osc.frequency.value = 1350 + Math.random() * 260;
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(0.045, t + 0.003);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.02);
  osc.connect(gain).connect(audioCtx.destination);
  osc.start(t);
  osc.stop(t + 0.025);
}

function sleep(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Types `lines` into `container` as <p> elements, one char at a time, with a
// blip roughly every other character. Click anywhere in the container skips
// straight to full text. Resolves once every line is fully shown.
async function typeLines(container, lines, speedMs = 15) {
  container.innerHTML = '';
  let skip = reducedMotion();
  const onClick = () => { skip = true; };
  container.addEventListener('click', onClick);

  for (const line of lines) {
    if (line === '') {
      const spacer = document.createElement('div');
      spacer.style.height = '0.5rem';
      container.appendChild(spacer);
      continue;
    }
    const p = document.createElement('p');
    if (line.startsWith('ARC:')) p.classList.add('arc');
    container.appendChild(p);

    if (skip) {
      p.textContent = line;
      continue;
    }
    const cursor = document.createElement('span');
    cursor.className = 'typed-cursor';
    p.appendChild(cursor);
    for (let i = 0; i < line.length; i++) {
      if (skip) break;
      p.insertBefore(document.createTextNode(line[i]), cursor);
      if (i % 2 === 0 && line[i] !== ' ') blip();
      await sleep(speedMs);
    }
    if (skip) p.textContent = line;
    cursor.remove();
  }
  container.removeEventListener('click', onClick);
}

function render(builder) {
  root.innerHTML = '';
  root.appendChild(builder());
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

// ---- Title screen ----
function renderTitle() {
  const saved = loadSave();
  const screen = el('div', 'title-screen');
  screen.appendChild(el('div', 'title-mark', '◉ KESTREL — LISTENING POST'));
  const name = el('div', 'title-name', TITLE);
  screen.appendChild(name);

  const promptText = saved
    ? (saved.ended ? 'begin again' : 'resume transmission')
    : 'begin';
  const prompt = el('div', 'title-prompt');
  prompt.innerHTML = `[ ${promptText} <span class="cursor">▍</span> ]`;
  prompt.style.cursor = 'pointer';
  prompt.addEventListener('click', () => {
    ensureAudio();
    if (saved && !saved.ended) {
      engineState = saved;
      goToStory();
    } else {
      startFreshRun();
    }
  });
  screen.appendChild(prompt);

  if (saved) {
    const again = el('div', 'resume-note', 'start a new run instead');
    again.style.cursor = 'pointer';
    again.style.textDecoration = 'underline';
    again.addEventListener('click', (e) => {
      e.stopPropagation();
      ensureAudio();
      clearSave();
      startFreshRun();
    });
    screen.appendChild(again);
  }

  render(() => screen);
}

function startFreshRun() {
  engineState = createInitialState();
  clearSave();
  persist();
  renderIntro();
}

async function renderIntro() {
  const screen = el('div', 'story-screen');
  const box = el('div', 'transmission');
  screen.appendChild(box);
  render(() => screen);
  await typeLines(box, INTRO_LINES, 14);
  await sleep(reducedMotion() ? 0 : 500);
  goToStory();
}

function goToStory() {
  const node = getCurrentNode(engineState);
  if (!node) { renderEnding(); return; }
  renderStory();
}

// ---- Main story loop ----
async function renderStory() {
  const node = getCurrentNode(engineState);
  const screen = el('div', 'story-screen');
  const box = el('div', 'transmission');
  screen.appendChild(box);
  render(() => screen);

  if (node.lines && node.lines.length) {
    await typeLines(box, node.lines);
  }

  if (node.kind === 'beat') {
    const hint = el('div', 'advance-hint');
    hint.innerHTML = 'continue <span class="cursor">▍</span>';
    const advanceFn = () => {
      document.removeEventListener('keydown', onKey);
      engineState = advance(engineState);
      persist();
      goToStory();
    };
    const onKey = (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); advanceFn(); }
    };
    hint.addEventListener('click', advanceFn);
    document.addEventListener('keydown', onKey);
    screen.appendChild(hint);
    return;
  }

  // choice node
  const choiceBlock = el('div', 'choice-block');
  const promptEl = el('p', 'choice-prompt');
  choiceBlock.appendChild(promptEl);
  const optionsEl = el('div', 'choice-options');
  choiceBlock.appendChild(optionsEl);
  screen.appendChild(choiceBlock);

  await typeSingleParagraph(promptEl, node.prompt);

  const options = getAvailableOptions(engineState);
  const onKey = (e) => {
    const idx = parseInt(e.key, 10);
    if (idx >= 1 && idx <= options.length) {
      e.preventDefault();
      selectOption(options[idx - 1].key);
    }
  };
  document.addEventListener('keydown', onKey);

  function selectOption(key) {
    document.removeEventListener('keydown', onKey);
    engineState = choose(engineState, key);
    persist();
    goToStory();
  }

  options.forEach((opt, i) => {
    const btn = el('button', 'choice-btn');
    btn.type = 'button';
    const keyMark = el('span', 'key', `[${i + 1}]`);
    btn.appendChild(keyMark);
    btn.appendChild(document.createTextNode(opt.label));
    btn.addEventListener('click', () => selectOption(opt.key));
    optionsEl.appendChild(btn);
  });
}

async function typeSingleParagraph(p, text) {
  if (reducedMotion()) { p.textContent = text; return; }
  let skip = false;
  const onClick = () => { skip = true; };
  p.addEventListener('click', onClick);
  const cursor = document.createElement('span');
  cursor.className = 'typed-cursor';
  p.appendChild(cursor);
  for (let i = 0; i < text.length; i++) {
    if (skip) break;
    p.insertBefore(document.createTextNode(text[i]), cursor);
    if (i % 2 === 0 && text[i] !== ' ') blip();
    await sleep(15);
  }
  if (skip) p.textContent = text;
  cursor.remove();
  p.removeEventListener('click', onClick);
}

// ---- Ending screen ----
async function renderEnding() {
  const ending = getEnding(engineState);
  const screen = el('div', 'ending-screen');
  const title = el('div', 'ending-title', ending.title);
  screen.appendChild(title);
  const body = el('div', 'ending-body');
  screen.appendChild(body);
  render(() => screen);

  await typeLines(body, ending.lines, 16);

  const footer = el('div', 'ending-footer');
  const again = el('button', 'plain-btn', 'play again');
  again.type = 'button';
  again.addEventListener('click', () => {
    clearSave();
    engineState = null;
    renderTitle();
  });
  footer.appendChild(again);
  footer.appendChild(el('span', 'hush', '— end of transmission —'));
  screen.appendChild(footer);
}

renderTitle();
