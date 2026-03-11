// @ts-check

import { sub, n, frac, mul, add, m, neg, pow, div } from "../math/ast.js";

/**
 * @extends Exercise
 * @typedef {Object} ExamExercise
 * @property {ContentSegment[]} instruction
 * @property {MathExpr} primaryExpr
 * @property {MathExpr[]} steps
 * @property {string|MathExpr} answer
 */

// -- EXERCISE IDS --

/**
 * Exercise number followed by exercise letter
 * @typedef {`${number}${string}`} ExId
 * @example "5a", "12c"
 */

/**
 * Check if input matches exercise format ("5a" etc)
 * @param {unknown} val
 * @returns {val is ExId}
 */
export function isExerciseId(val) {
  return typeof val === "string" && /^[0-9]+[a-z]$/.test(val);
}

/**
 * Assert that input matches existing exercise id ("5a" etc)
 * @param {unknown} val
 * @returns {asserts val is keyof typeof examExerciseTemplates}
 */
export function assertValidExerciseId(val) {
  if (!isExerciseId(val)) {
    throw new Error(`bad exercise id format: ${val}`);
  }
  if (!(val in examExerciseTemplates)) {
    throw new Error(`unknown exercise id ${val}`);
  }
}

// -- 7th GRADE EXERCISES --

/**
 * @todo localization
 * @satisfies {Record<ExId, () => ExamExercise>}
 */
export const examExerciseTemplates = {
  "1a": () => {
    return {
      instruction: ["Oblicz"],
      primaryExpr: sub(n(4), frac(n(3), n(5))),
      steps: [
        sub(frac(mul(n(4), n(5)), n(5)), frac(n(3), n(5))),
        frac(sub(n(20), n(3)), n(5)),
      ],
      answer: frac(n(17), n(5)),
    };
  },
  "1b": () => {
    return {
      instruction: ["Oblicz"],
      primaryExpr: add(m(-4, 4, 5), m(1, 2, 3)),
      steps: [
        add(
          neg(frac(add(mul(n(4), n(5)), n(4)), n(5))),
          frac(add(mul(n(1), n(3)), n(2)), n(3)),
        ),
        add(neg(frac(n(24), n(5))), frac(n(5), n(3))),
        add(neg(frac(mul(n(24), n(3)), n(15))), frac(mul(n(5), n(5)), n(15))),
        frac(add(n(-72), n(25)), n(15)),
      ],
      // @todo show alternative answer formatting
      answer: frac(n(-47), n(15)), // m(n(-3), n(2), n(15))
    };
  },
  "1c": () => {
    return {
      instruction: ["Oblicz"],
      primaryExpr: mul(m(2, 3, 4), sub(n(0.7), frac(n(1), n(2)))),
      steps: [
        mul(
          frac(add(mul(n(2), n(4)), n(3)), n(4)),
          sub(frac(n(7), n(10)), frac(n(1), n(2))),
        ),
        mul(frac(n(11), n(4)), sub(frac(n(7), n(10)), frac(n(5), n(10)))),
        mul(frac(n(11), n(4)), frac(n(2), n(10))),
        mul(frac(n(11), n(4)), frac(n(1), n(5))),
      ],
      answer: frac(n(11), n(20)), // n(0.55)
    };
  },
  "1d": () => {
    return {
      instruction: ["Oblicz"],
      primaryExpr: frac(
        sub(
          mul(pow(neg(frac(n(1), n(4))), n(2)), n(6)),
          div(n(0.05), frac(n(1), n(20))),
        ),
        n(-3),
      ),
      steps: [
        frac(
          sub(
            mul(frac(n(1), n(16)), n(6)),
            div(frac(n(1), n(20)), frac(n(1), n(20))),
          ),
          n(-3),
        ),
        frac(
          sub(frac(n(6), n(16)), mul(frac(n(1), n(20)), frac(n(20), n(1)))),
          n(-3),
        ),
        frac(sub(frac(n(3), n(8)), n(1)), n(-3)),
        frac(neg(frac(n(5), n(8))), n(-3)),
      ],
      answer: frac(n(5), n(24)),
    };
  },
  "2a": () => {
    return {
      instruction: ["Oblicz jak najprostszym sposobem"],
      primaryExpr: sub(sub(add(n(7), n(12)), n(-8)), n(7)),
      steps: [add(n(12), n(8))],
      answer: n(20),
    };
  },
  "2b": () => {
    return {
      instruction: ["Oblicz jak najprostszym sposobem"],
      primaryExpr: add(
        add(
          add(add(n(0.4), frac(n(3), n(7))), neg(frac(n(2), n(5)))),
          neg(frac(n(3), n(7))),
        ),
        n(0.1),
      ),
      steps: [sub(n(0.5), frac(n(2), n(5))), sub(n(0.5), n(0.4))],
      answer: n(0.1),
    };
  },
  "2c": () => {
    return {
      instruction: ["Oblicz jak najprostszym sposobem"],
      primaryExpr: add(sub(sub(n(0.75), m(1, 1, 4)), frac(n(1), n(2))), n(3.5)),
      steps: [
        add(sub(sub(n(0.75), n(1.25)), n(0.5)), n(3.5)),
        add(n(-0.5), n(3)),
      ],
      answer: n(2.5),
    };
  },
  "3a": () => {
    return {
      instruction: ["Oblicz"],
      primaryExpr: mul(n(-3.45), n(8)),
      steps: [],
      answer: n(-27.6),
    };
  },
  "3b": () => {
    return {
      instruction: ["Oblicz"],
      primaryExpr: pow(n(-1.4), n(3)),
      steps: [mul(n(-1.4), mul(n(-1.4), n(-1.4)))],
      answer: n(-2.744),
    };
  },
  "3c": () => {
    return {
      instruction: ["Oblicz"],
      primaryExpr: mul(n(-0.3), pow(neg(frac(n(1), n(3))), n(2))),
      steps: [
        mul(n(-0.3), frac(n(1), n(9))), // Square: (-1/3)² = 1/9
        mul(neg(frac(n(3), n(10))), frac(n(1), n(9))),
        neg(mul(frac(n(1), n(10)), frac(n(1), n(3)))),
      ],
      answer: neg(frac(n(1), n(30))),
    };
  },
  "3d": () => {
    return {
      instruction: ["Oblicz"],
      primaryExpr: div(n(-5.6), n(-0.8)),
      steps: [div(n(5.6), n(0.8)), div(n(56), n(8))],
      answer: n(7),
    };
  },
  "4a": () => {
    return {
      instruction: ["Oblicz"],
      primaryExpr: sub(
        pow(frac(n(2), n(5)), n(2)),
        pow(neg(frac(n(2), n(5))), n(3)),
      ),
      steps: [
        sub(
          frac(n(4), n(25)), // (2/5)² = 4/25
          neg(frac(n(8), n(125))), // (-2/5)³ = -8/125 → subtracting negative = adding positive
        ),
        add(frac(n(4), n(25)), frac(n(8), n(125))),
      ],
      answer: frac(n(28), n(125)),
    };
  },
  "4b": () => {
    return {
      instruction: ["Oblicz"],
      primaryExpr: add(
        sub(pow(frac(n(3), n(7)), n(2)), frac(pow(n(3), n(2)), n(7))),
        frac(n(3), pow(n(7), n(2))),
      ),
      steps: [
        add(
          sub(
            frac(n(9), n(49)), // (3/7)² = 9/49
            frac(n(9), n(7)), // 3² / 7 = 9/7 → keep as fraction
          ),
          frac(n(3), n(49)), // 3 / 7² = 3/49
        ),
        add(
          sub(
            frac(n(9), n(49)),
            frac(n(63), n(49)), // 9/7 = 63/49
          ),
          frac(n(3), n(49)),
        ),
        add(
          frac(n(-54), n(49)), // 9/49 - 63/49 = -54/49
          frac(n(3), n(49)),
        ),
      ],
      answer: neg(frac(n(51), n(49))),
    };
  },
  "4c": () => {
    return {
      instruction: ["Oblicz"],
      primaryExpr: sub(
        mul(n(30), pow(n(-0.1), n(3))),
        mul(n(0.1), pow(n(30), n(3))),
      ),
      steps: [
        sub(
          mul(n(30), n(-0.001)), // (-0.1)³ = -0.001
          mul(n(0.1), n(27000)), // 30³ = 27000
        ),
        sub(n(-0.03), n(2700)),
      ],
      answer: n(-2700.03),
    };
  },
  "4d": () => {
    return {
      instruction: ["Oblicz"],
      primaryExpr: sub(
        mul(pow(n(10), n(2)), frac(n(1), n(10))),
        mul(pow(neg(frac(n(1), n(10))), n(0)), pow(n(-10), n(2))),
      ),
      steps: [
        sub(
          mul(n(100), frac(n(1), n(10))), // 10² = 100
          mul(n(1), n(100)), // (-1/10)⁰ = 1, (-10)² = 100
        ),
        sub(
          n(10), // 100 * 1/10 = 10
          n(100),
        ),
      ],
      answer: n(-90),
    };
  },
};

// @todo allow to select a subset of exercises (only "1a", "2a", "3a", etc)
// @todo allow to filter exercises by tags ("arithmetic", "algebra" etc)
export const exerciseProgression = /** @type {[ExId, ...ExId[]]} */ (
  Object.keys(examExerciseTemplates).sort()
);
