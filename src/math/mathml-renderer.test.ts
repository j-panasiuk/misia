import { describe, expect, test } from "bun:test";

import { toMathML } from "./mathml-renderer.js";
import { frac, n, neg, pow, v } from "./ast.js";

// Helper type for node kinds
type Node = ReturnType<typeof n | typeof v | typeof frac | typeof neg | typeof pow>;

describe("toMathML - atoms", () => {
  test("number", () => {
    expect(toMathML(n(5))).toBe("<mn>5</mn>");
   });

  test("negative number uses mo for minus", () => {
    expect(toMathML(n(-3))).toBe("<mrow><mo>−</mo><mn>3</mn></mrow>");
   });

  test("variable", () => {
    expect(toMathML(v("x"))).toBe("<mi>x</mi>");
   });

  test("fraction", () => {
    expect(toMathML(frac(n(3), n(5)))).toBe("<mfrac><mn>3</mn><mn>5</mn></mfrac>");
   });

  test("NaN placeholder creates contenteditable span", () => {
    expect(toMathML(n(NaN))).toContain("contenteditable");
    expect(toMathML(n(NaN))).toBe("<mn><span contenteditable autofocus></span></mn>");
   });
});

describe("toMathML - negate", () => {
  test("negates a number", () => {
    expect(toMathML(neg(n(5)))).toBe("<mrow><mo>−</mo><mn>5</mn></mrow>");
   });

  test("negates a variable", () => {
    expect(toMathML(neg(v("x")))).toBe("<mrow><mo>−</mo><mi>x</mi></mrow>");
   });
});

describe("toMathML - binary operations", () => {
  test("addition", () => {
    expect(toMathML({ type: "add", left: n(2), right: n(3) })).toBe(
      "<mrow><mn>2</mn><mo>+</mo><mn>3</mn></mrow>"
     );
   });

  test("subtraction", () => {
    expect(toMathML({ type: "sub", left: n(5), right: n(2) })).toBe(
      "<mrow><mn>5</mn><mo>−</mo><mn>2</mn></mrow>"
     );
   });

  test("multiplication", () => {
    expect(toMathML({ type: "mul", left: n(3), right: n(4) })).toBe(
      "<mrow><mn>3</mn><mo>⋅</mo><mn>4</mn></mrow>"
     );
   });

  test("division", () => {
    expect(toMathML({ type: "div", left: n(10), right: n(2) })).toBe(
      "<mrow><mn>10</mn><mo>∶</mo><mn>2</mn></mrow>"
     );
   });

  test("power", () => {
    expect(toMathML({ type: "pow", left: n(2), right: n(3) })).toBe(
      "<msup><mn>2</mn><mn>3</mn></msup>"
     );
   });

  test("equality", () => {
    expect(toMathML({ type: "eq", left: n(5), right: n(5) })).toContain("<mo>=</mo>");
   });
});

describe("toMathML - parenthesization", () => {
  test("lower precedence as operand needs parens", () => {
    // mul(3, add(1, 2)) should wrap add in parens
    const expr = { type: "mul", left: n(3), right: { type: "add", left: n(1), right: n(2) } };
    const result = toMathML(expr);
    expect(result).toContain("<mo>(</mo>");
   });

  test("higher precedence does not need parens", () => {
    // add(1, mul(2, 3)) should NOT wrap mul in parens
    const expr = { type: "add", left: n(1), right: { type: "mul", left: n(2), right: n(3) } };
    const result = toMathML(expr);
    expect(result).not.toContain("<mo>(</mo>");
   });

  test("same precedence subtraction on right needs parens", () => {
    // sub(sub(5, 3), n(1)) should wrap left sub
    const expr = { type: "sub", left: { type: "sub", left: n(5), right: n(3) }, right: n(1) };
    expect(toMathML(expr)).not.toContain("<mo>(</mo>");
   });

  test("same precedence subtraction on right needs parens (right associative case)", () => {
    // sub(n(5), sub(3, 1)) should wrap right sub in parens
    const expr = { type: "sub", left: n(5), right: { type: "sub", left: n(3), right: n(1) } };
    expect(toMathML(expr)).toContain("<mo>(</mo>");
   });

  test("negative operand needs parens when multiplied", () => {
    const expr = { type: "mul", left: n(3), right: n(-5) };
    const result = toMathML(expr);
    expect(result).toContain("<mo>(</mo>");
   });

  test("fraction as base of power needs parens", () => {
    const expr = { type: "pow", left: frac(n(1), n(2)), right: n(2) };
    const result = toMathML(expr);
    expect(result).toContain("<mo>(</mo>");
   });

  test("variable as base of power does not need parens", () => {
    const expr = { type: "pow", left: v("x"), right: n(2) };
    const result = toMathML(expr);
    expect(result).not.toContain("<mo>(</mo>");
   });
});

describe("toMathML - unknown type throws", () => {
  test("throws for unsupported node type", () => {
    expect(() => toMathML({ type: "invalid" } as any)).toThrow(
      "Unknown expression type: invalid"
     );
   });
});
