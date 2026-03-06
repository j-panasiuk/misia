// @ts-check

import { add, eq, frac, m, n, sub } from "../math-expr-utils";

/**
 * @extends Exercise
 * @typedef {Object} PuzzleExercise
 * @property {[]} instruction
 * @property {MathExpr} primaryExpr
 * @property {number|string} answer
 */

/**
 * @todo ensure each puzzle has a `n(NaN)` value somewhere.
 * (this is the value that user needs to be fill in)
 * @satisfies {(() => PuzzleExercise)[]}
 */
const puzzles = [
  () => {
    const a = Math.ceil(20 * Math.random());
    const b = Math.ceil(15 * Math.random());
    return {
      instruction: [],
      primaryExpr: eq(add(n(a), n(b)), n(NaN)),
      answer: a + b,
    };
  },
  () => {
    const a = Math.ceil(20 * Math.random());
    const b = Math.ceil(15 * Math.random());
    return {
      instruction: [],
      primaryExpr: eq(sub(n(a), n(b)), n(NaN)),
      answer: a - b,
    };
  },
  () => {
    const a = Math.ceil(20 * Math.random());
    const b = Math.ceil(15 * Math.random());
    const c = Math.ceil(15 * Math.random());
    return {
      instruction: [],
      primaryExpr: eq(add(m(-1, 3, 4), frac(n(3), n(8))), frac(n(NaN), n(8))),
      answer: a - b,
    };
  },
];

export function randomPuzzle() {
  const puzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
  if (!puzzle) throw new Error("no puzzles found to choose from!");
  return puzzle();
}
