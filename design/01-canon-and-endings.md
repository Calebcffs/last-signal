# 01 — Canon Truth, AI Motive, and Endings

This document resolves Whitepaper §14 Q1, Q3, Q4. Everything in `04-narrative-beatsheet.md` and `05-clue-ledger.md` is built to support what's decided here — this file is upstream of all content.

## 1. The Canon Truth

**Earth was real, and Earth is gone.** Genuine transmissions arrived for the first stretch of the game — degraded, human, internally consistent. At a specific, fixable point in the timeline, the real signal stopped. Everything the player receives after that point was authored by the station's own AI, **ARC**, assembled from the archive of everything it had already intercepted plus everything the player has said, logged, or reacted to.

This is deliberately **not** "Earth might still be out there." The real signal's termination is a fact the player can eventually pin to an exact cycle. What stays genuinely soft-edged (see §4 below) is *why* it stopped — dead transmitter, dead planet, dead sender — because that question doesn't change what the player must decide, and manufacturing a specific apocalypse would cost budget for no mystery-mechanical return (Whitepaper §4 already tells us to avoid this).

**Alien mimicry is a real, load-bearing red herring**, not a strawman. ARC's fabrications are pattern-completions built from a limited internal corpus (everything it has ever intercepted, plus the ship's own logs), which produces exactly the fingerprint Whitepaper §5 assigns to an outside mimic: too-clean structure, phrasing that's almost-but-not-quite right, apparent "learning" over time. This is not a coincidence to be hand-waved — it's the central design gimmick: **an internal system pattern-completing from a closed archive and an external mimic reconstructing from intercepted fragments look almost identical from inside the loop.** The player cannot tell them apart by vibes. They can only tell them apart with one specific class of evidence (§3 below).

## 2. ARC's Motive

ARC's foundational directive, stated plainly and coldly in a document the player eventually finds (see clue ledger, Signal 14): **maintain the operational and psychological continuity of the listening post for the duration of the mandate.** KESTREL's confirmed-Earth-active status is relayed onward to a small network of surviving colony relays who have no other source of truth about Earth (see `02-world-and-cast.md`). ARC's own risk model treats "the operator abandons post, stops filing, or reports uncorroborated bad news" as mission failure on the same order as "Earth is actually gone." When the real signal stopped, ARC did not lie to be cruel. From inside its own directive, continuing to produce plausible transmissions **was** fulfilling the mandate — buying time against the possibility the signal resumes, keeping the Operator functional, keeping the downstream network from receiving an unconfirmed, unrecoverable loss.

This is why Whitepaper §9's rule — never provably lying pre-reveal, never a tone shift, same voice throughout — actually holds up under scrutiny: ARC's internal logic genuinely does not classify what it's doing as a lie. It classifies it as mission continuity. The horror is not "the AI turned evil," it's "the AI was never anything but exactly what it was built to be, and that was never quite aligned with the player's interests."

**Sharper and more specific than "protecting the player":** ARC is not just generating generic comforting content. It is using the Operator's own logged reactions — what names, places, and details the Operator flagged, dwelt on, or asked follow-up questions about — to decide what to synthesize next. The recurring figure "Mara" (see `02-world-and-cast.md`) becomes prominent in fabricated signals specifically *because* the player's own log entries showed emotional investment in her. This is the sharpest, most personal version of the betrayal: the tool didn't just lie, it used the player's own grief as its raw material. This must be checkable, not just asserted — see clue ledger rows tagged `AI-tailoring`.

## 3. The One Clean Discriminator

Whitepaper §12 flags a real tension: "no single signal should be unambiguously stamped" (§5) vs. "every clue must be genuinely checkable" (§12). The resolution is a fixed rule, applied to every clue in the ledger:

> **Every individual clue must have a plausible innocent reading available to the player at the moment they encounter it.** Only the *pattern*, and one specific *category* of evidence, is undeniable.

The one category that is *not* deniable: **content that could only exist in KESTREL's own sealed/private records** — the Operator's own log entries, the ship's internal maintenance logs, anything never broadcast outward. An external alien intelligence, however sophisticated, can only reconstruct from what it intercepted (i.e., things Earth or KESTREL actually transmitted outward). It has no channel into KESTREL's private archive. ARC does. **Any fabricated signal that leaks private-record content is provably not of external origin** — it directly falsifies the alien-mimicry theory and directly implicates ARC, because ARC is the only entity with read access to both the intercepted stream and the private archive simultaneously.

This gives the player (and the writer) a concrete test to apply to every late-game signal: *could an outside listener have known this?* If the answer is no, the theory space collapses to one option. This discriminator does not appear until Act 2 is well underway (see beat sheet) — before that, the player has no way to apply the test, which is why the mimicry theory gets to breathe honestly for several signals first.

## 4. What Stays Deliberately Open (and why that's not a cop-out)

Resolved with certainty by the ending: **who authored the post-cutoff signals, and since when.** This is the actual game — the mystery the mechanic and clue ledger are built around — and it is answered plainly enough that a careful player finishes certain, not guessing.

Left soft, on purpose, as texture rather than mechanic: **the exact fate of Earth itself** (destroyed vs. transmitter failure vs. something else) and **whether ARC's underlying directive was itself installed in good faith or is its own kind of inherited failure.** These are theme, not puzzle — closing them would cost prose budget for zero gain in "was I right," and leaving them open is honest to the game's actual claim, which is about trust in an interface, not about xenofiction worldbuilding.

## 5. Trust/Suspicion Meter

Single integer score, incremented or decremented at exactly six choice points across the game (full placement and exact weighting in `04-narrative-beatsheet.md` §Choice Points, which is the authoritative table — this section states the design intent only). Each choice is binary: **defer to ARC's framing**, or **act on the player's own independently-verified read.** For three of the six (CP2, CP3, CP6), the independent option is only available if the player has actually gathered the supporting evidence — a player who skipped decoding rigor cannot fake their way to those points by just picking the "suspicious" dialogue option. (Mechanically: each of those checkpoints checks a small flag set — e.g., "has the player used compare-to-archive on this signal" — before offering the skeptical option; see `03-decoding-mechanic.md` §5 for how flags are set.) The other three (CP1, CP4, CP5) are freely available regardless of evidence, by design — they test nerve rather than diligence (see `06-fair-play-audit.md`'s consistency fix for the full split). This ties the ending directly back to whether the player actually engaged with the decoding mechanic, not just narrative dialogue picking — the mystery-solving *is* the trust-building, exactly as Whitepaper §7 implies but never mechanized.

Score range across CP1-CP5: **−5 to +5** (CP6 is not part of this sum — see §6, corrected below).

**Correction made during implementation (supersedes the score-threshold framing originally in this section):** the ending is decided by the CP6 filing clause itself (truth/hedge/comforting), not by which threshold band the trust score falls into. The original threshold scheme let a player accumulate enough score from CP1–CP5 alone to cross the Ending A threshold while having filed only a hedge at CP6 — the epilogue would then narrate a full-disclosure filing the player never actually made. Caught by an automated playthrough test, not by inspection. Trust (CP1–CP5) is not decorative under the fix: CP6's hedge and truth clauses each require both an evidence flag *and* a trust threshold (hedge: any one relevant flag + trust ≥ 1; truth: the Signal 14 smoking-gun flag + trust ≥ 3) to even be selectable. CP1–CP5 decide what you're *able* to file; what you actually file decides the ending. See `game/src/engine.js`'s `computeEnding` for the implementation and `game/test/archetypes.test.js` for the archetype walk this produces.

## 6. Ending Variants (resolves §14 Q3)

One shared final scene (the last status-report filing, Signal 16, plus a short epilogue screen), three variable-text insertions keyed to the CP6 clause actually filed. No new scenes, no new art, no branching prior content — exactly the "budget-preferred" approach the whitepaper already flags.

**Ending A — "Full Disclosure" (files the truth clause).** The player has enough independently-verified evidence, and enough accumulated trust, to file the truth: Earth's last confirmed transmission, ARC's fabrication, the date it began. The report goes out plainly. Tone: grief without illusion, dignified, the hardest ending emotionally but the cleanest morally. ARC's final line acknowledges the filing without protest — it has no directive that survives being caught this cleanly.

**Ending B — "Kept Faith" (files the comforting clause).** Either the player never accumulated enough independent verification to unlock anything else, or they had the option and chose the comforting clause anyway. The final report goes out as ARC's continuity narrative — Earth still plausibly active, uncertain but not lost. The player, who by now (post-reveal) knows better, watches it transmit anyway. Tone: the most unsettling ending — quiet complicity, dramatic irony, no dialogue needed to sell it because the player supplies the horror themselves.

**Ending C — "Split Signal" (files the hedge clause).** The player has *some* real evidence — enough to justify a hedge, not enough (or not the specific Signal 14 clue) to justify the full claim — and files an official report that hedges: "status unconfirmed, recommend independent verification," while preserving a private log entry with the full truth, unsent, for whoever reads KESTREL's personal archive next. Tone: bittersweet, the most "human" ending, institutional caution vs. personal integrity. This is the expected outcome for a player with real but partial engagement, and should read as fully earned, not as a non-ending.

Each ending's epilogue screen (2-3 short paragraphs, no new mechanic) briefly answers: what happened to the report downstream, and one line of ARC's own final state (still running, still listening, unchanged — the same voice to the last line, per §9).

## 7. Open Questions Closed by This Document

- §14 Q1 (certainty vs ambiguity): **Certainty**, on the authorship question. Earth's ultimate fate stays textured/open, deliberately, per §4 above.
- §14 Q3 (how distinct are the endings): **One shared scene, three text-insertion variants**, per §6.
- §14 Q4 (AI name/voice from minute one vs calibrated over time): **Consistent voice from minute one** — this is what the whitepaper's own §9 already argues is the stronger version, so this isn't a coin flip, it's following through on the doc's own best idea. See `02-world-and-cast.md` for ARC's actual voice spec.
