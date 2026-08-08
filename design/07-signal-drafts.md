# 07 — Signal Drafts (Signal 1, Signal 6)

First-draft final prose, per `06-fair-play-audit.md` risk #4: these two signals are load-bearing for the whole ledger — Signal 1's contingent-specific line gets reproduced verbatim in Signal 13, and Signal 6's day count is the fixed baseline Signal 11's arithmetic clue checks against. Every other signal should be written to match these, not the other way around. Draft status — expect small wording passes, but treat the **locked** lines below as fixed once later signals start referencing them.

Format follows the whitepaper's own §15 appendix convention. `SOURCE AUTH:` is a placeholder field, not a working mechanic yet — see `03-decoding-mechanic.md` §8 (parked authentication minigame). It's included now purely so a future auth pass can slot into existing signal headers without forcing a rewrite of the transmission text itself. Both signals use the same neutral placeholder (`—`) rather than distinct values — §8 leaves open what a genuine signal failing auth would even mean, so the drafts shouldn't quietly assert semantics for a mechanic that isn't designed yet.

**Decode % shown below is the full/optimal-play outcome, not a fixed number (caught in review).** The mechanic (`03` §1–2) makes decode % earned, not scripted — a fumbling tutorial player gets less. That's fine for flavor text but not for row-1/row-6 baseline content: Mara, Keel Ridge, day 118, the locked contingent-specific clause, and Signal 6's day-140 figure are exactly what every later clue checks against, so they cannot live in a missable block. Per `03` §6's "load-bearing blocks" rule and Stage 1's "reliable, near-unmissable" tutorial hint: **the bolded/locked spans below are tagged load-bearing and resolve on the correct band regardless of how the rest of the player's pass budget is spent.** Everything else in these two signals is ordinary flavor and can be missed without consequence, same as any other signal.

---

## Signal 1 (Act 1, tutorial, genuine)

> SIGNAL 1 — DECODE 88% (full-decode outcome; load-bearing spans below always resolve)
> SOURCE AUTH: —
>
> 1... 1... 2... 3... 5... 8... 13... — parity check, parity check, this is Keel Ridge relay repeating, do you copy —
> [BAND LOCK ACQUIRED]
> ration levels nominal, crew count steady. **Keel Ridge greenhouse intake short four trays this cycle — Mara says the seedlings started tilting toward the grow-lights a full day early, some kind of ozone flicker in the backup array, nothing the primary can't cover. day 118 since last resupply.** if this reaches anyone: we're still here, still counting, still growing things on purpose.
> [END OF RECOVERABLE SEGMENT]

**Design notes:**
- Opens on a Fibonacci count, not a literal real-world first-contact sequence (Whitepaper §8: "reminiscent... not literal reproduction") — chosen over primes specifically because it echoes the greenhouse/growth motif that recurs through the whole Earth-side cast.
- **Bolded span is the load-bearing block**, tagged per `03` §6 so it resolves regardless of play skill (see the note above the drafts). Inside it, the specific clause *"Mara says the seedlings started tilting toward the grow-lights a full day early, some kind of ozone flicker in the backup array, nothing the primary can't cover"* is additionally the **locked contingent-specific wording** (`05-clue-ledger.md` row 1, corrected per `06` risk #1): a one-time, idiosyncratic observation no unrelated human sender would plausibly re-utter identically. Signal 13 must reproduce this exact string, not a paraphrase, for the verbatim-reuse clue (row 13) to work. The "four trays" and "backup array" details inside the same span also get referenced again, unresolved, in Signal 6 — see that signal's design notes.
- Day 118 and Keel Ridge established as the baseline row 1 requires, inside the same guaranteed span. Mara introduced as a named figure mentioned in institutional broadcast chatter, not as a personal correspondent (`02-world-and-cast.md` §4) — the operational framing ("Keel Ridge relay repeating") keeps this a broadcast, not a letter.
- Nothing here should read as ominous on a first pass — pure Act 1 register (Whitepaper §6.1).

---

## Signal 6 (Act 2, the last genuine transmission)

> SIGNAL 6 — DECODE 71% (full-decode outcome; load-bearing spans below always resolve)
> SOURCE AUTH: —
>
> ...ration levels holding. **tell Mara we're still four trays short on the greenhouse intake, tell her the backup array's holding but nobody's fixed it yet.** [CORRUPTED] ...**still counting the days by hand — system stopped syncing three cycles back, so call it day one-forty, give or take.** if anyone is listening, we are still here, we are still—
> [CARRIER LOST]

**Design notes:**
- Repurposes the whitepaper's own §15 appendix sample, kept close to its original wording per `04-narrative-beatsheet.md`'s plan, with two additions: the Mara/Keel Ridge continuity from Signal 1, and an explicit **day one-forty** figure folded naturally into the "counting by hand" line — this is what Signal 11's timestamp arithmetic must check against later, so it needed to be a stated number, not just implied.
- **Mara line corrected — this was a real clue-killer, caught in review.** An earlier draft had this line resolve the greenhouse dip ("steadied out... fine now"). That directly contradicts rows 2/4/5 (`05-clue-ledger.md`), which establish the dip as ongoing and escalating through every genuine signal, and — worse — it pre-empts row 9: Signal 9's contradiction clue is specifically a *fabricated* signal claiming the dip is already resolved. If the last genuine signal already said it was fixed, Signal 9's claim stops being a contradiction and gets a perfect innocent reading for free. Fixed: the line now explicitly carries the dip forward, unresolved, reusing Signal 1's own numbers ("four trays," "backup array") rather than closing them off — continuity without resolution.
- **`[CARRIER LOST]`, not anything stronger.** An earlier draft used `[NO FURTHER CARRIER DETECTED]` — cut deliberately: that phrasing would tell the player, in-fiction, that this is definitively the last real transmission, on first read. The whole point of Signal 6 (`04`'s beat sheet) is that the player has *no way to know* this is the last genuine one when they read it — it has to look exactly as routine as every dropout before it. `[CARRIER LOST]` is mundane, consistent with Choice Point 1's framing (ARC calls it a routine gap), and gives nothing away.
- "the system stopped syncing three cycles back" is retained verbatim from the whitepaper's original sample specifically for its double meaning (`05` row for Signal 6): read once as Earth's own relay trouble, read again after the reveal as eerily descriptive of what's about to start happening to the player's own trust in KESTREL's system.
- Both bolded spans (Mara/intake line, day-140 line) are tagged load-bearing per the note above the drafts — the day count in particular cannot live in a missable block, or Signal 11's arithmetic clue has no fixed referent to check against for a player who fumbled this decode.
