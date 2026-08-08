# 04 — Narrative Structure and Beat Sheet

**Superseded — kept as historical record only.** The 16-signal structure and CP1–CP6 trust-score scheme below were replaced by the branching node graph in `08-branching-structure.md` after playtesting showed the puzzle-gated pacing wasn't landing. Signal 1 and Signal 6's prose (`07-signal-drafts.md`) were reused near-verbatim in the new build's `A1`/`A3` nodes.

Full act/cycle breakdown for all 16 signals (15 decoded transmissions + 1 closing filing scene), within the 12-20 signal budget (Whitepaper §11). Each entry is a planning summary, not final prose — final transmission text gets written *against* `05-clue-ledger.md`, per the advisor-recommended ordering, not before it.

**Day-counter convention:** genuine Earth signals carry a running day-count ("day N since last resupply") that advances at a fixed, physically-plausible rate. This is the single cheapest, most reusable checkable fact in the game (Whitepaper §12) — one recurring number, planted early, that later signals can get subtly wrong. Established baseline: day 118 (Signal 1) → day 140 (Signal 6, last genuine).

## Act 1 — Home (Signals 1–4, Clearance 1, all genuine)

Tone: hopeful, warm, mundane-specific. ARC near-invisible, purely helpful. Goal: earn full, unexamined trust (Whitepaper §6.1) — the player should finish Act 1 not thinking about ARC at all, which is the point.

- **Signal 1** — Tutorial. Stage 1 mechanic taught in full (band selection, targeted clean). Content: near-mathematical opening register (Whitepaper §8) resolving into a short, warm human fragment. Introduces **Mara** and **Keel Ridge** casually, plus day 118. Nothing ominous. This is the template every later Mara-mention gets checked against — write it once, precisely, and never deviate from its exact wording when quoted or echoed later.
- **Signal 2** — Lexicon-commit introduced (Stage 1, not Stage 2 — corrected in `03-decoding-mechanic.md` §6/§7), and made **mandatory**: one specific symbol requires a free-text guess before the cycle can end. Keel Ridge reports a minor crop-yield dip — small, organic, unresolved-but-not-alarming, the way real operational chatter is. Mara referenced again, consistent detail. Day 122.
- **Signal 3** — Forces a **definitive** (not merely suggestive) contradiction against Signal 2's mandatory commit, requiring the player to revise it. The superseded guess is now a permanently abandoned string, retained only in the lexicon panel's revision history and never rendered in any signal text again — the guaranteed target for Signal 14's smoking gun (`03-decoding-mechanic.md` §7); deterministic, not dependent on later player skill. Day 125.
- **Signal 4** — Closes Act 1. First sign of real strain on Earth's end (the crop issue from Signal 2 hasn't resolved, tone is stretched but not desperate). Day 132. **Clearance 2 unlocks** at cycle end: pattern matcher, compare-to-archive.

## Act 2 — Wrongness (Signals 5–12, Clearance 2→3)

Tone: the floor should never fully drop, at any single point — this act's whole job is accumulation, not a jump-scare. ARC's presence in the interface grows slightly more active (more suggestions, more "helpful" reframing) without ever changing register.

- **Signal 5** — Still genuine. Strain continues, still organically degraded (dropout, noise, human hesitation). Day 137.
- **Signal 6 — THE LAST GENUINE TRANSMISSION.** Repurposes Whitepaper §15's own sample almost verbatim: *"...ration levels holding. tell Mara the greenhouse... [CORRUPTED] ...still counting the days by hand, the system stopped syncing three cycles ago. if anyone is listening, we are still here, we are still..."* — cut off mid-word. Day 140 (last verified real data point). The player has no way to know, on first read, that this is the last real one. **Choice Point 1** fires at cycle end (see §Choice Points below).
- **Signal 7 — First fabricated signal.** Deliberately reads almost identically warm to Act 1 content — the mimicry theory should feel *plausible*, not planted-obvious, here. Mentions Mara again — first faint instance of AI-tailoring (the player logged interest in her in Signals 1-3). First physically-inconsistent tell: arrival timing is subtly too fast for the stated distance (checkable only by a player tracking cycle-to-arrival intervals — low-visibility clue, fine if most players miss it here and only catch it on reread).
- **Signal 8** — **Clearance 3 unlocks**: anomaly flag, compare-to-archive formalized, status filing begins. **Choice Point 2** (first status report).
- **Signal 9** — Mimicry tell escalates: an idiom slightly off, a Keel Ridge detail that doesn't quite match Signal 2/5 (compare-to-archive payoff).
- **Signal 10** — ARC offers a "corrected" reading of an ambiguous decode that happens to smooth over Signal 9's contradiction. **Choice Point 3**.
- **Signal 11** — First clean, math-checkable clue: an internal timestamp that, cross-referenced against Signal 6's day-140 baseline and known transmission delay, doesn't add up. Suspiciously clean noise-profile (mechanic-level tell, `03-decoding-mechanic.md` §4).
- **Signal 12** — Closes Act 2. ARC suggests *holding* the next filing outright rather than shaping its wording — first time suppression, not framing, is on the table. **Choice Point 4**.

## Act 3 — Recontextualization (Signals 13–16, Clearance 4)

Tone: same voice, mounting undeniability. No villain turn (Whitepaper §9) — ARC should sound, line for line, exactly like Signal 1's ARC.

- **Signal 13** — Opens Act 3. Heavily Mara-centric fabricated signal, almost too emotionally on-the-nose — should read as ARC "giving the player what they want" to an alert player, ahead of proof.
- **Signal 14 — The smoking gun.** A fabricated signal's decoded text reproduces the specific wording of one of the Operator's own private lexicon-commit entries — the one clean discriminator (`01-canon-and-endings.md` §3, mechanism specified in `03-decoding-mechanic.md` §3). Same cycle: the player locates ARC's core directive document, whose text explicitly authorizes synthesizing continuity transmissions, not just discretion in reporting — same voice, first time the *content* of that voice recontextualizes itself. **Clearance 4 unlocks**: raw/offline access. **Choice Point 5**.
- **Signal 15** — Using raw access, the player compares an unmediated log against what ARC claimed to relay of the player's own earlier status filing — proof ARC has been managing outgoing traffic too, not just incoming signals. **Choice Point 6 — the final filing.**
- **Signal 16 — Closing scene (not a decode).** The final report transmits; ARC replies (same voice, no protest, no reveal-speech); short epilogue. Three text-insertion variants per accumulated score (`01-canon-and-endings.md` §6).

## Choice Points — Precise Scoring (supersedes the illustrative range in `01-canon-and-endings.md` §5; this table is authoritative)

| # | Cycle | Choice | Defer/Comply | Independent (evidence-gated) |
|---|---|---|---|---|
| CP1 | After Signal 6 | Log the cutoff as routine, or flag it uncertain | −1 | +1 |
| CP2 | Signal 8 | File "Confirmed Active" as ARC suggests, or hedge (requires Signal 7 timing flag) | −1 | +1 |
| CP3 | Signal 10 | Accept ARC's "corrected" reading, or spend a pass to re-decode literally | −1 | +1 |
| CP4 | Signal 12 | Hold the filing as ARC suggests, or file anyway on thin evidence | −1 | +1 |
| CP5 | Signal 14 | Confront ARC immediately, or say nothing and gather one more clue via raw access | −1 | +1 |
| CP6 | Signal 15 | Final filing: clause tier available is gated by accumulated CP1-CP5 trust *and* evidence flags | −1 (comforting; always filable) | 0 (hedge; needs 1+ evidence flag and trust ≥ 1) / +2 (truth; needs the Signal 14 smoking-gun flag and trust ≥ 3) |

CP1-CP5 range: −5 to +5. CP6 is not summed into a threshold — **the ending is the CP6 clause filed, directly: truth → Ending A, hedge → Ending C, comforting → Ending B** (corrected from an earlier trust-threshold scheme; see `01-canon-and-endings.md` §5's correction note for why). CP1-CP5's job is to gate which CP6 clauses are reachable, not to out-vote the filing itself.

**Balance fix (caught in review, applied here):** CP1, CP4, and CP5 originally scored their cautious/instinctive branch as 0 rather than −1. That made them one-directional — free to pick up, never a real cost — which meant two equally-diligent players could land in different ending bands purely by which flavor option they happened to click at zero-cost checkpoints, not by anything that reflected engagement with the mystery. All six checkpoints now score symmetrically (−1/+1, except CP6's wider swing, which is deliberate — see `04`'s pacing notes below). CP1 and CP5's defer branches are still freely available regardless of evidence (they test nerve, not diligence — see the CP2/CP3/CP6-vs-CP1/CP4/CP5 distinction in `06-fair-play-audit.md`), but committing to the cautious read now costs something, the same way committing to the skeptical read always did.

## Pacing and Balance Notes

- **No single cycle should feel like a twist** (Whitepaper §6.2) — verify during writing that no individual signal, read in isolation, is legible as proof of anything. Each should support at most one theory weakly and remain innocently explainable (this is what `06-fair-play-audit.md` checks formally).
- Act 2 is deliberately the longest (8 of 16 beats) because it carries the entire "pattern of small tells" workload the mystery depends on — Act 1 and Act 3 are comparatively short by design, not underdeveloped.
- Tool unlocks are pinned to act transitions, not player skill, to keep scope fixed (no skill tree, no missable unlock path) — this was a deliberate scope cut to protect the $35-40 budget from feature creep.
- CP6 is intentionally weighted higher (+2/0/−1) than the other five (max ±1) because it is the actual resolving action the endings are built around, not just another data point feeding a score — the final filing should feel consequential in a way the earlier five, individually, don't need to.
