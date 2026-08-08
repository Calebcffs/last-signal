# LAST SIGNAL — playable build

**Live at https://calebcffs.github.io/last-signal/** — deployed via `.github/workflows/pages.yml`, which builds and publishes this directory (nothing else in the repo) on every push to `main`. No build step in that pipeline either — it just uploads `game/` as-is.

Static HTML/CSS/JS, no build step, no dependencies for the game itself (`playwright-core` in `package.json` is dev-only, used by the test scripts to drive a real browser — it is not needed to play the game).

## Run it

```
cd game
python3 -m http.server 8787
```

Then open `http://localhost:8787/` in a browser. That's the whole game — `index.html` loads `src/main.js` as an ES module directly, no bundler.

Progress autosaves to `localStorage` (single slot) after every choice. A reload always returns to the title screen — it never auto-continues — but offers "resume transmission" if a save exists, which restores the exact node you left. "play again" on an ending screen clears the save.

## Structure

- `src/engine.js` — pure game logic: the node-graph state machine (flags, gated option visibility, ending resolution including the delayed-consequence override). No DOM references; runs identically under Node and in the browser. This is what `test/archetypes.test.js` exercises headlessly.
- `src/data.js` — all content: the eleven choice nodes (`NODES` — every node ends in a decision, no read-only filler screens), the seven terminal endings with their variant-text slots (`ENDINGS`, `VARIANTS`), the intro lines.
- `src/main.js` — rendering and event wiring: the typewriter-with-synthesized-blip renderer, title/story/ending phase transitions, save/load, choice buttons (click or number-key).
- `style.css` — terminal aesthetic, single stylesheet, no preprocessor.

## Tests

```
npm test                          # headless engine regression (no browser) — all 7 endings, gating rules,
                                   # and a brute-force check of all 16 reachable ending texts for clean
                                   # assembly (no unresolved {{slot}}, no lowercase paragraph starts)
node test/playthrough-all.mjs     # real browser — all 7 endings, driven by actual clicks on the rendered UI
node test/edge-cases.mjs          # reload-mid-run persistence: resumes to the exact node, not a restart
node test/new-run-check.mjs       # "play again" clears the save and returns to a clean title screen
node test/audio-wiring.mjs        # confirms the typewriter blip actually fires (the other browser tests
                                   # click to skip the animation, so this is the only one that lets it play)
node test/live-smoke-test.mjs     # points at the deployed Pages URL, not localhost — run after any deploy
```

The browser-driven tests need a running server (the command above) and Chrome at `/usr/bin/google-chrome` — see `test/helpers.mjs`'s `chromium.launch({ executablePath: ... })` if that path differs on your machine. They use `playwright-core` against the system browser rather than downloading a bundled Chromium, which is why it's a lightweight `--no-save` install rather than a tracked dependency. `live-smoke-test.mjs` is the exception — it targets `https://calebcffs.github.io/last-signal/` directly and needs no local server.

**On the branching structure:** every choice node has at least one option that's always available (no dead ends possible), and several options only appear once an earlier choice earned them — see `design/08-branching-structure.md` for the full graph and the three real gates. `archetypes.test.js` asserts on option *visibility*, not just reachability, so a regression that accidentally always-shows a gated option would fail the suite.

## Design source

Every piece of content and every mechanic here traces back to `../design/`, in particular **`08-branching-structure.md`** (current mechanic and node graph) plus `01-canon-and-endings.md` and `02-world-and-cast.md` (canon, ARC's voice, cast — unchanged from the original design pass). `03`–`07` describe an earlier decode-puzzle build that was cut after playtesting; each is marked superseded at the top and kept only as historical record.

## Known gaps

- Content has not had a copy-editing pass independent of the person who wrote it.
- Sound is a single synthesized typing blip (Web Audio, no assets) — no music, no other effects.
