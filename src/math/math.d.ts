/**
 * A mathematical expression AST node. Can be recursively composed.
 */
type MathExpr =
  | VarNode
  | NumNode
  | MixedNode
  | NegateNode
  | FracNode
  | BinaryOpNode
  | RootNode
  | EqNode;

/**
 * A variable (e.g., "x", "y", "a").
 * @example { type: "var", name: "x" }
 */
interface VarNode {
  type: "var";
  name: string;
}

/**
 * A numeric value (integer or decimal).
 * @example { type: "num", value: 5 }
 * @example { type: "num", value: -3 }
 * @example { type: "num", value: 0.75 }
 */
interface NumNode {
  type: "num";
  value: number;
}

/**
 * A mixed number (whole number + fraction).
 * @example { type: "mixed", whole: 2, num: 3, den: 4 } // 2 3/4
 * @example { type: "mixed", whole: 0, num: 1, den: 2 } // 0 1/2 (equivalent to 1/2)
 */
interface MixedNode {
  type: "mixed";
  whole: number;
  num: number;
  den: number;
}

/**
 * Negation of an expression.
 * @example { type: "negate", operand: { type: "num", value: 5 } } // -5
 * @example { type: "negate", operand: { type: "var", name: "x" } } // -x
 */
interface NegateNode {
  type: "negate";
  operand: MathExpr;
}

/**
 * A fraction (numerator over denominator).
 * @example { type: "frac", num: { type: "var", value: "x" }, den: { type: "num", value: 5 } } // x/5
 */
interface FracNode {
  type: "frac";
  num: MathExpr;
  den: MathExpr;
}

/**
 * A binary operation (addition, subtraction, multiplication, division, or exponentiation).
 * @example { type: "add", left: { type: "num", value: 2 }, right: { type: "num", value: 3 } } // 2+3
 * @example { type: "div", left: { type: "num", value: 10 }, right: { type: "num", value: 2 } } // 10/2
 * @example { type: "pow", left: { type: "num", value: 2 }, right: { type: "num", value: 3 } } // 2**3
 */
interface BinaryOpNode<T extends BinaryOp = BinaryOp> {
  type: T;
  left: MathExpr;
  right: MathExpr;
}

type BinaryOp = "add" | "sub" | "mul" | "div" | "pow";

/**
 * A root expression (e.g., square root, cube root).
 */
interface RootNode {
  type: "root";
  radicand: MathExpr;
  index?: number; // default 2 (sqrt)
}

/**
 * Equality of two expressions.
 * @example
 * { type: "eq", left: { type: "num", value: 5 }, right: { type: "num", value: 5 } }  // 5 = 5
 * { type: "eq", left: { type: "var", name: "x" }, right: { type: "num", value: 2 } }  // x = 2
 */
type EqNode = {
  type: "eq";
  left: MathExpr;
  right: MathExpr;
};
