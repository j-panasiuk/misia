// @ts-check

/**
 * Create a variable value.
 * @param {string} a
 * @returns {VarNode}
 */
export function v(a) {
  return {
    type: "var",
    name: a,
  };
}

/**
 * Create numeric value.
 * @param {number} a
 * @returns {NumNode}
 */
export function n(a) {
  return {
    type: "num",
    value: a,
  };
}

/**
 * Create mixed number value.
 * @param {number} a
 * @param {number} b
 * @param {number} c
 * @returns {MixedNode}
 */
export function m(a, b, c) {
  return {
    type: "mixed",
    whole: a,
    num: b,
    den: c,
  };
}

/**
 * Create a fraction value.
 * @param {MathExpr} a
 * @param {MathExpr} b
 * @returns {FracNode}
 */
export function frac(a, b) {
  return {
    type: "frac",
    num: a,
    den: b,
  };
}

/**
 * Negate an expression.
 * @param {MathExpr} a
 * @returns {NegateNode}
 */
export function neg(a) {
  return {
    type: "negate",
    operand: a,
  };
}

/**
 * Create addition of two expressions.
 * @param {MathExpr} a
 * @param {MathExpr} b
 * @returns {BinaryOpNode<'add'>}
 */
export function add(a, b) {
  return {
    type: "add",
    left: a,
    right: b,
  };
}

/**
 * Create subtraction of two expressions.
 * @param {MathExpr} a
 * @param {MathExpr} b
 * @returns {BinaryOpNode<'sub'>}
 */
export function sub(a, b) {
  return {
    type: "sub",
    left: a,
    right: b,
  };
}

/**
 * Create multiplication of two expressions.
 * @param {MathExpr} a
 * @param {MathExpr} b
 * @returns {BinaryOpNode<'mul'>}
 */
export function mul(a, b) {
  return {
    type: "mul",
    left: a,
    right: b,
  };
}

/**
 * Create division of two expressions.
 * @param {MathExpr} a
 * @param {MathExpr} b
 * @returns {BinaryOpNode<'div'>}
 */
export function div(a, b) {
  return {
    type: "div",
    left: a,
    right: b,
  };
}

/**
 * Create a power expression.
 * @param {MathExpr} a
 * @param {MathExpr} b
 * @returns {BinaryOpNode<'pow'>}
 */
export function pow(a, b) {
  return {
    type: "pow",
    left: a,
    right: b,
  };
}

/**
 * Create equality expression.
 * @param {MathExpr} a
 * @param {MathExpr} b
 * @returns {EqNode}
 */
export function eq(a, b) {
  return {
    type: "eq",
    left: a,
    right: b,
  };
}
