// @ts-check

import { add, div, frac, m, mul, neg, n, pow, sub } from "../math-expr-utils";

// /** @typedef {import("../exercise").Exercise} Exercise */

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

// -- 7th GRADE EXERCISES --

/**
 * @todo localization
 * @type {Record<ExId, () => Exercise>}
 */
export const exercises = {
  "1a": () => {
    return {
      instruction: ["Oblicz"],
      primaryExpr: sub(n(4), frac(n(3), n(5))),
      answer: frac(n(17), n(5)),
    };
  },
  "1b": () => {
    return {
      instruction: ["Oblicz"],
      primaryExpr: add(m(-4, 4, 5), m(1, 2, 3)),
      answer: 4,
    };
  },
  "1c": () => {
    return {
      instruction: ["Oblicz"],
      primaryExpr: mul(m(2, 3, 4), sub(n(0.7), frac(n(1), n(2)))),
      answer: 4,
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
      answer: 4,
    };
  },
  "2a": () => {
    return {
      instruction: ["Oblicz"],
      primaryExpr: sub(n(4), frac(n(3), n(5))),
      answer: 4,
    };
  },
};

// @todo allow to select a subset of exercises (only "1a", "2a", "3a", etc)
// @todo allow to filter exercises by tags ("arithmetic", "algebra" etc)
export const progression = /** @type {[ExId, ...ExId[]]} */ (
  Object.keys(exercises).sort()
);
