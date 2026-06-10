import { describe, expect, test } from "bun:test";

import { random, sample } from "./random.js";

describe("sample", () => {
  test("returns an element from the array", () => {
    const arr = [1, 2, 3, 4, 5];
    const result = sample(arr);
    expect(arr).toContain(result);
   });

  test("throws on empty array", () => {
    expect(() => sample([] as any)).toThrow("Cannot sample from an empty array");
   });

  test("returns random values over many calls", () => {
    const arr = [1, 2, 3];
    const results = new Set();
    for (let i = 0; i < 100; i++) results.add(sample(arr));
    expect(results.size).toBeGreaterThan(1);
   });
});

describe("random.int", () => {
  test("returns a value within bounds", () => {
    for (let i = 0; i < 50; i++) {
      const val = random.int(0, 10);
      expect(val).toBeGreaterThanOrEqual(0);
      expect(val).toBeLessThan(10);
     }
   });

  test("default range is 0-10", () => {
    for (let i = 0; i < 50; i++) {
      const val = random.int();
      expect(val).toBeGreaterThanOrEqual(0);
      expect(val).toBeLessThan(10);
     }
   });

  test("handles negative ranges", () => {
    for (let i = 0; i < 50; i++) {
      const val = random.int(-5, 5);
      expect(val).toBeGreaterThanOrEqual(-5);
      expect(val).toBeLessThan(5);
     }
   });
});

describe("random.prime", () => {
  test("returns a prime number", () => {
    const primes = [2, 3, 5, 7, 11, 13, 17, 19];
    const result = random.prime();
    expect(primes).toContain(result);
   });
});

describe("random.primes", () => {
  test("returns n distinct primes", () => {
    const result = random.primes(4);
    expect(result.length).toBe(4);
    const seen = new Set(result);
    expect(seen.size).toBe(4);
   });

  test("all returned values are primes", () => {
    const knownPrimes = [2, 3, 5, 7, 11, 13, 17, 19];
    const result = random.primes(5);
    for (const p of result) {
      expect(knownPrimes).toContain(p);
     }
   });

  test("throws for n out of range", () => {
    expect(() => random.primes(0)).toThrow(RangeError);
    expect(() => random.primes(9)).toThrow(RangeError);
   });

  test("maximum n returns all primes", () => {
    const result = random.primes(8);
    expect(result.length).toBe(8);
   });
});

describe("random.op", () => {
  test("returns one of the provided ops", () => {
    const ops = ["add", "sub", "mul", "div", "pow"] as const;
    const result = random.op(ops);
    expect(ops).toContain(result);
   });

  test("returns values from restricted subset", () => {
    const ops = ["add", "sub"] as const;
    for (let i = 0; i < 50; i++) {
      expect(["add", "sub"]).toContain(random.op(ops));
     }
   });
});
