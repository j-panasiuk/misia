/**
 * @satisfies {Record<BinaryOp, (a: number, b: number) => number>}
 */
export const evaluate = {
  add: (a, b) => a + b,
  sub: (a, b) => a - b,
  mul: (a, b) => a * b,
  div: (a, b) => a / b,
  pow: (a, b) => a ** b,
};
