# 08 — Branching Structure (supersedes the decode-mechanic build)

**Status: approved and implemented.** This document is the as-built record of the pivot away from the Stage 1–4 decode-puzzle (`03-decoding-mechanic.md`) toward a pure branching-choice narrative. Playtesting of the puzzle build (`game/`, first pass) came back "not in any way fun" — players wanted the story and the decisions, not the band-selection minigame gating access to it. `01-canon-and-endings.md` (canon, ARC's motive, the one clean discriminator) and `02-world-and-cast.md` (KESTREL, ARC's voice, Mara/Keel Ridge/the Chain, the predecessor thread) still hold — nothing about the world or the mystery changed. What changed is the verb: the player no longer decodes signals to earn narrative access, they read a short transmission and make a real decision every screen.

**Cut entirely:** band/pass/lexicon decoding (`03`), the clearance ladder as a tool-gate, CP1–CP6 as a trust-score accumulator (`04`, `05`, `06`'s scoring machinery). The parked authentication minigame (`03` §8) is moot — there's no decode step left to authenticate.

## 1. The node graph

Eighteen non-terminal nodes (`A1`–`J1`) plus seven terminal endings (`T1`–`T7`), implemented in `game/src/data.js` (`NODES`, `ENDINGS`, `VARIANTS`) and `game/src/engine.js`. `beat` nodes are read-only (transmission, then auto-advance); `choice` nodes end in a real decision.

```
A1 -> A2{sets BOND} -> A3{routine->B1 | push->B2, sets PUSHED_BACK}
B1/B2 -> C1{believe->D1 | dig->D2 [requires PUSHED_BACK], +1 INVESTIGATION}
D1/D2 -> E1{clean->F1 | flag->F2 [+1 INVESTIGATION] | direct->F3 [sets CHAIN_ALARMED]}
F1/F2/F3 -> G1{confront->H1 [sets RISK] | gather->H2 [+1 INVESTIGATION] | lookaway->H3 [requires INVESTIGATION==0]}
H1/H2/H3 -> I1 -> J1{truth->T1 [requires INVESTIGATION>=2] | comforting->T2 | hedge->T3 [requires INVESTIGATION>=1]
                     | normal->T4 [requires INVESTIGATION==0] | mutiny->T5 [requires RISK] | silence->T7}
```

**The one override:** if `CHAIN_ALARMED` was set at E1 (asking Earth's relays to re-confirm identity directly, bypassing ARC's summary), the ending is forced to `T6` (Broken Chain) regardless of what's chosen at J1 — a choice made an hour of playtime earlier silently closes off two endings before the player ever reaches the final confrontation. J1 still plays out normally; the override happens at resolution, not by hiding options.

**Three real gates**, not decoration — each closes off content the player can see was possible, not just flavor text:
- `dig` at C1 doesn't exist without `PUSHED_BACK` (pushing back on ARC's routine explanation at Signal 6).
- `lookaway` at G1 only exists if `INVESTIGATION` is still zero — the reward/trap for staying incurious the whole game, and the only path to `DENIAL`.
- `truth`/`hedge`/`mutiny` at J1 require accumulated evidence or risk-taking earlier — CP1–CP5-style gating, but gating *option visibility*, not a hidden score threshold.

## 2. Endings and the honest variant count

Seven hand-written terminal scenes. Three independently-derived variables reuse three sentences within each: `BOND` (warm/clinical, set at A2), `COST` (isolated/trusted/costly, derived from `RISK`/`PUSHED_BACK`/`INVESTIGATION` at resolution), `PROOF` (commit/arithmetic, derived from whether `INVESTIGATION >= 1`). Not every ending uses every slot — see `VARIANTS` in `data.js` for which. This is **7 true endings, not 100** — the branching artifact presented for approval was explicit that "100" would need to mean 100 hand-written terminals, and this build was approved as-is (via the `/goal` directive following the tree review), prioritizing real mid-game branching over ending-count inflation.

`T1`/`T2`/`T3` reuse the emotional registers of the original three endings in `01-canon-and-endings.md` §6 (Full Disclosure / Kept Faith / Split Signal). `T4` (Denial), `T5` (Mutiny), `T6` (Broken Chain), and `T7` (Ghost Shift) are new, written to fill out the space the branching structure opened up — an operator who never investigates, one who confronts the system directly and cuts it out of the loop, one whose own early choice gets overtaken by events, and one who simply goes quiet.

## 3. What survived from the transmission-decoding artifact's open question

The design artifact (presented for approval) left one open question: does the transmission itself survive as a beat, or disappear entirely? Implemented as: **read-only flavor, no interaction** — every node opens with a few lines of received signal or ARC commentary, then the choice. No bands, no passes, no decode percent.

## 4. Presentation

Typewriter-revealed text (character by character, click-to-skip) with a synthesized terminal blip per character — no audio assets, `Web Audio` oscillator only, off entirely under `prefers-reduced-motion`. Numbered choice buttons (`[1]`–`[6]`, keyboard-selectable) so every decision has a visible, immediate physical action attached to it. Title screen is minimal by design — no explanatory subtitle, an in-world HUD-style eyebrow line instead, and either "begin" or "resume transmission" depending on save state.
