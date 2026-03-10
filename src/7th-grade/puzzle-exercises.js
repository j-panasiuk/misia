// @ts-check

import { add, div, eq, frac, m, mul, n, pow, sub } from "../math-expr-utils.js";

/**
 * @extends Exercise
 * @typedef {Object} PuzzleExercise
 * @property {MathExpr} primaryExpr
 * @property {number|string} answer
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

// -- HELPERS --

/**
 * @type {Record<BinaryOp, (a: MathExpr, b: MathExpr) => MathExpr>}
 */
const operation = {
  add,
  sub,
  mul,
  div,
  pow,
};

/**
 * @type {Record<BinaryOp, (a: number, b: number) => number>}
 */
const evaluate = {
  add: (a, b) => a + b,
  sub: (a, b) => a - b,
  mul: (a, b) => a * b,
  div: (a, b) => a / b,
  pow: (a, b) => a ** b,
};

const random = {
  sample,
  int(min = 0, max = 10) {
    return min + Math.floor(Math.random() * (max - min));
  },
  prime() {
    return sample([2, 3, 5, 7, 11, 13, 17, 19]);
  },
  op(/** @type {[BinaryOp, ...BinaryOp[]]} */ ops) {
    return sample(
      /** @type {[BinaryOp]} */ (
        Object.keys(evaluate).filter((op) =>
          ops.includes(/** @type {BinaryOp} */ (op)),
        )
      ),
    );
  },
};

/**
 * Picks a random element from a non-empty array.
 *
 * @template T - The type of elements in the array
 * @param {[T, ...T[]]} values - A non-empty array to sample from
 * @returns {T} A randomly selected element from the array
 * @throws {Error} If the array is empty
 *
 * @example
 * const numbers = [1, 2, 3, 4, 5];
 * const randomNum = sample(numbers);
 *
 * @example
 * const fruits = ['apple', 'banana', 'orange'];
 * const randomFruit = sample(fruits);
 */
function sample(values) {
  if (values.length === 0) {
    throw new Error("Cannot sample from an empty array");
  }
  const index = Math.floor(Math.random() * values.length);
  return /** @type {T} */ (values[index]);
}
