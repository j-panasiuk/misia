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
