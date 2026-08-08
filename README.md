# LAST SIGNAL

**Play it: https://calebcffs.github.io/last-signal/**

Working title carried over from the founding whitepaper. `design/` holds the narrative/gameplay design pass done *before* any implementation, per the project's stated priority: the mystery, the mechanic, and the balance had to be genuinely well-built before a line of engine code got written. `game/` is the actual playable build — **complete and passing its Definition of Done** as of this pass, and deployed live via GitHub Pages (`.github/workflows/pages.yml`, deploys `game/` on every push to `main`). See `game/README.md` to run it locally instead.

## Definition of Done (pinned before implementation started)

"Finished, polished to cheap-indie-game level" isn't checkable on its own — this is the concrete target every bug-catching/polish round below is measured against. All five verified by an automated regression suite (`game/test/`), rerun after every fix:

- [x] Title screen → full playthrough → an ending, with no crashes and no dead ends, on a clean run. (`test/playthrough-all.mjs`)
- [x] All three endings (Full Disclosure / Split Signal / Kept Faith) are reachable and correctly gated — by the final filing clause (CP6), itself gated by accumulated CP1-CP5 trust and evidence, per `04-narrative-beatsheet.md`'s table. (`test/archetypes.test.js` — headless, five archetypes; `test/playthrough-all.mjs` — real browser, four archetypes plus a dedicated regression for the free-decode bug below; `test/hint-reading-playthrough.mjs` — the load-bearing check: a playthrough that clicks bands by reading the same on-screen hint text a human would, with no access to the answer key in `data.js`, confirmed Ending A is reachable this way — not just reachable to a test oracle that already knows the correct bands)
- [x] Progress survives a page reload mid-run (single autosave slot, localStorage — no save menu, no multiple slots). (`test/edge-cases.mjs`)
- [x] Readable on a laptop at default browser zoom; no horizontal scroll anywhere. (checked at 1280px and 1024px viewports)
- [x] No unhandled JS errors in console across a full playthrough of each of the four archetypes. (all test scripts assert on `pageerror`/console-error events; zero found after fixes)

Bugs actually caught and fixed during this pass, not just theoretical risks: a data-file syntax error from an unescaped apostrophe (crashed the whole app on load), the "reread the archive" button on the ending screen silently doing nothing (a render-order bug — `phase === 'ending'` short-circuited before the panel check ever ran), the clearance-level indicator never advancing past 1, and a header-row layout that wrapped ugly on real content. Two more, caught by a second external review pass after the suite was already green: the band-selection mechanic was **mechanically decorative** — with only two bands ever used and generous passes, "click band 0, then band 1, every signal" decoded everything for free, bypassing evidence-gating entirely (fixed by tightening passes to match distinct bands actually used per signal, adding real band-2 content, and adding a truthful waveform-hint legend so skill, not brute force, is what pays off); and the **ending was reachable independent of what was actually filed** — a player could cross the Full Disclosure trust threshold via CP1-CP5 alone while filing only a hedge at CP6, and the epilogue would still narrate a truth-filing that never happened (fixed by making the CP6 clause itself the ending selector, with trust and evidence gating which clauses are choosable rather than gating the ending directly). Both fixes are covered by dedicated regression tests, not just manual spot-checks. All fixed in `game/src/`, all reconfirmed by rerunning the full suite afterward.

**Explicitly out of scope** (cut to actually finish, not oversights):
- Sound/music.
- A settings menu, difficulty options, or accessibility beyond default browser zoom/readability.
- Mobile-specific layout (desktop/laptop browser only).
- Achievements, stats screens, or a New Game+ system.
- The parked authentication minigame (`03-decoding-mechanic.md` §8) — stays parked, `SOURCE AUTH:` field stays a static placeholder in the UI, non-interactive.

## Reading order

Documents have a real dependency chain — later ones assume earlier decisions are locked. Read/edit in this order:

1. [`design/00-whitepaper.md`](design/00-whitepaper.md) — the original founding document (unchanged, kept as reference).
2. [`design/01-canon-and-endings.md`](design/01-canon-and-endings.md) — **the load-bearing decision.** What's actually true, why ARC does what it does, the one clean discriminator clue, the trust meter, the three ending variants.
3. [`design/02-world-and-cast.md`](design/02-world-and-cast.md) — KESTREL, ARC's voice spec, the Chain (downstream stakes), the Earth-side cast (Mara, Keel Ridge), the clearance ladder.
4. [`design/03-decoding-mechanic.md`](design/03-decoding-mechanic.md) — the concrete Stage 1–4 minigame spec: filter passes, band selection, lexicon-commit, anomaly-flag, status filing, starting balance numbers.
5. [`design/04-narrative-beatsheet.md`](design/04-narrative-beatsheet.md) — full 3-act, 16-signal breakdown with the six trust-meter choice points placed and scored.
6. [`design/05-clue-ledger.md`](design/05-clue-ledger.md) — every plant in the game: innocent reading, reread meaning, which theory it supports, how it's checked. Required per the whitepaper's own §12. Signal prose gets written *against* this table, not before it.
7. [`design/06-fair-play-audit.md`](design/06-fair-play-audit.md) — two-part verification pass: fair-play checks against the ledger, then a pacing/balance pass. Six real problems were caught and fixed across both passes (an under-specified leak clue, an under-licensed AI directive, a dead Act 1 stretch, an ending-reachability scoring asymmetry, a missing UI readout, and a clue that would have destroyed itself on close reading) — read this before trusting `01`–`05` as final.
8. [`design/07-signal-drafts.md`](design/07-signal-drafts.md) — first-draft final prose for Signal 1 and Signal 6, the two load-bearing signals everything else in the ledger checks against.

## What's settled

- **Canon:** Earth was real and is gone; everything after Signal 6 (day 140) is authored by the ship's AI, ARC, pattern-completing from its own archive and the player's logged reactions. Resolves with certainty by the ending.
- **Alien mimicry** is a genuine, well-supported red herring, not a strawman — it shares an observable fingerprint with "internal system pattern-completing from a closed archive," which is the actual design gimmick the mystery is built on.
- **Endings:** one shared final scene, three text-insertion variants (Full Disclosure / Split Signal / Kept Faith), selected by the final filing clause the player actually chooses (CP6), which accumulated trust and evidence from the five earlier choice points gate access to — no branching content. (Corrected from an earlier trust-threshold scheme during implementation testing — see `01` §5 and `06`'s second correction.)
- **Mechanic:** filter-pass resource management over discrete frequency bands (all three bands genuinely used, passes tight enough that brute-forcing every band isn't free), escalating through lexicon-commit, anomaly-flagging, and outgoing status filing. Wrong choices cost decode % (never a hard fail), which costs clues, which costs ending quality — one system end to end, verified by an automated playthrough regression, not just by design.
- **Scope:** 15 decoded signals + 1 closing scene, comfortably inside the whitepaper's 12–20 signal budget. 3-act structure (4 / 8 / 4), 4-step clearance ladder tied to acts, zero new art beyond terminal UI.
- **All five of the whitepaper's §14 open questions are closed** — see the bottom of `01` and `02` for exactly where each was resolved.
- **Implementation is complete and playable** — see `game/` and the Definition of Done above. All 15 signals have final prose, all three endings are reachable, the full test suite is green.

## What's explicitly NOT done (deliberately out of scope, not oversights)

- **The parked authentication minigame** (solve-a-puzzle style verification of a signal's legitimacy), requested by Caleb but deliberately not scoped into the beat sheet/ledger or implementation — candidate shapes and open questions are recorded in `design/03-decoding-mechanic.md` §8. The game's `SOURCE AUTH:` field is a static, non-interactive placeholder so this can slot in later without a rewrite.
- Sound, a settings menu, mobile layout, achievements — see the Definition of Done's explicit out-of-scope list above.
- A second, independent copy-editing pass on the prose (one pass of internal consistency checking happened via the clue ledger and fair-play audit; no outside reader has been through the final text).

## Budget discipline

Every system above was checked against the $35–40 / 20–40 minute / 12–20 signal constraints in the whitepaper's §11 while it was being designed, not after — the six choice points, the four-tool mechanic ladder, and the three-variant ending were all sized down at least once during this pass specifically to fit that budget rather than the ambition of the idea. If a future pass wants to expand scope, treat that as a deliberate re-negotiation of §11, not a default.
