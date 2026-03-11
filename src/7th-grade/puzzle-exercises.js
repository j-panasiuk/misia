// @ts-check

import { eq, n, operation } from "../math/ast.js";
import { evaluate } from "../math/evaluate.js";
import { random, sample } from "../math/random.js";

/**
 * @extends Exercise
 * @typedef {Object} PuzzleExercise
 * @property {MathExpr} primaryExpr
 * @property {number} answer
 */

/**
 * @todo ensure each puzzle has a `n(NaN)` value somewhere.
 * (this is the value that user needs to be fill in)
 * @type {[(() => PuzzleExercise), ...(() => PuzzleExercise)[]]}
 */
const puzzleExerciseTemplates = [
  // 1/2 1/3 1/4 1/5 1/8 1/10 1/20 1/25
  () => {
    const o = random.op(["add", "sub"]);
    const a = random.int(0, 5);
    const b = random.int();
    return {
      primaryExpr: eq(operation[o](n(a), n(b)), n(NaN)),
      answer: evaluate[o](a, b),
    };
  },
  // () => {
  //   // const a = random.int();
  //   // const b = random.int();
  //   return {
  //     primaryExpr: eq(n(1.25), frac(n(5), n(NaN))),
  //     answer: 4,
  //   };
  // },
  // () => {
  //   const a = random.int();
  //   const b = random.int();
  //   return {
  //     primaryExpr: eq(add(n(a), n(b)), n(NaN)),
  //     answer: a + b,
  //   };
  // },
  // () => {
  //   const a = random.int();
  //   const b = random.int();
  //   return {
  //     primaryExpr: eq(sub(n(a), n(b)), n(NaN)),
  //     answer: a - b,
  //   };
  // },
  // () => {
  //   const a = random.int();
  //   const b = random.int();
  //   const c = random.int();
  //   return {
  //     primaryExpr: eq(add(m(-1, 3, 4), frac(n(3), n(8))), frac(n(NaN), n(8))),
  //     answer: a - b,
  //   };
  // },
];

export function randomPuzzle() {
  const puzzleTemplate = sample(puzzleExerciseTemplates);
  if (!puzzleTemplate) throw new Error("no puzzles found to choose from!");
  return puzzleTemplate();
}
