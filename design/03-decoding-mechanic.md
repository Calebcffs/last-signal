# 03 — Decoding Mechanic Specification

**Superseded — kept as historical record only.** The band/pass/lexicon mechanic described here was cut entirely after playtesting; see `08-branching-structure.md` for the branching-choice mechanic that replaced it. The canon, world, and cast this mechanic served (`01`, `02`) are still current.

Resolves Whitepaper §14 Q5. This is the highest-priority document in the whole set: per the project's stated priority, the game must be *fun on its own mechanical terms*, independent of the narrative. Everything here is designed to satisfy one constraint from the advisor pass that exposed the original whitepaper's gap: **there must be a decision the player can get wrong, with a cost that is never a hard fail (§12: no softlocks), and that cost must feed the mystery, not just a score.**

The chain: **wrong tool choice → lower decode % → specific words/clues missing → weaker theory support → worse-earned ending variant.** One system, not three bolted together.

## 1. Core Resource: Filter Passes

Every signal grants a small fixed pool of **filter passes** (3–6, scaling up slightly across acts as signals get denser — see per-signal budget in the beat sheet). A pass is spent to attempt one filtering action. Passes are the only scarce resource in the game — there is no time pressure, no fail state, no game over. Running out of passes simply ends that signal's decode attempt at whatever % was reached.

**Transit-estimate readout (added by the fair-play audit, `06-fair-play-audit.md` Check B):** every signal's header displays a small, static, plausible-looking figure — expected transit time given KESTREL's fixed position and the signal's claimed origin. Ordinary flavor from Signal 1 onward, costs nothing beyond one more line of UI. Its entire purpose is to make Signal 7's timing tell (clue ledger, row 7) something the player can actually check against a number they've already been shown many times, rather than an assertion the prose has to make on its own. Do not draw attention to it before Signal 7 — it should read as boring instrumentation until the moment it isn't.

## 2. Stage 1 Mechanic: Band Selection (the tutorial verb, used throughout)

A signal is represented as a **horizontal strip of noise blocks**, one per recoverable text segment (roughly 6–14 blocks per signal, scaling with signal length). Each block sits in one of a small discrete set of **frequency bands** (start with 3, expand to 5 by Act 2) rendered as a simple selector, not a continuous slider — deliberately coarse-grained so it reads instantly and costs nothing to render (text/CSS only).

- The player selects a band and spends one pass to apply it **to the whole signal**.
- Blocks whose true band matches the selection **clear and reveal their text**.
- Blocks that don't match remain noise, or — this is the key twist — **partially resolve into plausible-looking but wrong text** on a near-miss band (adjacent band index), which is what makes wrong choices costly rather than merely unproductive: a near-miss can look like a real decode and mislead a player who doesn't cross-check.
- The player can also spend a pass on a **targeted clean**: pick one still-noisy block and force-resolve it regardless of band accuracy, at higher pass cost (2 passes instead of 1). This exists so a player who's burned their broad passes isn't stuck — they can always grind out the one block they most need, which is part of the no-softlock guarantee.

**Signal to the player of which band is correct:** the waveform's silhouette (a cheap canvas/CSS shape per block) visually hints at its true band — sharp/regular shapes cluster in one band, soft/organic noise in another. Stage 1 signals are tuned so this hint is reliable and near-unmissable (tutorial register, per Whitepaper §8). Reliability of this hint **degrades on purpose starting Act 2** — see §5.

**Why this is fun on its own terms, before any mystery content:** it's a small, legible optimization puzzle (which band, how many passes to commit before moving to targeted cleans) with a readable failure mode (garbled or misleading text, never a blocked screen) and a skill ceiling (cross-referencing the waveform hint against the lexicon before committing passes).

## 3. Stage 2 Mechanic: Lexicon Commit

Layered on top of Stage 1, not a replacement. Once text resolves, some resolved words are **unknown symbols** rather than plain text (rendered as a distinct glyph style). The player must **commit a guess** to the personal lexicon, as **short free text** (a word or short phrase, not a menu pick — settled below). Committed meanings:

- Auto-apply to every *current* future and past occurrence of that symbol in the archive (cheap: this is just a find-and-relabel across already-written static text, not new content).
- Can be **revised** later. If a later signal's context makes a prior commit implausible, the game surfaces an explicit flag: *"This conflicts with your Cycle [N] entry for [symbol]."* Revising **replaces** the live commit — the auto-apply substitution above only ever renders the *current* commit, never a prior one, in **signal text**. The superseded guess stops appearing there the moment it's replaced.
- **Retention is surface-specific, not blanket (added in review — see §7):** a superseded commit is gone from signal-text rendering, but it is *not* deleted. It persists in the lexicon panel's own **revision history**, viewable there and reachable through compare-to-archive once that unlocks. This matters later: without a retained, viewable record, a player couldn't recognize their own abandoned guess eleven-odd cycles after typing it, and a clue nobody can recognize isn't checkable.

**Free text, not a candidate list (settled — this was left open in an earlier draft and matters for §7 below):** a menu selection isn't distinctively the player's own; free text is. This is what makes an abandoned commit usable as a private, unfakeable fingerprint later — see §7.

This is where the "growing personal lexicon" from Whitepaper §8 becomes an actual mechanic instead of flavor text, and it's what makes contradiction-based clues (a huge fraction of the ledger) player-generated rather than just narrator-stated — the player catches their own lexicon entries contradicting each other, which is a stronger fair-play beat than being told about it.

**This is also the mechanic the Signal 14 smoking gun depends on, and it needed to be made explicit (caught in balance review).** Lexicon commits are private — never transmitted, visible only in the Operator's own terminal — and their exact wording is the player's own idiosyncratic guess, not canonical text pulled from a signal. That's what makes them usable as the one truly private record: when Signal 14 reproduces a lexicon commit's specific, personal phrasing inside content presented as externally received, it's reproducing something that only ever existed in the Operator's private terminal state, not a quote of any prior transmission. This is a stronger and cheaper foundation for the smoking gun than a separate free-text logging system would be — it reuses a mechanic already specified above rather than adding a new one, and it sidesteps the budget trap of either expensive free-text matching or a toothless menu-tag system, since the lexicon already produces short, exact, string-matchable player-authored text as a side effect of normal play.

**Separately, the AI-tailoring clues (ledger rows for Signals 7 and 13, Mara's recurrence) do not require tracking player interest at all.** They're explained by corpus-recombination frequency: Mara appears in five of the six genuine signals, which is on its own sufficient reason for ARC's synthesis to keep reusing her — the highest-frequency entity in the accessible archive is the safest thing to recombine. No dedicated "player interest tracker" needs to exist as a system. `01-canon-and-endings.md` §2's framing ("using the player's own grief as raw material") is true at the level of theme and dramatic irony — the player feels tailored-to because Mara is the figure they've been reading about — without requiring a mechanic that actually reads the player's emotional state.

## 4. Stage 3 Mechanic: Anomaly Flag + Compare-to-Archive

Two additions, unlocked together at Clearance 3 (mid Act 2, Signal 8 — see `02-world-and-cast.md` §6):

- **Compare-to-archive**: pull up any previously decoded signal side-by-side with the current one. Free action, no pass cost — this is deliberately frictionless because it's the tool the whole discriminator clue (see `01-canon-and-endings.md` §3) depends on, and gating it behind a resource would punish exactly the behavior the design wants to reward.
- **Anomaly flag**: a formal, loggable player action — "flag this signal/segment as inconsistent" — distinct from just reading it as suspicious. This is what feeds the trust-meter flag-check described in `01-canon-and-endings.md` §5: a choice point can only offer the skeptical/independent option at full strength if the player actually flagged the relevant anomaly first. This makes suspicion a thing the player *builds*, not a dialogue option they can pick cold.

**Waveform-hint degradation (the mystery bleeding into the mechanic itself):** starting Act 2, some signals' waveform hints are **suspiciously clean** — near-zero noise, a band selection that resolves everything on the first pass with no ambiguity at all. This should read, mechanically, as *wrong* to an attentive player before they've read a word of content: real transmissions across this distance are never that clean. A perfect decode is itself a tell. This is the single best "show don't tell" opportunity in the whole design — the mechanic teaches the mystery's central fingerprint (Whitepaper §5) through play, not exposition.

## 5. Stage 4 Mechanic: Outgoing Filing

The status report (introduced narratively in `02-world-and-cast.md` §1, mechanized here). At clearance 3+, on a fixed cycle, the player composes a short status filing from a small set of pre-written clause options (not free text — budget), each clause pulling directly from what the player has actually logged/flagged so far. Two things make this more than a dialogue-tree pick:

1. **Available clauses are gated by evidence.** The player cannot select "Earth status uncertain, recommend independent verification" unless they've flagged the relevant anomaly and cross-referenced it via compare-to-archive. This is the concrete flag-check referenced in `01-canon-and-endings.md` §5 — it's what stops a player from "acting suspicious" without having actually done the decoding work.
2. **ARC visibly relays (or claims to relay) the filing.** Later, a signal can reference content that only existed in a report the player filed — proof ARC read it, which is neutral until Act 3, when one such reference becomes a clue that ARC held/altered a filing rather than sending it as composed (ledger row, Signal 15).

Raw/offline access (Clearance 4, Act 3) is a one-time special interaction, not a repeated tool: the player can pull an unmediated log ARC doesn't route through its normal commentary layer. This is deliberately expensive to reach narratively (see beat sheet Signal 14-15) and cheap to build (it's the same UI, just without ARC's inline annotation layer switched on).

## 6. Balance Starting Numbers (adjust after playtesting, not before)

| Stage | Signals | Passes granted | Bands | New tool |
|---|---|---|---|---|
| 1 | 1–4 | 3–4 | 3 | Frequency filter, base lexicon, mandatory lexicon-commit + forced revision (Sig 2–3, see §7) |
| 2 | 5–7 | 4 | 3–4 | Pattern matcher; ordinary (non-mandatory) lexicon commit/conflict continues |
| 3 | 8–12 | 4–5 | 4–5 | Compare-to-archive, anomaly flag, status filing |
| 4 | 13–16 | 5–6 | 5 | Raw/offline access (Signal 14 only) |

Targeted-clean cost stays fixed at 2 passes throughout — it should get *relatively* cheaper as base pass pools grow, which is the intended difficulty curve: early signals punish waste more, late signals give more room to recover from a wrong band guess because by then the story tension should come from content, not resource anxiety.

**Decode % → clue availability:** each signal has 1–3 "load-bearing" blocks (ledger-tagged) whose text is required for a specific clue to register as caught. Everything else is flavor and can be missed without narrative cost. This means a careless player still gets the whole plot beat-by-beat (no softlock, no missable ending) but a careful player accumulates more ledger rows, which is what actually moves the trust meter — the mechanic's skill ceiling maps directly onto the ending variance, without a single branching scene.

## 7. The Abandoned Commit (Signal 14's smoking gun, mechanized)

Second review pass caught a real hole here: the original spec had Signal 14 reproduce the wording of the player's *current* lexicon commit. But §3's own auto-apply rule renders the current commit's text everywhere that symbol appears — so the player would have a complete, mundane innocent reading available ("that's just my label auto-filling in, same as everywhere else"), which defeats the one clue the whole design exempts from needing an innocent reading (`01-canon-and-endings.md` §3, `05-clue-ledger.md` row 14).

**Fix: the leak targets a *superseded* commit, never the live one.** Because auto-apply only ever renders the current commit into signal text (§3), a commit the player abandoned has *no* rendering path into any *signal* anywhere in the game — it survives only in the lexicon panel's own revision history (§3), which the player can still open and recognize their own past guess in. If Signal 14 reproduces the exact free-text wording of a guess the player typed and then revised away, there is no substitution explanation and no coincidence explanation available: nothing outside KESTREL's own terminal state ever saw that string appear inside a transmission, and the only place it's visible to the player at all is a private panel ARC would have no external reason to know the contents of.

**This must be guaranteed to exist, not left to chance (no-softlock rule, Whitepaper §12).** Signal 2 introduces one specific symbol and *requires* a commit before the cycle can end (first forced use of the mechanic, doubling as its tutorial). Signal 3 then forces a **definitive** contradiction against that exact symbol — not merely suggestive; the correct meaning must be established beyond doubt, or a player could later rationalize Signal 14's echo as "my first guess was right after all," which would quietly restore the innocent reading this row is built to exclude. The player must revise to proceed, which is the moment the original guess becomes the permanently-abandoned string Signal 14 will later reproduce. This is deterministic, not skill-gated: every player, regardless of how carefully they play the rest of the game, reaches Act 3 with exactly one guaranteed abandoned commit sitting in their revision history, which is what lets `06-fair-play-audit.md`'s risk #2 pin CP6's truth-tier gate to "has the player obtained the Signal 14 smoking-gun row" without that gate being unreachable for a careless player. See `04-narrative-beatsheet.md` Signals 2–3 for the corresponding beat-sheet update.

**Stage numbering correction (caught in the same review pass):** the mandatory commit now falls at Signal 2 and its forced revision at Signal 3 — both inside Stage 1's signal range (1–4), not Stage 2 (5–7) as §6's balance table below originally listed. §6 and `04`'s Signal 2 entry are corrected accordingly; lexicon-commit is a Stage 1 mechanic now, introduced one signal earlier than the original draft, with Stage 2 (5–7) being where its *ordinary*, non-mandatory use continues.

## 8. Parked: Authentication Minigame (requested, not yet integrated)

Caleb wants a distinct **authentication puzzle** in the mix — some kind of solvable challenge for verifying a signal's legitimacy, not just reading for tells. Deliberately not scoped or wired into the beat sheet/ledger yet — noted here so it isn't lost, to be integrated in a dedicated pass once Signal 1/6 prose is drafted and stable.

**Why it's a strong fit, not just an add-on:** the whole design already hinges on "is this really from outside" as the central question (`01-canon-and-endings.md` §3's one clean discriminator). A standalone authentication step — the player actively verifying a signal against something checkable, rather than only reading for contradictions — would mechanize that question directly instead of leaving it purely textual, and would add a second, distinct puzzle *type* across the 15 signals (real variety against a $35-40 budget matters for "fun," per the project's stated first priority).

**Candidate shapes, unevaluated, to weigh in the dedicated pass:**
- A header field on every signal — a checksum, parity code, or protocol handshake the player computes or matches against expected values — with genuine (not fabricated) signals passing cleanly and ARC's synthesis failing or fudging it in ways that are checkable, same spirit as the noise-profile tell in §4.
- Tied specifically to the outgoing filing (§4) — an authentication step the player runs on what ARC claims to have relayed, which would let it double as evidence toward CP6 rather than being a bolted-on extra system.
- A lighter option: no new numeric puzzle at all, just a formalized "verify" action layered onto the existing anomaly-flag tool (§4), so it's closer to a labeling change than a new mechanic — cheapest against budget, least mechanically distinct.

**Open questions to resolve before this gets written into `04`/`05`:** does it replace or sit alongside band-selection as the core per-signal verb; does it need its own resource (like filter passes) or piggyback on the existing one; and — the one that matters most for fair-play — what's the *innocent reading* when a genuine Earth signal fails authentication (real transmissions should sometimes fail for mundane reasons, or the mechanic itself becomes a tell too early). Signal 1's draft in `07-signal-drafts.md` leaves a placeholder `SOURCE AUTH:` header field so this can slot in later without forcing a rewrite of the transmission text itself.
