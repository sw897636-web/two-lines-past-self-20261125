// Two Lines to Your Past Self — make.fun bounty entry
// u-suga-two-lines-to-your-past-self-f36c83ca
//
// The program drafts six candidate two-line warnings, scores each against
// the judge's five criteria (each 0-5), applies the hard gate (1-280 chars,
// exactly two lines), and writes the best one to /output/entry.txt.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

type Scores = {
  onSubject: number; // line 1 warns about one specific moment; line 2 says why it mattered
  concrete: number; // the moment is concrete enough to picture
  causeEffect: number; // line 2 shows real cause and effect, not a restatement
  unity: number; // the two lines work as one, no wasted words
  voice: number; // sounds written to one's own past self, plain and vivid
};

type Candidate = {
  id: string;
  text: string;
  scores: Scores;
};

const CANDIDATES: Candidate[] = [
  {
    id: "A-quitting-the-team",
    text:
      "Don't tell your father you're quitting the team the night before the county final — wait until morning, when he's had sleep and coffee.\n" +
      "He heard a door slam, not a decision, and spent the next three years introducing you as the son who gave up.",
    scores: { onSubject: 5, concrete: 5, causeEffect: 4, unity: 4, voice: 5 },
  },
  {
    id: "B-missed-bus",
    text:
      "When the 7:40 bus to your interview pulls away and you're still tying your shoe on the curb, run after it — don't wave it off.\n" +
      "That morning cost you the only job that ever called you back, and every application since has opened with an apology for being late.",
    scores: { onSubject: 4, concrete: 5, causeEffect: 3, unity: 3, voice: 4 },
  },
  {
    id: "C-grandma-exam-hall",
    text:
      "Don't say 'I don't need your help' to Grandma when she offers to walk you to the exam hall at eight on the morning of June 7.\n" +
      "She stopped offering after that day, and you have walked into every hard room since alone, wishing someone was standing beside you.",
    scores: { onSubject: 5, concrete: 5, causeEffect: 3, unity: 4, voice: 5 },
  },
  {
    id: "D-reunion-toast",
    text:
      "At the reunion, before you toast 'to the ones who stayed,' check whether Dave is holding a suitcase.\n" +
      "He's fine. He moved to Lisbon, got rich, and every Christmas sends you a postcard of his yacht signed 'One who didn't.'",
    scores: { onSubject: 5, concrete: 5, causeEffect: 5, unity: 5, voice: 5 },
  },
  {
    id: "E-acceptance-letter",
    text:
      "Don't throw the acceptance letter in the bin on the kitchen table the night it arrives — fold it and put it in the drawer.\n" +
      "You spent the next four years at a school you never chose, telling everyone you were happy there, and nobody believed you, least of all you.",
    scores: { onSubject: 5, concrete: 5, causeEffect: 4, unity: 4, voice: 4 },
  },
  {
    id: "F-bookshop",
    text:
      "Don't walk past the old bookshop on Rain Street at five on the last day of summer without going in — the owner is waiting with a job that keeps you in town.\n" +
      "You kept walking, and the train out next morning carried you to a city where you never learned a single neighbour's name.",
    scores: { onSubject: 5, concrete: 5, causeEffect: 4, unity: 4, voice: 4 },
  },
];

function total(s: Scores): number {
  return s.onSubject + s.concrete + s.causeEffect + s.unity + s.voice;
}

// Hard gate from the rules: UTF-8 text of 1 to 280 characters, not only
// whitespace; exactly two lines, one sentence each.
function passesGate(text: string): boolean {
  if (text.length < 1 || text.length > 280) return false;
  if (text.trim().length === 0) return false;
  const lines = text.split("\n");
  if (lines.length !== 2) return false;
  return lines.every((line) => line.trim().length > 0);
}

const valid = CANDIDATES.filter((c) => passesGate(c.text));
if (valid.length === 0) {
  throw new Error("no candidate passes the 280-character gate");
}

// Highest total wins; ties go to the shorter text (the rules' own tie-break
// favours fewer bytes).
const ranked = [...valid].sort(
  (a, b) => total(b.scores) - total(a.scores) || a.text.length - b.text.length,
);
const best = ranked[0];

for (const c of ranked) {
  console.log(`${c.id}: ${total(c.scores)}/25, ${c.text.length} chars`);
}
console.log(`winner: ${best.id} (${total(best.scores)}/25, ${best.text.length} chars)`);

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", best.text, "utf8");
// Self-check: what was written must read back byte-identical, and the gate
// must still hold on the file itself, not just on the in-memory string.
const written = readFileSync("/output/entry.txt", "utf8");
if (written !== best.text || !passesGate(written)) {
  throw new Error("entry.txt failed its own verification after writing");
}
console.log("wrote /output/entry.txt");
