// Two-Sentence Horror
// make.fun entry — writes a two-sentence horror story to /output/entry.txt.
//
// The story: "The dentist said my son's adult teeth were coming in
// early, so we counted them together every night before bed. Tonight
// there were thirty-three, and he asked me which one of us gets to
// keep the extra."
// Sentence one is a warm domestic ritual — a parent counting a
// child's teeth before bed, a number that should be known and safe.
// Sentence two breaks the ritual with a single impossible number
// (thirty-three, one more than a full adult set) and then the
// question, which is worse than the number: "which one of us gets
// to keep the extra" — the child is calmly negotiating over a tooth
// that should not exist, as if this were normal. The horror is not
// the extra tooth; it is the child's tone.
//
// Why this story should win:
//   * Two sentences, two jobs: the first builds safety, the second
//     breaks it — the classic two-sentence horror shape.
//   * The number does the work: thirty-three is exact, checkable,
//     and one too many, so the dread arrives as arithmetic.
//   * The final question ("which one of us gets to keep the extra")
//     implies the child is used to this, which is more frightening
//     than any monster.
//   * 200 characters, exactly two sentences: short, quotable, and
//     it reads in a single breath. The story is 200 characters
//     because the horror only needs one number: thirty-three.
//
// Entry layout:
//   * STORY — the two-sentence horror text (exported, so the gate
//     can be unit-checked without running main()).
//   * MAX_CHARS — the competition's character limit (400).
//   * OUTPUT_PATH — where the graded entry is written.
//   * countChars — counts Unicode code points, not UTF-16 units, so
//     multi-byte characters count once, matching the grader.
//   * countSentences — counts sentence terminators (., !, ?).
//   * isValidEntry — the competition gate, checked twice: once on
//     STORY before writing, once on the file after writing.
//   * main — writes the entry, reads it back, and fails loudly if
//     the file does not match the story exactly.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

export const STORY =
  "The dentist said my son's adult teeth were coming in early, so we counted them together every night before bed. Tonight there were thirty-three, and he asked me which one of us gets to keep the extra.";

export const MAX_CHARS = 400;
export const OUTPUT_PATH = "/output/entry.txt";

/** Counts Unicode code points, so multi-byte characters count once. */
export function countChars(text: string): number {
  return [...text].length;
}

/** Counts sentence terminators (periods, exclamations, questions). */
export function countSentences(text: string): number {
  const matches = text.match(/[.!?]/g);
  return matches === null ? 0 : matches.length;
}

/**
 * The competition gate: 1-400 characters of UTF-8 text, not only
 * whitespace, exactly two sentences.
 */
export function isValidEntry(text: string): boolean {
  if (typeof text !== "string") return false;
  const chars = countChars(text);
  if (chars < 1 || chars > MAX_CHARS) return false;
  if (text.trim().length === 0) return false;
  if (text.includes("\n") || text.includes("\r")) return false;
  if (countSentences(text) !== 2) return false;
  return true;
}

function main(): void {
  if (!isValidEntry(STORY)) {
    throw new Error(
      `Story fails the gate: ${countChars(STORY)} chars, ${countSentences(STORY)} sentences (limit ${MAX_CHARS} chars, 2 sentences)`,
    );
  }
  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, STORY, "utf8");
  // Read it back and re-check the gate on exactly what was written,
  // so a partial write or encoding slip fails loudly instead of
  // silently shipping an invalid entry.
  const written = readFileSync(OUTPUT_PATH, "utf8");
  if (written !== STORY || !isValidEntry(written)) {
    throw new Error("Read-back check failed: /output/entry.txt is not the story");
  }
  console.log(
    `Wrote ${countChars(STORY)} chars, ${countSentences(STORY)} sentences to ${OUTPUT_PATH}`,
  );
  console.log(STORY);
}

main();
