// @ts-check

/**
 * Create a variable value.
 * @param {string} a
 * @returns {VarNode}
 */
export function v(a) {
  return { type: "var", name: a };
}

/**
 * Create numeric value.
 * @param {number} a
 * @returns {NumNode}
 */
export function n(a) {
  return { type: "num", value: a };
}

/**
 * Ensure value is an expression.
 * @param {number|MathExpr} a
 * @returns {MathExpr}
 */
function expr(a) {
  return typeof a === "number" ? n(a) : a;
}

/**
 * Create mixed number value.
 * @param {number} a
 * @param {number} b
 * @param {number} c
 * @returns {MixedNode}
 */
export function m(a, b, c) {
  return { type: "mixed", whole: a, num: b, den: c };
}

/**
 * Create a fraction value.
 * @param {number|MathExpr} a
 * @param {number|MathExpr} b
 * @returns {FracNode}
 */
export function frac(a, b) {
  return { type: "frac", num: expr(a), den: expr(b) };
}

/**
 * Negate an expression.
 * @param {number|MathExpr} a
 * @returns {NegateNode}
 */
export function neg(a) {
  return { type: "negate", operand: expr(a) };
}

/**
 * Create addition of two expressions.
 * @param {number|MathExpr} a
 * @param {number|MathExpr} b
 * @returns {BinaryOpNode<'add'>}
 */
export function add(a, b) {
  return { type: "add", left: expr(a), right: expr(b) };
}

/**
 * Create subtraction of two expressions.
 * @param {number|MathExpr} a
 * @param {number|MathExpr} b
 * @returns {BinaryOpNode<'sub'>}
 */
export function sub(a, b) {
  return { type: "sub", left: expr(a), right: expr(b) };
}

/**
 * Create multiplication of two expressions.
 * @param {number|MathExpr} a
 * @param {number|MathExpr} b
 * @returns {BinaryOpNode<'mul'>}
 */
export function mul(a, b) {
  return { type: "mul", left: expr(a), right: expr(b) };
}

/**
 * Create division of two expressions.
 * @param {number|MathExpr} a
 * @param {number|MathExpr} b
 * @returns {BinaryOpNode<'div'>}
 */
export function div(a, b) {
  return { type: "div", left: expr(a), right: expr(b) };
}

/**
 * Create a power expression.
 * @param {number|MathExpr} a
 * @param {number|MathExpr} b
 * @returns {BinaryOpNode<'pow'>}
 */
export function pow(a, b) {
  return { type: "pow", left: expr(a), right: expr(b) };
}

/**
 * Create equality expression.
 * @param {number|MathExpr} a
 * @param {number|MathExpr} b
 * @returns {EqNode}
 */
export function eq(a, b) {
  return { type: "eq", left: expr(a), right: expr(b) };
}

// -- BINARY OPERATIONS --

/**
 * @satisfies {Record<BinaryOp, (a: number|MathExpr, b: number|MathExpr) => MathExpr>}
 */
export const operation = {
  add,
  sub,
  mul,
  div,
  pow,
};

// -- N-ARY HELPERS --

/**
 * Creates a left-associative addition expression from multiple terms.
 *
 * This is a convenience helper that flattens the syntax for writing sums,
 * while preserving the underlying binary AST structure for consistency
 * in transformations and rendering.
 *
 * @param {MathExpr} first - The first term to add.
 * @param {MathExpr} second - The second term to add.
 * @param {...MathExpr} rest - Additional terms to add.
 * @returns {MathExpr} A binary AST expression: add(add(add(first, second), rest), ...)
 *
 * @example
 * sum(n(1), n(2), n(3)) → add(add(n(1), n(2)), n(3))
 */
export function sum(first, second, ...rest) {
  let result = add(first, second);
  for (const term of rest) {
    result = add(result, term);
  }
  return result;
}

/**
 * Creates a left-associative multiplication expression from multiple factors.
 *
 * Convenience helper that flattens syntax while preserving binary AST structure.
 *
 * @param {MathExpr} first - The first factor.
 * @param {MathExpr} second - The second factor.
 * @param {...MathExpr} rest - Additional factors.
 * @returns {MathExpr} A binary AST expression: mul(mul(mul(first, second), rest), ...)
 *
 * @example
 * product(n(2), n(3), n(4)) → mul(mul(n(2), n(3)), n(4))
 */
export function product(first, second, ...rest) {
  let result = mul(first, second);
  for (const factor of rest) {
    result = mul(result, factor);
  }
  return result;
}
