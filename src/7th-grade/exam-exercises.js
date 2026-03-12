// @ts-check

import { sub, n, frac, mul, add, m, neg, pow, div } from "../math/ast.js";
import {
  decimalToFraction,
  fractionToDecimal,
  lcm,
  multiplyFractions,
  scaleFraction,
  sign,
  simplifyBeforeMultiplication,
  simplifyFraction,
  subtractFractions,
} from "../math/evaluate.js";
import { random, sample } from "../math/random.js";

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
 * @throws {Error}
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
    const a = random.int(2, 9);
    const c = random.prime();
    const b = random.int(1, c - 1);
    return {
      instruction: ["Oblicz"],
      primaryExpr: sub(a, frac(b, c)),
      steps: [sub(frac(mul(a, c), c), frac(b, c)), frac(sub(a * c, b), c)],
      // @todo show alternative answer formatting
      answer: frac(n(a * c - b), c),
    };
  },
  "1b": () => {
    const a1 = random.int(-8, -1);
    const a2 = random.prime();
    const a3 = a2 - 1;
    const b1 = random.int(1, 7);
    const b2 = random.prime(); // @todo b2 !== a2
    const b3 = random.int(1, b2 - 1);
    const A1 = Math.abs(a1);
    return {
      instruction: ["Oblicz"],
      primaryExpr: add(m(a1, a3, a2), m(b1, b3, b2)),
      steps: [
        add(
          neg(frac(add(mul(A1, a2), a3), a2)),
          frac(add(mul(b1, b2), b3), b2),
        ),
        add(neg(frac(A1 * a2 + a3, a2)), frac(b1 * b2 + b3, b2)),
        add(
          neg(frac(mul(A1 * a2 + a3, b2), mul(a2, b2))),
          frac(mul(a2, A1 * a2 + a3), mul(a2, b2)),
        ),
        frac(add(-(A1 * a2 + a3) * b2, (A1 * a2 + a3) * a2), a2 * b2),
      ],
      // @todo show alternative answer formatting
      answer: frac(-(A1 * a2 + a3) * b2 + (A1 * a2 + a3) * a2, a2 * b2),
    };
  },
  "1c": () => {
    const { a, b, c } =
      /** @type {{ a: [number, number, number], b: number, c: [number, number] }} */ (
        sample([
          { a: [2, 3, 4], b: 0.7, c: [1, 2] },
          { a: [1, 5, 6], b: 0.75, c: [1, 8] },
          { a: [3, 1, 3], b: 2.25, c: [11, 12] },
          { a: [4, 2, 7], b: 1.6, c: [2, 5] },
        ])
      );

    const B1 = decimalToFraction(b);
    const d = lcm(B1[1], c[1]);

    const A = /** @type {[number, number]} */ ([a[0] * a[2] + a[1], a[2]]);
    const B = scaleFraction(B1, d);
    const C = scaleFraction(c, d);
    const D = /** @type {[number, number]} */ ([B[0] - C[0], d]);

    let steps = [
      mul(frac(add(mul(a[0], a[2]), a[1]), a[2]), sub(frac(...B1), frac(...c))),
      mul(frac(...A), sub(frac(...B), frac(...C))),
      mul(frac(...A), frac(...D)),
    ];

    // Optional step - reduce terms before multiplication
    const [A1, D1] = simplifyBeforeMultiplication(A, D);
    if (A1[0] !== A[0] || D1[0] !== D[0]) {
      steps.push(mul(frac(...A1), frac(...D1)));
    }

    return {
      instruction: ["Oblicz"],
      primaryExpr: mul(m(...a), sub(b, frac(...c))),
      steps,
      answer: frac(...multiplyFractions(A1, D1)),
    };
  },
  "1d": () => {
    const { a, b, c, d } =
      /** @type {{ a: [number, number], b: number, c: [number, number], d: number }} */ (
        sample([
          { a: [1, 4], b: 6, c: [1, 20], d: -3 },
          { a: [1, 5], b: 10, c: [2, 25], d: -2 },
          { a: [1, 4], b: 8, c: [3, 100], d: 4 },
          { a: [5, 6], b: 9, c: [77, 100], d: -7 },
        ])
      );

    const A = /** @type {[number, number]} */ ([a[0] ** 2, a[1] ** 2]);
    const AB = multiplyFractions(A, [b, 1]);
    const C = fractionToDecimal(c);
    const CD = multiplyFractions(c, [c[1], 1]);
    const ABCD = subtractFractions(AB, CD);
    const X = simplifyFraction([Math.abs(ABCD[0]), Math.abs(ABCD[1] * d)]);

    return {
      instruction: ["Oblicz"],
      primaryExpr: frac(
        sub(mul(pow(neg(frac(...a)), 2), b), div(C, frac(1, c[1]))),
        d,
      ),
      steps: [
        frac(sub(mul(frac(...A), b), div(frac(...c), frac(1, c[1]))), d),
        frac(sub(frac(...AB), mul(frac(...c), frac(c[1], n(1)))), d),
        frac(sub(frac(...AB), frac(...CD)), d),
        frac(
          sign(ABCD) === -1
            ? neg(frac(Math.abs(ABCD[0]), Math.abs(ABCD[1])))
            : frac(Math.abs(ABCD[0]), Math.abs(ABCD[1])),
          d,
        ),
      ],
      answer: sign(ABCD) * Math.sign(d) === -1 ? neg(frac(...X)) : frac(...X),
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
