// @ts-check

/** @typedef {import("./math-expr").MathExpr} Node */

/**
 * @typedef {Object} Exercise
 * @property {ContentSegment[]} instruction - Array of text and math segments forming the exercise instruction
 * @property {Node|null} [primaryExpr=null] - Optional: the main expression being worked with (for reference/display)
 * @property {number|string|Node} answer - The expected answer (numeric, symbolic, or expression)
 * @property {Object} [metadata] - Optional metadata (difficulty, topic, etc.)
 *
 * @example
 * // Simple: "Calculate 2 + 3"
 * {
 *   instruction: [
 *     { type: "text", content: "Calculate " },
 *     { type: "math", expr: { type: "add", left: { type: "num", value: 2 }, right: { type: "num", value: 3 } } }
 *   ],
 *   answer: 5
 * }
 *
 * @example
 * // Complex: "What algebraic sum do we need to add to x + 1 to receive 2x + 5?"
 * {
 *   instruction: [
 *     { type: "text", content: "What algebraic sum do we need to add to " },
 *     { type: "math", expr: { type: "add", left: { type: "var", name: "x" }, right: { type: "num", value: 1 } } },
 *     { type: "text", content: " to receive " },
 *     { type: "math", expr: { type: "add", left: { type: "mul", left: { type: "num", value: 2 }, right: { type: "var", name: "x" } }, right: { type: "num", value: 5 } } },
 *     { type: "text", content: "?" }
 *   ],
 *   answer: { type: "add", left: { type: "var", name: "x" }, right: { type: "num", value: 4 } }
 * }
 */

/**
 * @typedef {string|MathSegment} ContentSegment
 */

/**
 * @typedef {Object} MathSegment
 * @property {"math"} type
 * @property {Node} expr - Mathematical expression to render inline
 * @property {boolean} [display=false] - If true, render as display math (block); else inline
 *
 * @example
 * { type: "math", expr: { type: "num", value: 5 }, display: false }
 */
