# LAST SIGNAL — playable build

Static HTML/CSS/JS, no build step, no dependencies for the game itself (`playwright-core` in `package.json` is dev-only, used by the test scripts to drive a real browser — it is not needed to play the game).

## Run it

```
cd game
python3 -m http.server 8787
```

Then open `http://localhost:8787/` in a browser. That's the whole game — `index.html` loads `src/main.js` as an ES module directly, no bundler.

Progress autosaves to `localStorage` (single slot) after every action. Reloading mid-signal resumes exactly where you left off. "start a new run" on the ending screen clears the save and returns to the title screen.

## Structure

- `src/engine.js` — pure game logic (band resolution, trust scoring, evidence gating, ending selection). No DOM references; runs identically under Node and in the browser. This is what `test/archetypes.test.js` exercises headlessly.
- `src/data.js` — all content: the 15 signals, the six choice points, the three ending epilogues, the lexicon symbol display map.
- `src/main.js` — rendering and event wiring. Owns the save/load, phase state machine (title → decoding → finalized → [choice] → ending), and the DOM.
- `style.css` — terminal aesthetic, single stylesheet, no preprocessor.

## Tests

```
npm test                                 # headless archetype regression (no browser) — 5 archetypes
node test/playthrough-all.mjs            # real browser, 4 archetypes + a dedicated free-decode-bug regression
node test/edge-cases.mjs                 # reload persistence, no-softlock guarantees
node test/new-run-check.mjs              # "start a new run" clears state and returns to title
node test/hint-reading-playthrough.mjs   # the important one: plays by reading ONLY the rendered
                                          # [ waveform: ... ] hint text through the legend, no
                                          # data.js answer-key access — confirms Ending A is reachable
                                          # by an actual player's strategy, not just by a test oracle
```

The browser-driven tests need a running server (`npm run serve` or the command above) and Chrome at `/usr/bin/google-chrome` — see each script's `chromium.launch({ executablePath: ... })` if that path differs on your machine. They use `playwright-core` against the system browser rather than downloading a bundled Chromium, which is why it's a lightweight `--no-save` install rather than a tracked dependency.

**On band-selection balance:** passes are intentionally tight (usually equal to the number of distinct bands a signal actually uses), and all three bands are genuinely used across the 15 signals — brute-forcing "band 0, then band 1, every signal" no longer decodes everything for free (it used to; caught and fixed, see the project root README's bug list). `hint-reading-playthrough.mjs` confirms a player who only reads the hints reaches Ending A, but tightly — CP1-CP5 trust needs to hit +3 of a possible +5 to unlock the truth clause at the end, so it's earned, not automatic.

## Design source

Every piece of content and every mechanic here traces back to `../design/`. If you're changing game balance, narrative content, or the ending logic, check the relevant design doc first (`README.md` in the project root has the reading order) — the clue ledger and fair-play audit in particular exist so that signal content stays internally consistent, and that consistency is easy to break by editing `data.js` without rereading them.

## Known gaps against the Definition of Done (see project root `README.md`)

- Content is complete for all 15 signals + 3 endings, but has not had a copy-editing pass independent of the person who wrote it (i.e. no second reader has been through the prose).
- The parked authentication minigame (`../design/03-decoding-mechanic.md` §8) is still just a static `SOURCE AUTH: —` label, as designed — not a bug.
