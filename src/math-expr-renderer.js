// @ts-check

/**
 * Converts a mathematical expression AST to MathML markup.
 *
 * @param {import("./math-expr").MathExpr} node - The expression node to convert
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
    case "num":
      return `<mn>${node.value}</mn>`;

    case "var":
      return `<mi>${node.name}</mi>`;

    case "mixed": {
      const whole = `<mn>${node.whole}</mn>`;
      const frac = `<mfrac><mn>${node.num}</mn><mn>${node.den}</mn></mfrac>`;
      return `<mrow>${whole}<mspace width="0.3em"/>${frac}</mrow>`;
    }

    case "frac":
      return `<mfrac>${toMathML(node.num)}${toMathML(node.den)}</mfrac>`;

    case "add": {
      const left = toMathML(node.left);
      const right = toMathML(node.right);
      return `<mrow>${left}<mo>+</mo>${right}</mrow>`;
    }

    case "sub": {
      const left = toMathML(node.left);
      const right = toMathML(node.right);
      // Wrap right side in mrow if it's a binary op with lower precedence
      const rightWrapped = needsParens(node.right, "sub", "right")
        ? `<mrow><mo>(</mo>${right}<mo>)</mo></mrow>`
        : right;
      return `<mrow>${left}<mo>−</mo>${rightWrapped}</mrow>`;
    }

    case "mul": {
      const left = toMathML(node.left);
      const right = toMathML(node.right);
      // Wrap operands if they're lower-precedence operations
      const leftWrapped = needsParens(node.left, "mul", "left")
        ? `<mrow><mo>(</mo>${left}<mo>)</mo></mrow>`
        : left;
      const rightWrapped = needsParens(node.right, "mul", "right")
        ? `<mrow><mo>(</mo>${right}<mo>)</mo></mrow>`
        : right;
      return `<mrow>${leftWrapped}<mo>×</mo>${rightWrapped}</mrow>`;
    }

    case "div": {
      const left = toMathML(node.left);
      const right = toMathML(node.right);
      // Wrap operands if they're lower-precedence operations
      const leftWrapped = needsParens(node.left, "div", "left")
        ? `<mrow><mo>(</mo>${left}<mo>)</mo></mrow>`
        : left;
      const rightWrapped = needsParens(node.right, "div", "right")
        ? `<mrow><mo>(</mo>${right}<mo>)</mo></mrow>`
        : right;
      return `<mrow>${leftWrapped}<mo>÷</mo>${rightWrapped}</mrow>`;
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

    default:
      // @ts-expect-error
      throw new Error(`Unknown expression type: ${node.type}`);
  }
}

/**
 * Determines if an operand needs parentheses based on operator precedence.
 *
 * Precedence (highest to lowest):
 * 1. Atoms (num, var, frac, root)
 * 2. Power (pow)
 * 3. Multiplication & Division (mul, div)
 * 4. Addition & Subtraction (add, sub)
 *
 * @param {import("./math-expr").MathExpr} operand - The operand to check
 * @param {"add"|"sub"|"mul"|"div"|"pow"} parentOp - The parent operator
 * @param {"left"|"right"} position - Position of operand (left or right of parent)
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
    pow: 3,
  };

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
