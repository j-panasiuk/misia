// @ts-check

import {
  add,
  div,
  frac,
  mixed,
  mul,
  neg,
  num,
  pow,
  sub,
} from "../math-expr-utils";

/** @typedef {import("../exercise").Exercise} Exercise */

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
      primaryExpr: sub(num(4), frac(num(3), num(5))),
      answer: frac(num(17), num(5)),
    };
  },
  "1b": () => {
    return {
      instruction: ["Oblicz"],
      primaryExpr: add(mixed(-4, 4, 5), mixed(1, 2, 3)),
      answer: 4,
    };
  },
  "1c": () => {
    return {
      instruction: ["Oblicz"],
      primaryExpr: mul(mixed(2, 3, 4), sub(num(0.7), frac(num(1), num(2)))),
      answer: 4,
    };
  },
  "1d": () => {
    return {
      instruction: ["Oblicz"],
      primaryExpr: frac(
        sub(
          mul(pow(neg(frac(num(1), num(4))), num(2)), num(6)),
          div(num(0.05), frac(num(1), num(20))),
        ),
        num(-3),
      ),
      answer: 4,
    };
  },
  "2a": () => {
    return {
      instruction: ["Oblicz"],
      primaryExpr: sub(num(4), frac(num(3), num(5))),
      answer: 4,
    };
  },
};

// @todo allow to filter by tags ("arithmetic", "algebra" etc)
export const progression = /** @type {[ExId, ...ExId[]]} */ (
  Object.keys(exercises).sort()
);
