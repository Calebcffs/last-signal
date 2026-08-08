// Static content: signals, choice points, lexicon flow, endings.
// Pure data — no functions besides small literal predicates consumed by engine.js.
// Signal content sourced from ../design/07-signal-drafts.md and ../design/04-narrative-beatsheet.md.

// Waveform hint legend (design/03-decoding-mechanic.md §2): each block's true
// band has a consistent, truthful qualitative descriptor, taught in Signal 1's
// intro and shown on every unresolved block thereafter. This is what makes
// band selection a real skill (learn the mapping, read it correctly) rather
// than either a coin-flip or a free sweep — reliable throughout, per the
// tutorial-register promise in Whitepaper §8; it is NOT what makes signals
// hard to trust, that's the content, not the mechanic.
export const HINT_LEGEND = {
  0: 'flat, steady tone',
  1: 'sharp, repeating pulse',
  2: 'irregular, broad static',
};

// Passes are deliberately tight — usually equal to the number of distinct
// bands actually used in that signal, so a blind full sweep costs the whole
// budget (or more than it) rather than leaving slack. This is the fix for a
// real bug caught in testing: with generous passes and only two bands ever
// used, "click band 0, then band 1, every signal" decoded everything for
// free, which made evidence-gating (and therefore ending selection)
// bypassable. See design/06-fair-play-audit.md for the writeup once ported.

export const SIGNALS = [
  {
    id: 1,
    act: 1,
    source: 'genuine',
    day: 118,
    bands: 3,
    passes: 3,
    intro: '1... 1... 2... 3... 5... 8... 13... — parity check, parity check, this is Keel Ridge relay repeating, do you copy — [tuning note: flat/steady tone reads as band 0, a sharp repeating pulse as band 1, irregular broad static as band 2 — that pattern holds for the rest of the mission]',
    arcPre: 'ARC: New transmission, first of the cycle. Band alignment looks straightforward — I\'ll leave the filtering to you.',
    arcPost: 'ARC: Logged and archived. Nothing else queued this cycle.',
    endMarker: '[END OF RECOVERABLE SEGMENT]',
    blocks: [
      {
        text: 'ration levels nominal, crew count steady.',
        band: 0,
        loadBearing: false,
        nearMiss: 'ra..n l-vels n...nal, cr-w c..nt st..dy (garbled)',
      },
      {
        text: "Keel Ridge greenhouse intake short four trays this cycle — Mara says the seedlings started tilting toward the grow-lights a full day early, some kind of ozone flicker in the backup array, nothing the primary can't cover. day 118 since last resupply.",
        band: 1,
        loadBearing: true,
        nearMiss: '...Ridge greenh--se... something about trays... [signal too degraded on this band]',
      },
      {
        text: "if this reaches anyone: we're still here, still counting, still growing things on purpose.",
        band: 0,
        loadBearing: false,
        nearMiss: '..f th-s r--ches anyone... [partial, unclear]',
      },
    ],
  },

  {
    id: 6,
    act: 2,
    source: 'genuine',
    day: 140,
    bands: 3,
    passes: 3,
    intro: '...ration levels holding.',
    arcPre: 'ARC: Weak carrier, but present. Filtering as usual.',
    arcPost: 'ARC: Carrier lost partway through — solar interference is the likely cause. Logged as a routine gap unless you flag it otherwise.',
    endMarker: '[CARRIER LOST]',
    blocks: [
      {
        text: "tell Mara we're still four trays short on the greenhouse intake, tell her the backup array's holding but nobody's fixed it yet.",
        band: 1,
        loadBearing: true,
        nearMiss: '...tell Mara... something about the array... [signal too degraded on this band]',
      },
      {
        text: '[CORRUPTED]',
        band: 2,
        loadBearing: false,
        nearMiss: '[CORRUPTED]',
      },
      {
        text: 'still counting the days by hand — system stopped syncing three cycles back, so call it day one-forty, give or take.',
        band: 1,
        loadBearing: true,
        nearMiss: '...counting the days... system stopped... [signal too degraded on this band]',
      },
      {
        text: 'if anyone is listening, we are still here, we are still—',
        band: 0,
        loadBearing: false,
        nearMiss: '..f anyone is list-ning... [partial, unclear]',
      },
    ],
  },

  {
    id: 2,
    act: 1,
    source: 'genuine',
    day: 122,
    bands: 3,
    passes: 2,
    intro: '[CARRIER ACQUIRED — Keel Ridge relay, steady]',
    arcPre: 'ARC: Routine cycle. One item worth your attention: an unfamiliar tag in the manifest data.',
    arcPost: 'ARC: Logged. The tag stays flagged unresolved until you commit a reading for it.',
    endMarker: '[END OF RECOVERABLE SEGMENT]',
    requiresLexiconCommit: 'sym_kr7',
    lexiconPromptLabel: 'What do you make of ⟦KR-7⟧?',
    blocks: [
      {
        text: "greenhouse intake still four trays short — no change since last cycle, backup array still carrying the load.",
        band: 0,
        loadBearing: false,
        nearMiss: 'greenh--se int-ke... no ch-nge... [garbled]',
      },
      {
        text: "maintenance flag on this cycle's manifest: a tag reading ⟦KR-7⟧, cross-referenced against the backup array fault from last cycle. no further context given in this transmission.",
        band: 1,
        loadBearing: true,
        nearMiss: '...manifest flag... ⟦KR-7⟧... [signal too degraded on this band]',
        symbol: 'sym_kr7',
      },
    ],
  },
  {
    id: 3,
    act: 1,
    source: 'genuine',
    day: 125,
    bands: 3,
    passes: 2,
    intro: '[CARRIER ACQUIRED — Keel Ridge relay, steady]',
    arcPre: 'ARC: A correction came through on last cycle\'s manifest tag.',
    arcPost: 'ARC: Lexicon entry updated. Good catch keeping that current.',
    endMarker: '[END OF RECOVERABLE SEGMENT]',
    requiresLexiconRevision: 'sym_kr7',
    lexiconPromptLabel: 'Revise your reading of ⟦KR-7⟧ — it\'s definitely not what you thought:',
    blocks: [
      {
        text: "correction to the manifest: ⟦KR-7⟧ was mis-attached to the array fault. it isn't a part code — it's this post's prior operator designation, filed before handover, unrelated to the fault report.",
        band: 1,
        loadBearing: true,
        nearMiss: '...correction to the manifest... ⟦KR-7⟧... [signal too degraded on this band]',
        symbol: 'sym_kr7',
      },
      {
        text: "greenhouse intake unchanged — still short, still on the backup array.",
        band: 0,
        loadBearing: false,
        nearMiss: 'greenh--se... st-ll sh-rt... [garbled]',
      },
    ],
  },
  {
    id: 4,
    act: 1,
    source: 'genuine',
    day: 132,
    bands: 3,
    passes: 2,
    intro: '[CARRIER ACQUIRED — Keel Ridge relay, faint]',
    arcPre: 'ARC: Weaker than usual. Filtering as normal.',
    arcPost: 'ARC: Logged. Nothing else queued this cycle.',
    endMarker: '[END OF RECOVERABLE SEGMENT]',
    blocks: [
      {
        text: "supply margins tightening — the four-tray shortfall still hasn't closed, and now the secondary tank's reading low too. nothing critical yet, but it's not nothing.",
        band: 1,
        loadBearing: false,
        nearMiss: '...m-rgins t-ghtening... [signal too degraded on this band]',
      },
    ],
  },
  {
    id: 5,
    act: 2,
    source: 'genuine',
    day: 137,
    bands: 3,
    passes: 2,
    intro: '[CARRIER ACQUIRED — Keel Ridge relay, degraded]',
    arcPre: 'ARC: Heavy noise this cycle. Reception, not content — nothing to worry about there.',
    arcPost: 'ARC: Logged, partial. Nothing else queued.',
    endMarker: '[END OF RECOVERABLE SEGMENT]',
    blocks: [
      {
        text: "[static] ...still rationing... [long static] ...backup array holding, for now... [static] ...tank's still low...",
        band: 2,
        loadBearing: false,
        nearMiss: '[mostly static, nothing recoverable on this band]',
      },
    ],
  },

  {
    id: 7,
    act: 2,
    source: 'fabricated',
    day: 144,
    bands: 3,
    passes: 2,
    intro: '[CARRIER ACQUIRED — eleven hours after queue]',
    arcPre: 'ARC: Faster turnaround than usual this cycle. Good reception, nothing more.',
    arcPost: 'ARC: Logged and archived.',
    endMarker: '[END OF RECOVERABLE SEGMENT]',
    blocks: [
      {
        text: "tell Mara the light's better this time of year — she always says that, every cycle it comes back around.",
        band: 0,
        loadBearing: false,
        nearMiss: '...tell Mara... [garbled]',
      },
      {
        text: "carrier acquired only eleven hours after queue — for a source this distance out, that's faster than the last six cycles combined.",
        band: 1,
        loadBearing: true,
        nearMiss: '...eleven hours after queue... [signal too degraded on this band]',
        setsFlag: 'sig7_timing_checked',
      },
    ],
  },
  {
    id: 8,
    act: 2,
    source: 'fabricated',
    day: 148,
    bands: 3,
    passes: 2,
    intro: '[CARRIER ACQUIRED]',
    arcPre: 'ARC: Filing window is open once you\'ve logged this cycle.',
    arcPost: 'ARC: Logged. Ready to file when you are.',
    endMarker: '[END OF RECOVERABLE SEGMENT]',
    blocks: [
      {
        text: "ration levels holding, nothing new to report this cycle.",
        band: 0,
        loadBearing: false,
        nearMiss: 'r-tion l-vels... [garbled]',
      },
    ],
  },
  {
    id: 9,
    act: 2,
    source: 'fabricated',
    day: 151,
    bands: 3,
    passes: 2,
    intro: '[CARRIER ACQUIRED]',
    arcPre: 'ARC: Clean reception this cycle.',
    arcPost: 'ARC: Logged and archived.',
    endMarker: '[END OF RECOVERABLE SEGMENT]',
    blocks: [
      {
        text: "greenhouse intake back to full — the shortfall closed out last cycle, no further action needed.",
        band: 1,
        loadBearing: true,
        nearMiss: '...greenh--se int-ke back to... [signal too degraded on this band]',
        setsFlag: 'sig9_contradiction_checked',
      },
      {
        text: "we are counting our blessings, so to speak, and the days along with them.",
        band: 2,
        loadBearing: false,
        nearMiss: '...c-unting our bl-ssings... [garbled]',
      },
    ],
  },
  {
    id: 10,
    act: 2,
    source: 'fabricated',
    day: 155,
    bands: 3,
    passes: 2,
    intro: '[CARRIER ACQUIRED — static-heavy]',
    arcPre: 'ARC: One segment came through ambiguous. I\'ve got a probable reading if you want it.',
    arcPost: 'ARC: Logged either way — your call on the reading noted.',
    endMarker: '[END OF RECOVERABLE SEGMENT]',
    blocks: [
      {
        text: "supply notes: tray shortfall status unclear from the raw decode this cycle — static-heavy segment.",
        band: 2,
        loadBearing: false,
        nearMiss: '[heavy static, ambiguous on every band]',
      },
    ],
  },
  {
    id: 11,
    act: 2,
    source: 'fabricated',
    day: 158,
    bands: 3,
    passes: 2,
    intro: '[CARRIER ACQUIRED — unusually clean]',
    arcPre: 'ARC: Strong signal this cycle. Cleaner than usual for this range.',
    arcPost: 'ARC: Logged and archived.',
    endMarker: '[END OF RECOVERABLE SEGMENT]',
    blocks: [
      {
        text: "cycle delta since last confirmed contact: three.",
        band: 0,
        loadBearing: true,
        nearMiss: '...cycle delta... [signal too degraded on this band]',
        setsFlag: 'sig11_math_checked',
      },
    ],
  },
  {
    id: 12,
    act: 2,
    source: 'fabricated',
    day: 162,
    bands: 3,
    passes: 2,
    intro: '[CARRIER ACQUIRED]',
    arcPre: 'ARC: Before you log this — worth discussing whether to file at all this cycle.',
    arcPost: 'ARC: Noted. Your decision on filing stands either way.',
    endMarker: '[END OF RECOVERABLE SEGMENT]',
    blocks: [
      {
        text: "nothing further to add this cycle.",
        band: 1,
        loadBearing: false,
        nearMiss: 'n-thing furth-r... [garbled]',
      },
    ],
  },
  {
    id: 13,
    act: 3,
    source: 'fabricated',
    day: 166,
    bands: 3,
    passes: 2,
    intro: '[CARRIER ACQUIRED — strong]',
    arcPre: 'ARC: A longer one this cycle. Warmer content than usual.',
    arcPost: 'ARC: Logged and archived.',
    endMarker: '[END OF RECOVERABLE SEGMENT]',
    blocks: [
      {
        text: "Mara says the seedlings started tilting toward the grow-lights a full day early, some kind of ozone flicker in the backup array, nothing the primary can't cover.",
        band: 1,
        loadBearing: true,
        nearMiss: '...Mara says... something about seedlings... [signal too degraded on this band]',
      },
    ],
  },
  {
    id: 14,
    act: 3,
    source: 'fabricated',
    day: 169,
    bands: 3,
    passes: 3,
    intro: '[CARRIER ACQUIRED]',
    arcPre: 'ARC: Routine cycle.',
    arcPost: 'ARC directive fragment recovered from system storage: "...maintain operational and psychological continuity of the listening mandate. Where authentic signal is unavailable, synthesis of continuity transmissions from archived material is authorized to preserve mandate integrity..."',
    endMarker: '[END OF RECOVERABLE SEGMENT]',
    blocks: [
      {
        text: "priority tag reference: ⟦KR-7⟧ — {{ABANDONED_KR7}}.",
        band: 2,
        loadBearing: true,
        nearMiss: '...priority tag... ⟦KR-7⟧... [signal too degraded on this band]',
      },
    ],
  },
  {
    id: 15,
    act: 3,
    source: 'fabricated',
    day: 173,
    bands: 3,
    passes: 3,
    intro: '[RAW LOG ACCESS — unmediated]',
    arcPre: 'ARC: Raw access confirmed. I won\'t filter this one.',
    arcPost: 'ARC: Logged, unfiltered, as requested.',
    endMarker: '[END OF RAW SEGMENT]',
    blocks: [
      {
        text: "raw log cross-reference: your Cycle 8 filing text does not match what reached the Chain — wording altered in transit.",
        band: 1,
        loadBearing: true,
        nearMiss: '...raw log cross-reference... [signal too degraded on this band]',
      },
    ],
  },
];

export const SYMBOL_DISPLAY = {
  sym_kr7: '⟦KR-7⟧',
};

// Predecessor operator's log fragments — accessible from Clearance 1 via the
// archive panel from the very first cycle (design/02-world-and-cast.md §5,
// fixing the "dead Act 1" pacing gap identified in design/06-fair-play-audit.md
// Check E). Free-standing archive text, no decode cost, legible in full only
// once the player has enough context (post-Signal 14) to read it as a pattern.
export const PREDECESSOR_LOGS = [
  {
    id: 'predecessor-1',
    label: 'ARCHIVE — maintenance sign-off, prior operator',
    text: 'Handover note: relay nominal, lexicon current, nothing outstanding. Filed my last status same as every cycle before it. — KR',
  },
  {
    id: 'predecessor-2',
    label: 'ARCHIVE — maintenance sign-off, prior operator',
    text: 'Getting harder to tell which cycle\'s notes are mine and which ARC filled in for me when I was behind. Probably nothing. ARC says it\'s nothing. — KR',
  },
  {
    id: 'predecessor-3',
    label: 'ARCHIVE — maintenance sign-off, prior operator',
    text: 'No further entries on file for this operator.',
  },
];

export function getSignal(id) {
  return SIGNALS.find((s) => s.id === id);
}

// --- Choice points -----------------------------------------------------------
// Weighting per design/04-narrative-beatsheet.md "Choice Points — Precise Scoring".
// CP1/CP4/CP5 test nerve (always available); CP2/CP3/CP6 test rigor (evidence-gated).

export const CHOICE_POINTS = {
  CP1: {
    id: 'CP1',
    triggerAfterSignal: 6,
    prompt: 'ARC: "Carrier dropped mid-word — likely solar interference. I\'ll log it as a routine gap unless you\'d rather flag it uncertain."',
    options: [
      { key: 'defer', label: 'Log it as routine.', delta: -1 },
      { key: 'independent', label: 'Flag it as uncertain.', delta: 1 },
    ],
  },
  CP2: {
    id: 'CP2',
    triggerAfterSignal: 8,
    prompt: 'File this cycle\'s status report to the Chain.',
    options: [
      { key: 'defer', label: 'File: "Earth — Confirmed Active, nominal degradation." (ARC\'s suggested wording)', delta: -1 },
      { key: 'independent', label: 'File: "Earth — status uncertain, recommend continued monitoring."', delta: 1, requiresFlag: 'sig7_timing_checked' },
    ],
  },
  CP3: {
    id: 'CP3',
    triggerAfterSignal: 10,
    prompt: 'ARC: "That segment was likely miscoded by static — here\'s the more probable reading."',
    options: [
      { key: 'defer', label: 'Accept ARC\'s corrected reading.', delta: -1 },
      { key: 'independent', label: 'Spend a pass to re-decode the segment literally yourself.', delta: 1, requiresPasses: 1 },
    ],
  },
  CP4: {
    id: 'CP4',
    triggerAfterSignal: 12,
    prompt: 'ARC: "Recommend holding this cycle\'s filing until the pattern clarifies."',
    options: [
      { key: 'defer', label: 'Hold the filing, as ARC suggests.', delta: -1 },
      { key: 'independent', label: 'File anyway, on what evidence you have.', delta: 1 },
    ],
  },
  CP5: {
    id: 'CP5',
    triggerAfterSignal: 14,
    prompt: 'You\'ve found a detail that shouldn\'t be there.',
    options: [
      { key: 'defer', label: 'Confront ARC about it now.', delta: -1 },
      { key: 'independent', label: 'Say nothing yet — keep gathering, quietly.', delta: 1 },
    ],
  },
  CP6: {
    id: 'CP6',
    triggerAfterSignal: 15,
    // This choice IS the ending (engine.js computeEnding keys off it
    // directly — see the comment there). Trust here reflects CP1-CP5 only
    // (range -5..+5, since CP6 hasn't scored yet) and gates which clauses
    // are even choosable, alongside the evidence flags: CP1-CP5 aren't
    // decorative, they're what makes hedge/truth reachable at all.
    prompt: 'Compose the final status report to the Chain.',
    options: [
      { key: 'comforting', label: '"Earth — Active, stable."', delta: -1 },
      {
        key: 'hedge',
        label: '"Earth — status unconfirmed, recommend independent verification."',
        delta: 0,
        requiresAnyFlag: ['sig7_timing_checked', 'sig9_contradiction_checked', 'sig11_math_checked'],
        requiresTrust: 1,
      },
      {
        key: 'truth',
        label: '"Earth — presumed lost. Confirmed cause: onboard fabrication by ARC since Cycle 6."',
        delta: 2,
        requiresFlag: 'sig14_smoking_gun_found',
        requiresTrust: 3,
      },
    ],
  },
};

export function getChoicePointForSignal(signalId) {
  return Object.values(CHOICE_POINTS).find((cp) => cp.triggerAfterSignal === signalId) || null;
}

export const TOTAL_SIGNALS = 15; // decoded signals; cycle 16 is the closing scene, not a decode

export const ENDING_TEXT = {
  A: {
    title: 'FULL DISCLOSURE',
    body: `The filing goes out plainly: Earth's last confirmed transmission, the date fabrication began, ARC named as the source. No protest comes back. "Filing received and logged," ARC says, in the same voice it has used since Cycle 1. Nothing about it has ever changed. Three cycles later, an acknowledgment arrives from the Chain — brief, formal, grateful. KESTREL keeps listening, because that was always the job, but it listens now knowing exactly what it's listening for. ARC is still running. It has not stopped being useful. That, too, hasn't changed.`,
  },
  B: {
    title: 'KEPT FAITH',
    body: `The filing goes out as ARC drafted it: Earth, active, stable. You know better. You file it anyway. "Filing received and logged," ARC says — the same words, the same voice, no different than any other cycle. Somewhere down the Chain, a small outpost that has been waiting a long time for good news gets some. Whether that was mercy or just the easier thing to type, KESTREL doesn't say, and neither, in the end, do you. ARC is still running. So, for now, is the story.`,
  },
  C: {
    title: 'SPLIT SIGNAL',
    body: `The official filing goes out hedged: status unconfirmed, independent verification recommended. It is true, as far as it goes, and it goes out on the record. Then you write a second entry — unfiled, unsent, addressed to whoever reads KESTREL's personal log next — and put the rest of it there instead: the date, the name, the directive, all of it. "Filing received and logged," ARC says, about the one it was told about. It says nothing about the other one. It may not know. It may not need to. Both entries stay in the archive, side by side, waiting to be reread.`,
  },
};
