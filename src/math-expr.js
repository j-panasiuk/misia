// @ts-check

/**
 * @typedef {NumNode|MixedNode|NegateNode|FracNode|VarNode|BinaryOpNode|RootNode} MathExpr
 *
 * A mathematical expression AST node. Can be recursively composed.
 */

/**
 * @typedef {Object} NumNode
 * @property {"num"} type
 * @property {number} value - Integer or decimal (e.g., 5, -3, 0.5, 3.14)
 *
 * @example
 * { type: "num", value: 5 }
 * { type: "num", value: -3 }
 * { type: "num", value: 0.75 }
 */

/**
 * @typedef {Object} MixedNode
 * @property {"mixed"} type
 * @property {number} whole - Whole number part (can be 0)
 * @property {number} num - Numerator of fractional part
 * @property {number} den - Denominator of fractional part
 *
 * @example
 * { type: "mixed", whole: 2, num: 3, den: 4 }  // 2 3/4
 * { type: "mixed", whole: 0, num: 1, den: 2 }  // 0 1/2 (equivalent to 1/2)
 */

/**
 * @typedef {Object} NegateNode
 * @property {"negate"} type
 * @property {MathExpr} operand - Expression to negate
 *
 * @example
 * { type: "negate", operand: { type: "num", value: 5 } }  // -5
 * { type: "negate", operand: { type: "var", name: "x" } } // -x
 */

/**
 * @typedef {Object} FracNode
 * @property {"frac"} type - Vertical fraction (numerator over denominator)
 * @property {MathExpr} num - Numerator expression
 * @property {MathExpr} den - Denominator expression
 *
 * @example
 * { type: "frac", num: { type: "num", value: 3 }, den: { type: "num", value: 5 } }
 */

/**
 * @typedef {Object} VarNode
 * @property {"var"} type
 * @property {string} name - Variable name (e.g., "x", "y", "a")
 *
 * @example
 * { type: "var", name: "x" }
 */

/**
 * @typedef {Object} BinaryOpNode
 * @property {"add"|"sub"|"mul"|"div"|"pow"} type
 * @property {MathExpr} left - Left operand
 * @property {MathExpr} right - Right operand
 *
 * @example
 * { type: "add", left: { type: "num", value: 2 }, right: { type: "num", value: 3 } }
 * { type: "div", left: { type: "num", value: 10 }, right: { type: "num", value: 2 } }
 * { type: "pow", left: { type: "num", value: 2 }, right: { type: "num", value: 3 } }
 */

/**
 * @typedef {Object} RootNode
 * @property {"root"} type
 * @property {MathExpr} radicand - Expression under the radical
 * @property {number} [index=2] - Root index (2 for sqrt, 3 for cube root, etc.)
 *
 * @example
 * { type: "root", radicand: { type: "num", value: 9 }, index: 2 }  // √9
 * { type: "root", radicand: { type: "num", value: 8 }, index: 3 }  // ∛8
 */
