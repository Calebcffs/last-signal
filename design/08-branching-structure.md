# 08 — Branching Structure (supersedes the decode-mechanic build)

**Status: implemented, revised once after the first pass.** This document is the as-built record of the pivot away from the Stage 1–4 decode-puzzle (`03-decoding-mechanic.md`) toward a pure branching-choice narrative. Playtesting of the puzzle build (`game/`, first pass) came back "not in any way fun" — players wanted the story and the decisions, not the band-selection minigame gating access to it. `01-canon-and-endings.md` (canon, ARC's motive, the one clean discriminator) and `02-world-and-cast.md` (KESTREL, ARC's voice, Mara/Keel Ridge/the Chain, the predecessor thread) still hold — nothing about the world or the mystery changed. What changed is the verb: the player no longer decodes signals to earn narrative access, they read a short transmission and make a real decision every screen.

**Cut entirely:** band/pass/lexicon decoding (`03`), the clearance ladder as a tool-gate, CP1–CP6 as a trust-score accumulator (`04`, `05`, `06`'s scoring machinery). The parked authentication minigame (`03` §8) is moot — there's no decode step left to authenticate.

**Revised once, post-build, on the "feeling of control" thesis (Caleb's own stated design goal via `/goal`):** the first implementation had six read-only "click to continue" screens interleaved between the six real decisions — narration with no choice attached. Every one of those was folded into the choice that follows it, so the shipped graph has **zero** screens that aren't a decision. Same content, same word count, no filler.

## 1. The node graph

Eleven choice nodes (`N1`–`N6c`) plus seven terminal endings (`T1`–`T7`), implemented in `game/src/data.js` (`NODES`, `ENDINGS`, `VARIANTS`) and `game/src/engine.js`. Every node ends in a real decision — there is no read-only "beat" kind left in the actual content, though the engine still generically supports one if a future pass wants pure narration back.

```
N1{sets BOND} -> N2{routine->N3a | push->N3b, sets PUSHED_BACK}
N3a/N3b -> {believe->N4a | dig->N4b [requires PUSHED_BACK], +1 INVESTIGATION}
N4a/N4b -> {clean->N5a | flag->N5b [+1 INVESTIGATION] | direct->N5c [sets CHAIN_ALARMED]}
N5a/N5b/N5c -> {confront->N6a [sets RISK] | gather->N6b [+1 INVESTIGATION] | lookaway->N6c [requires INVESTIGATION==0]}
N6a/N6b/N6c -> {truth->T1 [requires INVESTIGATION>=2] | comforting->T2 | hedge->T3 [requires INVESTIGATION>=1]
                | normal->T4 [requires INVESTIGATION==0] | mutiny->T5 [requires RISK] | silence->T7}
```

**The one override:** if `CHAIN_ALARMED` was set at the "Filing Day" choice (asking Earth's relays to re-confirm identity directly, bypassing ARC's summary), the ending is forced to `T6` (Broken Chain) regardless of what's chosen at the final filing — a choice made much earlier silently closes off two endings before the player ever reaches the final confrontation. The final choice still plays out normally and the report is described as sent; the override recontextualizes it in the ending text rather than hiding the choice itself (see §2's T6 rewrite below).

**Three real gates**, not decoration — each closes off content the player can see was possible, not just flavor text:
- `dig` doesn't exist without `PUSHED_BACK` (pushing back on ARC's routine explanation at the carrier-loss choice).
- `lookaway` only exists if `INVESTIGATION` is still zero — the reward/trap for staying incurious the whole game, and the only path to `DENIAL`.
- `truth`/`hedge`/`mutiny` at the final filing require accumulated evidence or risk-taking earlier — gating *option visibility*, not a hidden score threshold.

## 2. Endings and the honest variant count

Seven hand-written terminal scenes. Three variables reuse a sentence within each: `BOND` (warm/clinical, set at the first choice), `COST` (isolated/trusted/costly, derived from `RISK`/`PUSHED_BACK`/`INVESTIGATION` at resolution), `PROOF` (commit/arithmetic, derived from whether `INVESTIGATION >= 1`). This is **7 true endings, not 100** — the branching artifact presented for approval was explicit that "100" would need to mean 100 hand-written terminals; Caleb's `/goal` directive moved the project into implementation without answering that question directly, so it's restated here rather than assumed closed.

**Corrected count, caught by brute-forcing every reachable path (`game/test/archetypes.test.js`) rather than by arithmetic:** the design doc's first draft claimed 7 × 2(bond) × 3(cost) × 2(proof) = 84 distinct closing texts. That arithmetic assumed the three variables vary independently: they don't. The *requirements* that gate access to an ending correlate with the *variables* that ending's text depends on — e.g. `truth` requires `INVESTIGATION >= 2`, which also forces `PROOF` to always resolve to `commit` (arithmetic only fires at exactly zero), so `T1` never actually shows its arithmetic-only line. Similarly `mutiny` requires `RISK`, which forces `COST` to always be `costly` for `T5`. The real, brute-force-verified count is **16 distinct assembled ending texts**: T1 and T3 each have 3 (cost varies, proof is always `commit`), T5 has 2 (proof varies, cost is always `costly`), and T2/T4/T6/T7 each have 2 (bond only). This is now a permanent regression check, not just a one-time count — the test enumerates every reachable path and asserts on the exact per-ending tallies.

`T1`/`T2`/`T3` reuse the emotional registers of the original three endings in `01-canon-and-endings.md` §6 (Full Disclosure / Kept Faith / Split Signal). `T4` (Denial), `T5` (Mutiny), `T6` (Broken Chain), and `T7` (Ghost Shift) are new, written to fill out the space the branching structure opened up.

**T6's opening line was rewritten after review.** The first draft opened with "It doesn't matter, in the end, what you were about to send" — which, on inspection, told the player their final decision was void at the exact moment they were meant to feel its weight, directly undercutting the "feeling of control" thesis this whole rework serves. It now narrates the report going out as chosen, then shows it getting overtaken by the earlier consequence, so the player's last choice still visibly happens before the story recontextualizes it.

## 3. What survived from the branching artifact's open question

The artifact presented for approval left one open question: does the transmission itself survive as a beat, or disappear entirely? Implemented as: **read-only flavor folded into the same screen as the choice**, not a separate screen — every choice node opens with a few lines of received signal or ARC commentary, then the decision. No bands, no passes, no decode percent, and (per the revision above) no screen that's narration only.

## 4. Presentation

Typewriter-revealed text (character by character, click-to-skip) with a synthesized terminal blip per character — no audio assets, `Web Audio` oscillator only, off entirely under `prefers-reduced-motion`. Verified firing end-to-end in `game/test/audio-wiring.mjs` (every other browser test clicks to skip the animation for speed, which meant the blip path had never actually executed in CI until this test existed). Numbered choice buttons (`[1]`–`[6]`, keyboard-selectable) so every decision has a visible, immediate physical action attached to it. Title screen is minimal by design — no explanatory subtitle, an in-world HUD-style eyebrow line instead, and either "begin" or "resume transmission" depending on save state.
