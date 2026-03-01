// @ts-check

import { frac, num, sub } from "../math-expr-utils";

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
 * @type {Record<ExId, Exercise>}
 */
export const exercises = {
  "1a": {
    instruction: ["Oblicz"],
    primaryExpr: sub(num(4), frac(num(3), num(5))),
    answer: 4,
  },
  "1b": {
    instruction: ["Oblicz"],
    primaryExpr: sub(num(4), frac(num(3), num(5))),
    answer: 4,
  },
  "2a": {
    instruction: ["Oblicz"],
    primaryExpr: sub(num(4), frac(num(3), num(5))),
    answer: 4,
  },
};

// @todo allow to filter by tags ("arithmetic", "algebra" etc)
export const progression = /** @type {[ExId, ...ExId[]]} */ (
  Object.keys(exercises).sort()
);
