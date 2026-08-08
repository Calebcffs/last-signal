# LAST SIGNAL

**Play it: https://calebcffs.github.io/last-signal/**

Working title carried over from the founding whitepaper. `game/` is the actual playable build — a branching-choice narrative, deployed live via GitHub Pages (`.github/workflows/pages.yml`, deploys `game/` on every push to `main`). See `game/README.md` to run it locally instead.

## The pivot (current build)

The first playable pass was a decode-puzzle (band selection, filter passes, lexicon-commit) gating access to three narrative endings. Playtesting verdict: **"not in any way fun."** The puzzle was cut entirely and replaced with a pure branching-narrative structure — eighteen read-and-decide screens, real choices that open or close later options (not just a score), and seven distinct endings. The tree was designed and presented for approval *before* any of it was built, per the redirect: "only when that tree is made and approved by me should you continue."

Current design source: **[`design/08-branching-structure.md`](design/08-branching-structure.md)** — the as-built branching structure, what carries over from the original design pass, and the honest math behind the ending count. `design/01` (canon) and `design/02` (world/cast/ARC's voice) are still current. `design/03`–`07` describe the superseded puzzle build and are kept only as historical record — each is marked superseded at the top.

## Definition of Done

- [x] Title screen → full playthrough → any of the seven endings, with no crashes and no dead ends (every choice node has at least one always-available option). (`game/test/playthrough-all.mjs`, `game/test/archetypes.test.js`)
- [x] All seven endings reachable and correctly gated by real path state, not a hidden score — including the one delayed-consequence override (an Act II choice can force Ending T6 regardless of what's chosen at the final confrontation). (`game/test/archetypes.test.js` — headless engine walk with explicit gating assertions; `game/test/playthrough-all.mjs` — same seven paths driven through real clicks in a browser)
- [x] Progress survives a page reload mid-run (single autosave slot, localStorage; reload always returns to the title screen with a "resume transmission" option, never auto-continues). (`game/test/edge-cases.mjs`)
- [x] "Play again" from an ending clears the save and returns to a clean title screen. (`game/test/new-run-check.mjs`)
- [x] Readable on a laptop at default browser zoom; no horizontal scroll.
- [x] No unhandled JS errors in console across any playthrough. (every browser test asserts on `pageerror`/console-error events)

**Explicitly out of scope:** sound beyond the synthesized typing blip, a settings menu, mobile-specific layout, achievements/stats/New Game+, the parked authentication minigame (moot now — there's no decode step left to authenticate), a second independent copy-editing pass on the prose.

## What's settled

- **Canon, unchanged from the original design pass:** Earth was real and is gone; everything past the last genuine transmission is authored by the station's AI, ARC, pattern-completing from its own archive. Resolves with certainty by the ending — see `design/01-canon-and-endings.md`.
- **Mechanic:** a branching node graph (`game/src/data.js` `NODES`), not a puzzle. Every choice either sets a flag that gates a later option's *visibility* (not just its flavor text) or routes directly to a different node. Full structure in `design/08-branching-structure.md`.
- **Endings:** seven hand-written terminal scenes, each with three independently-derived text variants (warmth, cost, cited evidence) — honestly counted as 7 true endings with combinatorial variant text, not literally 100 distinct scenes. See `design/08` §2 for the exact math.
- **Presentation:** typewriter-revealed text with a synthesized terminal blip per character (no audio assets), numbered/keyboard-selectable choices, minimal title screen with no explanatory subtitle.
