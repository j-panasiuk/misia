// @ts-check

/**
 *
 * @param {number} a
 * @returns {import("./math-expr").NumNode}
 */
export function num(a) {
  return {
    type: "num",
    value: a,
  };
}

/**
 *
 * @param {number} a
 * @param {number} b
 * @param {number} c
 * @returns {import("./math-expr").MixedNode}
 */
export function mixed(a, b, c) {
  return {
    type: "mixed",
    whole: a,
    num: b,
    den: c,
  };
}

/**
 *
 * @param {import("./math-expr").MathExpr} a
 * @returns {import("./math-expr").NegateNode}
 */
export function neg(a) {
  return {
    type: "negate",
    operand: a,
  };
}

/**
 *
 * @param {import("./math-expr").MathExpr} a
 * @param {import("./math-expr").MathExpr} b
 * @returns {import("./math-expr").FracNode}
 */
export function frac(a, b) {
  return {
    type: "frac",
    num: a,
    den: b,
  };
}

/**
 *
 * @param {import("./math-expr").MathExpr} a
 * @param {import("./math-expr").MathExpr} b
 * @returns {import("./math-expr").BinaryOpNode}
 */
export function add(a, b) {
  return {
    type: "add",
    left: a,
    right: b,
  };
}

/**
 *
 * @param {import("./math-expr").MathExpr} a
 * @param {import("./math-expr").MathExpr} b
 * @returns {import("./math-expr").BinaryOpNode}
 */
export function sub(a, b) {
  return {
    type: "sub",
    left: a,
    right: b,
  };
}

/**
 *
 * @param {import("./math-expr").MathExpr} a
 * @param {import("./math-expr").MathExpr} b
 * @returns {import("./math-expr").BinaryOpNode}
 */
export function mul(a, b) {
  return {
    type: "mul",
    left: a,
    right: b,
  };
}

/**
 *
 * @param {import("./math-expr").MathExpr} a
 * @param {import("./math-expr").MathExpr} b
 * @returns {import("./math-expr").BinaryOpNode}
 */
export function div(a, b) {
  return {
    type: "div",
    left: a,
    right: b,
  };
}

/**
 *
 * @param {import("./math-expr").MathExpr} a
 * @param {import("./math-expr").MathExpr} b
 * @returns {import("./math-expr").BinaryOpNode}
 */
export function pow(a, b) {
  return {
    type: "pow",
    left: a,
    right: b,
  };
}
