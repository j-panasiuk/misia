/**
 * Represents a math exercise with instructions and an expected answer.
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
interface Exercise {
  instruction: ContentSegment[];
  primaryExpr?: MathExpr | null; // Optional main expression (for reference)
  answer: number | string | MathExpr; // Can be numeric, string, or expression
  metadata?: Record<string, any>; // Optional metadata (difficulty, topic, etc.)
}

/**
 * A content segment — either plain text or a math segment.
 */
type ContentSegment = string | MathSegment;

/**
 * A math segment with an expression and rendering mode.
 * @example
 * { type: "math", expr: { type: "num", value: 5 }, display: false }
 */
interface MathSegment {
  type: "math";
  expr: MathExpr;
  display?: boolean; // If true, render as display math (block); otherwise inline
}

type Solved = "correct" | "incorrect";
