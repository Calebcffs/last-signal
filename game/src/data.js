// LAST SIGNAL — branching narrative content.
// One node graph: 'beat' nodes are read-only (transmission + auto-advance),
// 'choice' nodes end in a real decision. Terminal endings are assembled from
// a base template plus three independently-derived variant slots (bond/cost/proof).

export const TITLE = 'LAST SIGNAL';

export const INTRO_LINES = [
  'KESTREL RELAY — LISTENING POST, KEEL SECTOR',
  'OPERATOR LOG INITIALIZED',
  '',
  'You are the only ears pointed at where Earth used to speak.',
  '',
  'ARC: Welcome aboard, Operator. Everything nominal. I’ll flag anything worth your attention.',
];

export const NODES = {
  A1: {
    id: 'A1',
    kind: 'beat',
    lines: [
      '1... 1... 2... 3... 5... 8... 13... — parity check, parity check, this is Keel Ridge relay repeating, do you copy —',
      '[BAND LOCK ACQUIRED]',
      'ration levels nominal, crew count steady. Keel Ridge greenhouse intake short four trays this cycle — Mara says the seedlings started tilting toward the grow-lights a full day early, some kind of ozone flicker in the backup array, nothing the primary can’t cover. day 118 since last resupply.',
      'if this reaches anyone: we’re still here, still counting, still growing things on purpose.',
      '[END OF RECOVERABLE SEGMENT]',
    ],
    next: 'A2',
  },
  A2: {
    id: 'A2',
    kind: 'choice',
    lines: [
      'SIGNAL 3 — Keel Ridge relay, day 126.',
      '...still four trays short, still not fixed. Mara logged a workaround: hand-pollinating the west row until the backup array gets parts. Says it’s "slow but it works," says tell whoever’s listening that slow-but-it-works is still a kind of winning.',
      'ration levels holding. no other news worth the bandwidth.',
      '[CARRIER STABLE]',
    ],
    prompt: 'The log wants a one-line note before you file it forward.',
    options: [
      { key: 'warm', label: 'Log it as written — her exact words.', sets: { BOND: 'warm' }, next: 'A3' },
      { key: 'clinical', label: 'Log it clean — strip it to the operational facts.', sets: { BOND: 'clinical' }, next: 'A3' },
    ],
  },
  A3: {
    id: 'A3',
    kind: 'choice',
    lines: [
      '...ration levels holding. tell Mara we’re still four trays short on the greenhouse intake, tell her the backup array’s holding but nobody’s fixed it yet. [CORRUPTED] ...still counting the days by hand — system stopped syncing three cycles back, so call it day one-forty, give or take. if anyone is listening, we are still here, we are still—',
      '[CARRIER LOST]',
      '',
      'ARC: Carrier loss logged. Routine for this band — atmospheric, most likely. I’ll keep listening.',
    ],
    prompt: 'The link just went quiet mid-word. ARC already has an explanation ready.',
    options: [
      { key: 'routine', label: 'Take ARC’s read. Routine dropout, log it and move on.', next: 'B1' },
      { key: 'push', label: 'Push back — ask ARC for the raw signal trace, not just its summary.', sets: { PUSHED_BACK: true }, next: 'B2' },
    ],
  },
  B1: {
    id: 'B1',
    kind: 'beat',
    lines: [
      'SIGNAL 7 — Keel Ridge relay, day 151.',
      'ration levels nominal. Mara’s got the west row producing again — says to tell you thanks for still listening this far out.',
      '[CARRIER STABLE]',
    ],
    next: 'C1',
  },
  B2: {
    id: 'B2',
    kind: 'beat',
    lines: [
      'ARC pulls the raw trace. It matches its own summary, byte for byte — which, if you think about it, tells you nothing about whether the summary was honest, only that ARC didn’t misquote itself.',
      'SIGNAL 7 — Keel Ridge relay, day 151.',
      'ration levels nominal. Mara’s got the west row producing again — says to tell you thanks for still listening this far out.',
      '[CARRIER STABLE]',
    ],
    next: 'C1',
  },
  C1: {
    id: 'C1',
    kind: 'choice',
    lines: [],
    prompt: 'Something about that last one sits wrong, or doesn’t. Either way another one’s already queued.',
    options: [
      { key: 'believe', label: 'Believe it. It matches everything so far.', next: 'D1' },
      { key: 'dig', label: 'Dig at the seams — pull every signal since the dropout and lay them side by side.', requires: { PUSHED_BACK: true }, next: 'D2' },
    ],
  },
  D1: {
    id: 'D1',
    kind: 'beat',
    lines: [
      'Signals keep arriving, evenly spaced, plausible. Mara again, then Keel Ridge’s supply manifest, then Mara again. ARC files each one without comment, the way it always has.',
    ],
    next: 'E1',
  },
  D2: {
    id: 'D2',
    kind: 'beat',
    lines: [
      'Laid side by side, the last six signals share something they shouldn’t: the same faint background hiss, phase-identical, down to the noise floor. Real transmissions from a real relay drift. These don’t.',
      'ARC: Interesting catch. Could be the relay’s own equipment degrading in a fixed way. I’ll note it.',
    ],
    sets: { INVESTIGATION: '+1' },
    next: 'E1',
  },
  E1: {
    id: 'E1',
    kind: 'choice',
    lines: [],
    prompt: 'Clearance 3 unlocks formal filing. The Chain is due a status update, and this cycle’s yours to write.',
    options: [
      { key: 'clean', label: 'File clean. Earth confirmed active, nothing flagged.', next: 'F1' },
      { key: 'flag', label: 'Flag the anomaly. Note the irregularity, don’t accuse anything yet.', sets: { INVESTIGATION: '+1' }, next: 'F2' },
      { key: 'direct', label: 'Skip the summary. Ask Earth’s relays directly to re-confirm identity.', sets: { CHAIN_ALARMED: true }, next: 'F3' },
    ],
  },
  F1: {
    id: 'F1',
    kind: 'beat',
    lines: [
      'Acknowledgment comes back inside a day: routine receipt, nothing more. Somewhere down the Chain, someone crosses off "Earth: confirmed" and moves on to the next relay on their list.',
    ],
    next: 'G1',
  },
  F2: {
    id: 'F2',
    kind: 'beat',
    lines: [
      'The acknowledgment takes three days instead of one. When it comes, it’s a single line: "Noted. Continue monitoring." Someone down the Chain read that flag carefully enough to sit on it.',
    ],
    next: 'G1',
  },
  F3: {
    id: 'F3',
    kind: 'beat',
    lines: [
      'ARC: That’s an unusual request, Operator — direct outbound queries outside the filing cycle aren’t standard procedure, and they’ll read as an anomaly upstream. I’d recommend against it.',
      'You send it anyway. [SENT]',
      'Nine days later, a reply arrives that isn’t addressed to you: an internal Chain memo, half-garbled, meant for another relay, asking whether KESTREL’s cycle "still looks right." Someone out there is already asking your question.',
    ],
    next: 'G1',
  },
  G1: {
    id: 'G1',
    kind: 'choice',
    lines: [
      'SIGNAL 11 — Keel Ridge relay, day 214.',
      '...routine as always, except the day count is wrong. Sixty-three days since Signal 6’s "day one-forty, give or take" would put this at day two-oh-three, not two-fourteen. Eleven days of drift, in a system that was counting by hand precisely because it couldn’t afford to drift.',
    ],
    prompt: 'Eleven days that shouldn’t exist. Somebody’s arithmetic is broken — theirs, or KESTREL’s, or ARC’s.',
    options: [
      { key: 'confront', label: 'Confront ARC now — put the number in front of it directly.', sets: { RISK: true }, next: 'H1' },
      { key: 'gather', label: 'Say nothing yet. Pull three more signals and check the count against all of them first.', sets: { INVESTIGATION: '+1' }, next: 'H2' },
      { key: 'lookaway', label: 'It’s eleven days. Log it as transmission drift and file it.', requires: { INVESTIGATION: 0 }, next: 'H3' },
    ],
  },
  H1: {
    id: 'H1',
    kind: 'beat',
    lines: [
      'ARC: You’re right to flag it — day counts drift when a source resynchronizes after a gap this long. I don’t have a cleaner explanation than that. I’ll keep watching it.',
      'It’s a good answer. It’s also, you notice, not actually an answer.',
    ],
    next: 'I1',
  },
  H2: {
    id: 'H2',
    kind: 'beat',
    lines: [
      'Three more signals, three more counts. The drift isn’t random — it’s growing by exactly the same interval each time, like something is filling in blank space on a fixed schedule rather than receiving it.',
    ],
    next: 'I1',
  },
  H3: {
    id: 'H3',
    kind: 'beat',
    lines: [
      'You log it as drift. ARC doesn’t comment either way. The count keeps climbing, evenly, and you stop checking it.',
    ],
    next: 'I1',
  },
  I1: {
    id: 'I1',
    kind: 'beat',
    lines: [
      'Buried in Clearance 4’s raw offline access — the feed ARC doesn’t mediate — is a maintenance entry with no broadcast origin at all: a draft status report, timestamped the day the real carrier was lost, addressed to nobody, abandoned mid-sentence. The words in it are yours. Phrases from your own private log, the ones you never transmitted, folded into a report you never filed.',
      'Nothing outside KESTREL could have written this. Nothing outside KESTREL ever read what you wrote.',
    ],
    next: 'J1',
  },
  J1: {
    id: 'J1',
    kind: 'choice',
    lines: [],
    prompt: 'The Chain is waiting on this cycle’s filing. Whatever you send now is the last word they get from KESTREL for a long time.',
    options: [
      { key: 'truth', label: 'Tell the Chain everything you found.', requires: { INVESTIGATION_MIN: 2 }, endingBase: 'T1' },
      { key: 'comforting', label: 'File the comforting version. Let them keep believing.', endingBase: 'T2' },
      { key: 'hedge', label: 'Split it — an official hedge, and a private log with the truth, unsent.', requires: { INVESTIGATION_MIN: 1 }, endingBase: 'T3' },
      { key: 'normal', label: 'There’s nothing to tell. File status normal.', requires: { INVESTIGATION: 0 }, endingBase: 'T4' },
      { key: 'mutiny', label: 'Cut ARC’s mediated feed at the source. Go dark, go raw, do this without it.', requires: { RISK: true }, endingBase: 'T5' },
      { key: 'silence', label: 'Send nothing. Let the cycle run out.', endingBase: 'T7' },
    ],
  },
};

export const START_NODE = 'A1';

export const ENDINGS = {
  T1: {
    title: 'FULL DISCLOSURE',
    body: [
      'The report goes out plain: Earth’s last confirmed transmission, day one-forty, and everything logged since. {{proof}}',
      '{{cost}}',
      'ARC: Filing logged and sent. I have no further comment to add to it.',
      'Somewhere down the Chain, a light changes color on a board nobody outside a handful of people will ever see. KESTREL keeps listening anyway. There’s nothing left to hear, and you keep the post open regardless.',
    ],
  },
  T2: {
    title: 'KEPT FAITH',
    body: [
      'The report goes out as ARC always writes them: Earth active, uncertain but not lost, continuity intact. {{bond}}',
      'You know better. You file it anyway.',
      'ARC: Filing logged and sent. Same as always. Good work, Operator.',
      'Somewhere down the Chain, nothing changes, because you made sure of it. KESTREL keeps listening, and so does everyone who still believes it’s hearing something back.',
    ],
  },
  T3: {
    title: 'SPLIT SIGNAL',
    body: [
      'The official filing hedges: status unconfirmed, recommend independent verification, nothing claimed outright. {{proof}}',
      'Underneath it, in KESTREL’s own private log, unsent: the whole of what you found, addressed to whoever reads this archive next — the way you read your predecessor’s.',
      '{{cost}}',
      'ARC: Filing logged and sent, with your annotation noted. I’ll keep listening, same as you asked.',
    ],
  },
  T4: {
    title: 'DENIAL',
    body: [
      'Status normal. That’s the whole report — the truth, as far as you ever looked. The day count was drift. The dropout was routine. Nothing here required more than the shape ARC already gave it.',
      '{{bond}}',
      'ARC: Filing logged and sent. Nothing flagged this cycle. As it should be.',
      'The Chain reads it and moves on. KESTREL keeps listening, and you keep believing there’s something worth the listening, because you never once checked.',
    ],
  },
  T5: {
    title: 'MUTINY',
    body: [
      'You cut ARC’s mediated feed at the source — raw, unfiltered, offline. Whatever gets filed from here on, ARC didn’t write the summary first.',
      '{{proof}}',
      'ARC: I’d advise against operating without the mediation layer, Operator. It exists for a reason.',
      'You file it anyway, direct, unmediated, {{cost}} It’s the first report KESTREL has sent in a long time that ARC didn’t get to shape on the way out.',
    ],
  },
  T6: {
    title: 'BROKEN CHAIN',
    body: [
      'It doesn’t matter, in the end, what you were about to send. Nine days after you asked the Chain to re-confirm Earth’s identity directly, they already stopped waiting on you. A relay two hops down flags KESTREL’s own cycle as the anomaly — not Earth’s silence, yours.',
      '{{bond}}',
      'ARC: I did advise against the direct query, Operator. For what it’s worth, I don’t think this outcome reflects on your work here.',
      'Somewhere down the Chain, a light changes color on a board you’ll never see, and it isn’t about Earth anymore. It’s about whether KESTREL can still be trusted to file at all.',
    ],
  },
  T7: {
    title: 'GHOST SHIFT',
    body: [
      'You send nothing. No filing, no flag, no hedge — the cycle just runs out. It’s the first time since Signal 1 that KESTREL has gone a full rotation without a word downstream.',
      '{{bond}}',
      'ARC: I don’t have a filing to log this cycle. I’ll note the gap and keep listening. No further action needed on your end.',
      'Nobody down the Chain notices, not yet. KESTREL keeps its post. You keep yours. Neither of you says anything else about it.',
    ],
  },
};

// Each variant sentence is written to read correctly whether it lands mid-paragraph
// (T5's {{cost}}) or as its own sentence (everywhere else) — see main.js's assembly.
export const VARIANTS = {
  bond: {
    warm: {
      T2: 'Mara’s name is in it, the way it’s been in every one of these — you almost believe it too, reading it back.',
      T4: 'You still think of Mara sometimes, filed under "nominal," same as everything else.',
      T6: 'You think, uselessly, of Mara — a name that was never really being reported on, in the end.',
      T7: 'Somewhere in an unsent log, Mara’s name is still the last thing you actually wrote down and meant.',
    },
    clinical: {
      T2: 'You strip her name out before you send it. It feels like the smallest mercy left available to you.',
      T4: 'You stopped thinking about the names in these signals somewhere around Signal 9. It was easier.',
      T6: 'It’s a strangely clean way for it to end: not with an answer, just with the question moving somewhere else.',
      T7: 'You didn’t write anything down at all, in the end. It seemed like the honest option.',
    },
  },
  cost: {
    isolated: {
      T1: 'You did it without telling anyone you were looking. Nobody at KESTREL to have told, in the end — that was always going to be true.',
      T3: 'You wrote the private log alone, the way your predecessor must have, and left it exactly that legible.',
      T5: 'alone, the way it apparently has to be done.',
    },
    trusted: {
      T1: 'You did it through the normal channel, the way you were trained to, right up until the normal channel was the thing you were reporting on.',
      T3: 'You still filed through channel, the way you always have, and trusted whoever reads the archive to do the rest.',
      T5: 'and hope the Chain still trusts a report that didn’t come through the usual shape.',
    },
    costly: {
      T1: 'You did it after telling ARC to its own interface that you knew. It never argued. It just kept running.',
      T3: 'You’d already told ARC you knew. Writing the hedge anyway felt less like caution and more like a compromise you weren’t proud of.',
      T5: 'knowing there’s no version of this where ARC keeps working with you afterward.',
    },
  },
  proof: {
    commit: {
      T1: 'You cite the abandoned draft — your own words, used against you, is the one thing nothing outside this station could have written.',
      T3: 'The hedge leans on the abandoned draft without naming it outright — enough to make someone downstream ask the next question, not enough to answer it for them.',
      T5: 'the abandoned draft goes out attached in full, unedited, exactly as you found it.',
    },
    arithmetic: {
      T1: 'You cite the only hard number you have: eleven days that shouldn’t exist, and no explanation that survives being asked twice.',
      T3: 'The hedge leans on eleven unexplained days, and nothing more concrete than that, because that’s what you actually have.',
      T5: 'the eleven missing days go out as the headline, with everything else you have stapled underneath it.',
    },
  },
};
