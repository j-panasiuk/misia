import { describe, expect, test } from "bun:test";

import {
  addFractions,
  decimalToFraction,
  evaluate,
  fractionToDecimal,
  gcd,
  lcm,
  multiplyFractions,
  scaleFraction,
  sign,
  simplifyBeforeMultiplication,
  simplifyFraction,
  subtractFractions,
} from "./evaluate.js";

describe("gcd", () => {
  test("basic cases", () => {
    expect(gcd(48, 18)).toBe(6);
    expect(gcd(100, 50)).toBe(50);
    expect(gcd(17, 5)).toBe(1);
  });

  test("when one divides the other", () => {
    expect(gcd(12, 6)).toBe(6);
    expect(gcd(6, 12)).toBe(6);
  });

  test("with zero", () => {
    expect(gcd(5, 0)).toBe(5);
    expect(gcd(0, 7)).toBe(7);
  });

  test("with negative numbers", () => {
    expect(gcd(-48, 18)).toBe(6);
    expect(gcd(48, -18)).toBe(6);
    expect(gcd(-48, -18)).toBe(6);
    });
});

describe("lcm", () => {
  test("basic cases", () => {
    expect(lcm(4, 6)).toBe(12);
    expect(lcm(3, 5)).toBe(15);
    expect(lcm(12, 18)).toBe(36);
  });

  test("when one divides the other", () => {
    expect(lcm(4, 8)).toBe(8);
    expect(lcm(8, 4)).toBe(8);
  });

  test("with same number", () => {
    expect(lcm(7, 7)).toBe(7);
  });

  test("with 1", () => {
    expect(lcm(1, 5)).toBe(5);
    expect(lcm(5, 1)).toBe(5);
  });
});

describe("sign", () => {
  test("positive fraction", () => {
    expect(sign([3, 4])).toBe(1);
  });

  test("negative - negative numerator", () => {
    expect(sign([-3, 4])).toBe(-1);
  });

  test("negative - negative denominator", () => {
    expect(sign([3, -4])).toBe(-1);
  });

  test("positive - both negative", () => {
    expect(sign([-3, -4])).toBe(1);
  });

  test("zero", () => {
    expect(sign([0, 5])).toBe(0);
    expect(sign([0, -1])).toBe(0);
  });
});

describe("simplifyFraction", () => {
  test("already simplified", () => {
    expect(simplifyFraction([7, 11])).toEqual([7, 11]);
    expect(simplifyFraction([1, 2])).toEqual([1, 2]);
  });

  test("reducible", () => {
    expect(simplifyFraction([4, 8])).toEqual([1, 2]);
    expect(simplifyFraction([6, 9])).toEqual([2, 3]);
    expect(simplifyFraction([12, 30])).toEqual([2, 5]);
  });

  test("zero numerator", () => {
    expect(simplifyFraction([0, 5])).toEqual([0, 1]);
  });

  test("negative fractions", () => {
    expect(simplifyFraction([-4, 8])).toEqual([-1, 2]);
    expect(simplifyFraction([4, -8])).toEqual([1, -2]);
   });
});

describe("decimalToFraction", () => {
  test("zero", () => {
    expect(decimalToFraction(0)).toEqual([0, 1]);
  });

  test("integers", () => {
    expect(decimalToFraction(5)).toEqual([5, 1]);
    expect(decimalToFraction(-3)).toEqual([-3, 1]);
  });

  test("simple decimals", () => {
    expect(decimalToFraction(0.5)).toEqual([1, 2]);
    expect(decimalToFraction(0.75)).toEqual([3, 4]);
    expect(decimalToFraction(0.25)).toEqual([1, 4]);
  });

  test("multi-digit decimals", () => {
    expect(decimalToFraction(0.2)).toEqual([1, 5]);
    expect(decimalToFraction(0.01)).toEqual([1, 100]);
  });

  test("mixed decimals", () => {
    expect(decimalToFraction(1.5)).toEqual([3, 2]);
  });
});

describe("fractionToDecimal", () => {
  test("basic", () => {
    expect(fractionToDecimal([1, 2])).toBe(0.5);
    expect(fractionToDecimal([3, 4])).toBe(0.75);
  });

  test("integer equivalent", () => {
    expect(fractionToDecimal([5, 1])).toBe(5);
  });

  test("repeating approximation", () => {
    expect(fractionToDecimal([1, 3])).toBeCloseTo(0.3333333333333333);
  });
});

describe("scaleFraction", () => {
  test("scales correctly", () => {
    expect(scaleFraction([1, 2], 4)).toEqual([2, 4]);
    expect(scaleFraction([1, 2], 6)).toEqual([3, 6]);
    expect(scaleFraction([3, 4], 12)).toEqual([9, 12]);
  });

  test("throws when new denominator is not a multiple", () => {
    expect(() => scaleFraction([1, 3], 5)).toThrow(RangeError);
    expect(() => scaleFraction([2, 5], 7)).toThrow(RangeError);
  });

  test("same denominator is a no-op", () => {
    expect(scaleFraction([3, 4], 4)).toEqual([3, 4]);
  });
});

describe("addFractions", () => {
  test("same denominator", () => {
    expect(addFractions([1, 4], [2, 4])).toEqual([3, 4]);
    expect(addFractions([1, 3], [1, 3])).toEqual([2, 3]);
  });

  test("different denominators", () => {
    expect(addFractions([1, 2], [1, 4])).toEqual([3, 4]);
    expect(addFractions([1, 3], [1, 6])).toEqual([1, 2]);
  });

  test("result simplifies", () => {
    expect(addFractions([2, 6], [1, 3])).toEqual([2, 3]);
    expect(addFractions([1, 4], [3, 4])).toEqual([1, 1]);
  });

  test("negative fractions", () => {
    expect(addFractions([-1, 4], [3, 4])).toEqual([1, 2]);
    expect(addFractions([1, 2], [-1, 4])).toEqual([1, 4]);
  });

  test("sum is zero", () => {
    expect(addFractions([1, 3], [-1, 3])).toEqual([0, 1]);
  });
});

describe("subtractFractions", () => {
  test("same denominator", () => {
    expect(subtractFractions([3, 4], [1, 4])).toEqual([1, 2]);
  });

  test("different denominators", () => {
    expect(subtractFractions([1, 2], [1, 3])).toEqual([1, 6]);
    expect(subtractFractions([5, 6], [1, 3])).toEqual([1, 2]);
  });

  test("negative result", () => {
    expect(subtractFractions([1, 4], [3, 4])).toEqual([-1, 2]);
  });

  test("result is zero", () => {
    expect(subtractFractions([2, 5], [2, 5])).toEqual([0, 1]);
  });
});

describe("multiplyFractions", () => {
  test("basic multiplication", () => {
    expect(multiplyFractions([1, 2], [3, 4])).toEqual([3, 8]);
  });

  test("result simplifies", () => {
    expect(multiplyFractions([2, 3], [3, 4])).toEqual([1, 2]);
    expect(multiplyFractions([5, 6], [2, 5])).toEqual([1, 3]);
  });

  test("with negative", () => {
    expect(multiplyFractions([-1, 2], [3, 4])).toEqual([-3, 8]);
    expect(multiplyFractions([-1, 2], [-3, 4])).toEqual([3, 8]);
  });

  test("with whole numbers", () => {
    expect(multiplyFractions([3, 1], [1, 4])).toEqual([3, 4]);
  });
});

describe("simplifyBeforeMultiplication", () => {
    test("simplifies and cross-cancels", () => {
      expect(simplifyBeforeMultiplication([4, 8], [6, 9])).toEqual([
       [1, 1],
       [1, 3],
     ]);
    });

    test("cross-cancels common factors", () => {
      expect(simplifyBeforeMultiplication([6, 8], [4, 9])).toEqual([
       [1, 1],
       [1, 3],
     ]);
    });

    test("no-op when already simplified with no cross-cancel", () => {
      expect(simplifyBeforeMultiplication([1, 3], [2, 5])).toEqual([
       [1, 3],
       [2, 5],
     ]);
    });

    test("full cross-cancellation", () => {
      expect(simplifyBeforeMultiplication([2, 3], [3, 4])).toEqual([
       [1, 1],
       [1, 2],
     ]);
    });
});

describe("evaluate", () => {
  test("add", () => {
    expect(evaluate.add(2, 3)).toBe(5);
    expect(evaluate.add(-1, 1)).toBe(0);
  });

  test("sub", () => {
    expect(evaluate.sub(5, 3)).toBe(2);
    expect(evaluate.sub(3, 5)).toBe(-2);
  });

  test("mul", () => {
    expect(evaluate.mul(3, 4)).toBe(12);
    expect(evaluate.mul(-2, 3)).toBe(-6);
  });

  test("div", () => {
    expect(evaluate.div(6, 3)).toBe(2);
    expect(evaluate.div(5, 2)).toBe(2.5);
  });

  test("pow", () => {
    expect(evaluate.pow(2, 3)).toBe(8);
    expect(evaluate.pow(0, 5)).toBe(0);
    expect(evaluate.pow(3, 0)).toBe(1);
  });
});
