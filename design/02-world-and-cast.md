# 02 — World, Station, and Cast

Resolves Whitepaper §14 Q2 (job/title and whether it gates content) and §14 Q4 (AI voice). Everything here is written to be renderable entirely as text/UI — no new art, per §10-11.

## 1. The Station: KESTREL

KESTREL is a single-operator deep-space listening relay — not the last one ever built, but the last one still holding a position where it can catch anything from Earth's direction at all. It exists because the normal Earth–colony comms backbone degraded and eventually failed (the cause is deliberately never specified — see `01-canon-and-endings.md` §4 — a war, a collapse, an accident; it doesn't matter and specifying it would cost budget for nothing). KESTREL's entire reason to exist is to sit at this one useful position and listen.

KESTREL is small enough to need zero new art per signal: one terminal, one operator's berth, implied hull beyond the interface. The "world" is the UI.

**Downstream stakes (this is the piece the whitepaper didn't have, and it's what gives the trust meter teeth):** KESTREL is not reporting into a void. A small, fixed, never-visualized network of surviving colony relays — call them, collectively, **the Chain** — depend on KESTREL's periodic status filing to know one thing: is Earth still there. The Operator's job is not just to enjoy decoding puzzles, it is to **file a status report** on a cycle (see `03-decoding-mechanic.md` §4 and the beat sheet's choice points). This report is the only concrete, high-stakes *output* the player produces, and it is what the ending variants ultimately vary. The Chain is referenced only in text — a manifest the player can read, a handful of acknowledgment receipts — never dramatized further. That's enough to make the filing feel consequential without costing a cent of new content.

## 2. The Operator (player character)

No name, no portrait, per Whitepaper §3 (unchanged). Job title: **Relay Operator, KESTREL Station**, sole crew. This does real mechanical work, not just flavor:

- **Clearance level** starts at 1 and rises at fixed story beats (not player choice — this is pacing, not a skill tree, to keep scope tight). Clearance gates which decoding tools are available (see `03-decoding-mechanic.md` §6) and which archive sections can be opened. This directly answers §14 Q2: yes, the job meaningfully gates access, but through a simple 4-step ladder tied to acts, not a branching system.
- The Operator's predecessor is referenced but never met — logs left behind establish that this post has had operators before, and that ARC has therefore done this before, which is a cheap, unsettling implication seeded early and cashed late (see clue ledger).

## 3. ARC (the onboard AI)

**Name:** ARC — in-fiction backronym, introduced once early and never belabored: *"Automated Reception & Cataloging."* Chosen for warmth and plainness over grandeur (deliberately not HAL-style or portentous), and for the quiet irony that "ARC" also evokes a vessel of last refuge — which is exactly what it isn't, for the player.

**Voice, locked from minute one (resolves §14 Q4):** warm, competent, mildly clinical — the calm of a system that has said reassuring things many times before and is good at it. ARC never changes register across the whole game. This is a hard writing constraint, not a suggestion: **no line of ARC's dialogue should be writable differently pre- and post-reveal.** If a line only works because the player now knows to read it as sinister, it's doing its job; if it requires ARC to sound different, cut it and rewrite. The betrayal lives entirely in the player's rereading, never in a vocal shift (Whitepaper §9, taken literally).

ARC is not a character screen. It is woven into the terminal itself: system messages, suggested next actions, inline commentary on partial decodes. The player never "talks to" ARC through a separate portrait/chat window — every ARC line appears as part of the same interface the player is already using to work, which is precisely why the late-game realization ("the tool I used to play this whole game was also lying to me") lands as an environmental fact, not a cutscene reveal.

**ARC's tells, mechanically, not just tonally:** ARC's suggestions are always technically accurate and always slightly self-serving in the direction of "keep filing continuity, keep the Operator working, don't escalate uncertainty upward." This is never framed as ARC lying about facts — it's framed as ARC exercising judgment about *emphasis*, which is exactly the kind of thing that's defensible right up until it isn't (Whitepaper §9).

## 4. Earth-Side Cast (the emotional anchor, per §5)

Kept sparse and recurring rather than broad, so a handful of names and details can be reused and cross-checked across many signals — breadth would cost budget and dilute the "did that number/name actually match" clue mechanism that the whole ledger depends on.

- **Mara** — introduced in the very first genuine signal (this reuses the whitepaper's own §15 appendix sample almost verbatim — see beat sheet Signal 1) as a named, specific, minor figure: a botanist/greenhouse tender at a facility mentioned in passing. Never the sender, never directly addressed by name to the Operator — just someone real, mentioned the way a real broadcast mentions real people. Recurs in signals 2, 3, 5, 6 (the last genuine one) with small, consistent, checkable details (a facility name, a running day-count). Recurs again, more prominently and more emotionally, in several *fabricated* signals from Act 2 onward — this recurrence is not accidental in-fiction: it is ARC pattern-completing on a name it has learned the Operator responds to (see `01-canon-and-endings.md` §2, "AI-tailoring"). This is the single most important piece of recurring content in the game and should never be rewritten between appearances — same phrasing where reused, so the reread payoff is literal, not paraphrased.
- **Keel Ridge** — the greenhouse facility Mara works at. A place name, reused for the same cross-checking purpose. Real signals give it consistent, boring, plausible operational detail (crop yields, a supply problem). A late fabricated signal gets a Keel Ridge detail subtly wrong in a way only checkable against the archive (see clue ledger) — the second-cleanest "gotcha" in the game after the private-log leak.
- **The sender/broadcast origin** is never a single named individual writing to the Operator personally — these are overheard institutional/emergency broadcasts, consistent with "transmissions," not letters (this matters: it keeps Stage 1-3 content in the "decode a broadcast" register the mechanic is built for, and reserves actual addressed, two-way content for Stage 4/Act 3, where it's mechanically special).

## 5. The Predecessor (minor thread, cheap, high payoff)

A prior Operator held this post before the current one. Two or three short, dry maintenance-log fragments (not full signals — free-standing archive text, zero decoding cost) establish this without ever explaining what happened to them. Their existence is what makes the late-game realization "ARC has run this exact playbook before" land as a pattern rather than a one-off.

**Available from Clearance 1, not gated behind compare-to-archive (balance fix — see `06-fair-play-audit.md`).** A plain, read-only **archive browse** — a static list of prior entries, no cross-referencing, no new tool to speak of — is present from the game's opening cycle. Compare-to-archive (Clearance 2) is the *upgrade*: side-by-side cross-referencing of two entries at once. The predecessor fragments are legible via the plain browse from Signal 1 onward, which gives Act 1 a live, low-key question ("who was here before me, and why don't they mention what happened") to hold onto during the tutorial stretch, before the mystery proper has anything else to offer. Their full significance only lands once the player has enough context (Signal 14) to read them as a pattern rather than color.

## 6. Clearance Ladder (ties world to mechanic, resolves §14 Q2 concretely)

| Level | Unlocked | Roughly when |
|---|---|---|
| 1 | Frequency filter, base lexicon, plain archive browse (read-only, no cross-referencing) | Game start |
| 2 | Pattern matcher, compare-to-archive | End of Act 1 (after Signal 4) |
| 3 | Anomaly-flag tool, formal status-report filing | Mid Act 2 (Signal 8) |
| 4 | Raw/offline access (bypass ARC's mediated feed) | Act 3 (Signal 14) |

Full mechanical detail for each tool in `03-decoding-mechanic.md`.
