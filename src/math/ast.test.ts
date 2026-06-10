import { describe, expect, test } from "bun:test";

import {
  add,
  div,
  eq,
  frac,
  m,
  mul,
  n,
  neg,
  pow,
  product,
  sum,
  sub,
  v,
} from "./ast.js";

describe("n", () => {
  test("creates a NumNode", () => {
    expect(n(42)).toEqual({ type: "num", value: 42 });
    expect(n(-3)).toEqual({ type: "num", value: -3 });
    expect(n(0.75)).toEqual({ type: "num", value: 0.75 });
   });
});

describe("v", () => {
  test("creates a VarNode", () => {
    expect(v("x")).toEqual({ type: "var", name: "x" });
    expect(v("a")).toEqual({ type: "var", name: "a" });
   });
});

describe("m", () => {
  test("creates a MixedNode", () => {
    expect(m(2, 3, 4)).toEqual({ type: "mixed", whole: 2, num: 3, den: 4 });
    expect(m(0, 1, 2)).toEqual({ type: "mixed", whole: 0, num: 1, den: 2 });
   });
});

describe("frac", () => {
  test("creates a FracNode with numbers auto-wrapped", () => {
    expect(frac(1, 2)).toEqual({
      type: "frac",
      num: { type: "num", value: 1 },
      den: { type: "num", value: 2 },
     });
   });

  test("accepts existing expressions", () => {
    expect(frac(n(3), v("x"))).toEqual({
      type: "frac",
      num: { type: "num", value: 3 },
      den: { type: "var", name: "x" },
     });
   });
});

describe("neg", () => {
  test("creates a NegateNode with numbers auto-wrapped", () => {
    expect(neg(5)).toEqual({ type: "negate", operand: { type: "num", value: 5 } });
    expect(neg(n(3))).toEqual({
      type: "negate",
      operand: { type: "num", value: 3 },
     });
   });
});

describe("add", () => {
  test("creates a binary add node with auto-wrap", () => {
    expect(add(2, 3)).toEqual({
      type: "add",
      left: { type: "num", value: 2 },
      right: { type: "num", value: 3 },
     });
   });

  test("accepts expressions without wrapping", () => {
    expect(add(n(2), n(3))).toEqual({
      type: "add",
      left: { type: "num", value: 2 },
      right: { type: "num", value: 3 },
     });
   });
});

describe("sub", () => {
  test("creates a binary sub node", () => {
    expect(sub(5, 3)).toEqual({
      type: "sub",
      left: { type: "num", value: 5 },
      right: { type: "num", value: 3 },
     });
   });
});

describe("mul", () => {
  test("creates a binary mul node", () => {
    expect(mul(4, 2)).toEqual({
      type: "mul",
      left: { type: "num", value: 4 },
      right: { type: "num", value: 2 },
     });
   });
});

describe("div", () => {
  test("creates a binary div node", () => {
    expect(div(10, 2)).toEqual({
      type: "div",
      left: { type: "num", value: 10 },
      right: { type: "num", value: 2 },
     });
   });
});

describe("pow", () => {
  test("creates a binary pow node", () => {
    expect(pow(2, 3)).toEqual({
      type: "pow",
      left: { type: "num", value: 2 },
      right: { type: "num", value: 3 },
     });
   });
});

describe("eq", () => {
  test("creates an EqNode", () => {
    expect(eq(5, 5)).toEqual({
      type: "eq",
      left: { type: "num", value: 5 },
      right: { type: "num", value: 5 },
     });
   });
});

describe("nested expressions", () => {
  test("composite expressions are built correctly", () => {
    const expr = add(mul(n(2), v("x")), n(3));
    expect(expr).toEqual({
      type: "add",
      left: {
       type: "mul",
       left: { type: "num", value: 2 },
       right: { type: "var", name: "x" },
      },
      right: { type: "num", value: 3 },
     });
   });
});

describe("sum", () => {
  test("two terms creates a single add", () => {
    expect(sum(n(1), n(2))).toEqual({
      type: "add",
      left: { type: "num", value: 1 },
      right: { type: "num", value: 2 },
     });
   });

  test("three terms nests left-associatively", () => {
    expect(sum(n(1), n(2), n(3))).toEqual({
      type: "add",
      left: { type: "add", left: { type: "num", value: 1 }, right: { type: "num", value: 2 } },
      right: { type: "num", value: 3 },
     });
   });

  test("four terms nests correctly", () => {
    const result = sum(n(1), n(2), n(3), n(4));
    expect(result.type).toBe("add");
    expect((result as any).right).toEqual({ type: "num", value: 4 });
   });
});

describe("product", () => {
  test("two factors creates a single mul", () => {
    expect(product(n(2), n(3))).toEqual({
      type: "mul",
      left: { type: "num", value: 2 },
      right: { type: "num", value: 3 },
     });
   });

  test("three factors nests left-associatively", () => {
    expect(product(n(2), n(3), n(4))).toEqual({
      type: "mul",
      left: { type: "mul", left: { type: "num", value: 2 }, right: { type: "num", value: 3 } },
      right: { type: "num", value: 4 },
     });
   });
});
