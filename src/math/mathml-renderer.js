// @ts-check

/**
 * Converts a mathematical expression AST to MathML markup.
 *
 * @param {MathExpr} node - The expression node to convert
 * @returns {string} MathML markup (inner content, without outer <math> tags)
 *
 * @example
 * toMathML({ type: "num", value: 5 })
 * // Returns: "<mn>5</mn>"
 *
 * toMathML({
 *   type: "frac",
 *   num: { type: "num", value: 3 },
 *   den: { type: "num", value: 5 }
 * })
 * // Returns: "<mfrac><mn>3</mn><mn>5</mn></mfrac>"
 */
export function toMathML(node) {
  switch (node.type) {
    case "var":
      return `<mi>${node.name}</mi>`;

    case "num":
      return toMathMLNumber(node.value);

    case "mixed": {
      const whole = toMathMLNumber(node.whole);
      const frac = `<mfrac><mn>${node.num}</mn><mn>${node.den}</mn></mfrac>`;
      return `<mrow>${whole}<mspace width="0.125em"/>${frac}</mrow>`;
    }

    case "negate": {
      const operand = toMathML(node.operand);
      const operandWrapped = needsParens(node.operand, "negate", "operand")
        ? `<mo>(</mo>${operand}<mo>)</mo>`
        : operand;
      return `<mrow><mo>−</mo>${operandWrapped}</mrow>`;
    }

    case "frac":
      return `<mfrac>${toMathML(node.num)}${toMathML(node.den)}</mfrac>`;

    case "add": {
      const left = toMathML(node.left);
      const right = toMathML(node.right);
      // Wrap right side in mrow if it's a binary op with lower precedence
      const rightWrapped = needsParens(node.right, "add", "right")
        ? `<mo>(</mo>${right}<mo>)</mo>`
        : right;
      return `<mrow>${left}<mo>+</mo>${rightWrapped}</mrow>`;
    }

    case "sub": {
      const left = toMathML(node.left);
      const right = toMathML(node.right);
      // Wrap right side in mrow if it's a binary op with lower precedence
      const rightWrapped = needsParens(node.right, "sub", "right")
        ? `<mo>(</mo>${right}<mo>)</mo>`
        : right;
      return `<mrow>${left}<mo>−</mo>${rightWrapped}</mrow>`;
    }

    case "mul": {
      const left = toMathML(node.left);
      const right = toMathML(node.right);
      // Wrap operands if they're lower-precedence operations
      const leftWrapped = needsParens(node.left, "mul", "left")
        ? `<mo>(</mo>${left}<mo>)</mo>`
        : left;
      const rightWrapped = needsParens(node.right, "mul", "right")
        ? `<mo>(</mo>${right}<mo>)</mo>`
        : right;
      return `<mrow>${leftWrapped}<mo>⋅</mo>${rightWrapped}</mrow>`;
    }

    case "div": {
      const left = toMathML(node.left);
      const right = toMathML(node.right);
      // Wrap operands if they're lower-precedence operations
      const leftWrapped = needsParens(node.left, "div", "left")
        ? `<mo>(</mo>${left}<mo>)</mo>`
        : left;
      const rightWrapped = needsParens(node.right, "div", "right")
        ? `<mo>(</mo>${right}<mo>)</mo>`
        : right;
      return `<mrow>${leftWrapped}<mo>∶</mo>${rightWrapped}</mrow>`;
    }

    case "pow": {
      const base = toMathML(node.left);
      const exponent = toMathML(node.right);
      // Wrap base if it's a binary operation
      const baseWrapped = needsParens(node.left, "pow", "left")
        ? `<mrow><mo>(</mo>${base}<mo>)</mo></mrow>`
        : base;
      return `<msup>${baseWrapped}${exponent}</msup>`;
    }

    case "root": {
      const radicand = toMathML(node.radicand);
      const index = node.index ?? 2;

      if (index === 2) {
        // Square root: use <msqrt>
        return `<msqrt>${radicand}</msqrt>`;
      } else {
        // Nth root: use <mroot> with index
        return `<mroot>${radicand}<mn>${index}</mn></mroot>`;
      }
    }

    case "eq": {
      return `<mrow>${toMathML(node.left)}<mo>=</mo>${toMathML(node.right)}<mrow>`;
    }

    default:
      // @ts-expect-error
      throw new Error(`Unknown expression type: ${node.type}`);
  }
}

/**
 * Wraps a numeric value in MathML tags with proper handling for negative numbers.
 * Accepts `NaN` and treats it as an editable placeholder.
 *
 * @param {number} value - The numeric value to wrap
 * @returns {string} MathML markup for the number
 *
 * @example
 * toMathMLNumber(5)    // "<mn>5</mn>"
 * toMathMLNumber(-1.5) // "<mrow><mo>−</mo><mn>1.5</mn></mrow>"
 * toMathMLNumber(NaN) // "<mn><span contenteditable></mn>"
 */
function toMathMLNumber(value) {
  if (Number.isNaN(value))
    return `<mn><span contenteditable autofocus></span></mn>`;

  return value < 0
    ? // Ensure consistent minus sign display
      `<mrow><mo>−</mo><mn>${Math.abs(value)}</mn></mrow>`
    : `<mn>${value}</mn>`;
}

/**
 * Determines if an operand needs parentheses based on operator precedence.
 *
 * Precedence (highest to lowest):
 * 1. Atoms (num, var, frac, root)
 * 2. Power (pow)
 * 3. Negation (negate)
 * 4. Multiplication & Division (mul, div)
 * 5. Addition & Subtraction (add, sub)
 *
 * @param {MathExpr} operand - The operand to check
 * @param {"add"|"sub"|"mul"|"div"|"pow"|"negate"} parentOp - The parent operator
 * @param {"left"|"right"|"operand"} position - Position of operand
 * @returns {boolean} True if parentheses are needed
 *
 * @example
 * needsParens({ type: "add", ... }, "mul", "left")  // true (add has lower precedence than mul)
 * needsParens({ type: "mul", ... }, "add", "left")  // false (mul has higher precedence than add)
 * needsParens({ type: "sub", ... }, "sub", "right") // true (subtraction is left-associative)
 */
function needsParens(operand, parentOp, position) {
  const precedence = {
    add: 1,
    sub: 1,
    mul: 2,
    div: 2,
    negate: 3,
    pow: 4,
  };

  // Special case: wrap negative values in parens when operated upon
  if (isNegativeValue(operand) /* && position === "right" */) {
    return true;
  }

  // Special case: compound structures as base of power need parens
  if (
    parentOp === "pow" &&
    position === "left" &&
    (operand.type === "frac" ||
      operand.type === "mixed" ||
      operand.type === "root")
  ) {
    return true;
  }

  // Atoms never need parens
  if (!(operand.type in precedence)) {
    return false;
  }

  const opType = /** @type {keyof typeof precedence} */ (operand.type);
  const opPrecedence = precedence[opType];
  const parentPrecedence = precedence[parentOp];

  // Lower precedence needs parens
  if (opPrecedence < parentPrecedence) {
    return true;
  }

  // Same precedence: check associativity
  if (opPrecedence === parentPrecedence) {
    // Subtraction and division are left-associative
    // Right operand needs parens if parent is sub or div
    if ((parentOp === "sub" || parentOp === "div") && position === "right") {
      return true;
    }
    // Power is right-associative (no parens needed for same precedence)
  }

  return false;
}

/**
 *
 * @param {MathExpr} operand
 * @returns {boolean}
 */
function isNegativeValue(operand) {
  switch (operand.type) {
    case "negate":
      return true;
    case "num":
      return operand.value < 0;
    case "mixed":
      return operand.whole < 0;
    default:
      return false;
  }
}
