// @ts-check

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

/**
 * Returns the sign of a fraction.
 *
 * @param {[number, number]} frac - Fraction as [numerator, denominator]
 * @returns {-1 | 0 | 1} -1 if negative, 0 if zero, 1 if positive
 *
 * @example
 * sign([3, 4]);    // 1
 * sign([-3, 4]);   // -1
 * sign([3, -4]);   // -1
 * sign([-3, -4]);  // 1
 * sign([0, 5]);    // 0
 */
export function sign(frac) {
  const [num, den] = frac;

  if (num === 0) return 0;

  // Positive if numerator and denominator have the same sign
  return num > 0 === den > 0 ? 1 : -1;
}

/**
 * Converts a decimal number to a fraction (ratio).
 *
 * @param {number} dec - The decimal number to convert (e.g., 0.75, 0.5)
 * @returns {[number, number]} A fraction object with numerator and denominator in lowest terms.
 *
 * @example
 * decimalToFraction(0.5);   // frac(1, 2)
 * decimalToFraction(0.75);  // frac(3, 4)
 * decimalToFraction(0.333); // frac(333, 1000)
 *
 * @note
 * Repeating decimals are approximated based on floating-point precision.
 * For exact handling of repeating decimals, use a different approach.
 */
export function decimalToFraction(dec) {
  // Handle edge cases
  if (dec === 0) return [0, 1];
  if (Number.isInteger(dec)) return [dec, 1];

  // Count decimal places
  const decimalPlaces = (dec.toString().split(".") || "").length;
  const denominator = Math.pow(10, decimalPlaces);
  let numerator = Math.round(dec * denominator);

  // Simplify by finding GCD
  const divisor = gcd(numerator, denominator);

  const a = numerator / divisor;
  const b = denominator / divisor;

  return [a, b];
}

/**
 * Converts a fraction to its decimal representation.
 *
 * @param {[number, number]} frac - The fraction to convert
 * @returns {number} The decimal representation of the fraction
 *
 * @example
 * fractionToDecimal(frac(1, 2));   // 0.5
 * fractionToDecimal(frac(3, 4));   // 0.75
 * fractionToDecimal(frac(1, 3));   // 0.3333333333333333
 */
export function fractionToDecimal(frac) {
  const [num, den] = frac;
  return num / den;
}

/**
 * Scales a fraction to have a new denominator.
 *
 * @param {[number, number]} fraction - The fraction to scale
 * @param {number} newDenominator - The target denominator (must be a multiple of the current denominator)
 * @returns {[number, number]} A new fraction with the specified denominator
 *
 * @example
 * const f = frac(1, 2);
 * scaleFraction(f, 4); // frac(2, 4)
 * scaleFraction(f, 6); // frac(3, 6)
 *
 * @throws {RangeError} If newDenominator is not a multiple of the current denominator
 */
export function scaleFraction(fraction, newDenominator) {
  const [num, den] = fraction;

  if (newDenominator % den !== 0) {
    throw new RangeError(
      `New denominator ${newDenominator} is not a multiple of current denominator ${den}`,
    );
  }

  const factor = newDenominator / den;
  const scaledNum = num * factor;

  return [scaledNum, newDenominator];
}

/**
 * Calculates the Greatest Common Divisor (GCD) of two numbers using the Euclidean algorithm.
 *
 * @param {number} a - The first number
 * @param {number} b - The second number
 * @returns {number} The greatest common divisor of a and b
 *
 * @example
 * gcd(48, 18);  // 6
 * gcd(100, 50); // 50
 * gcd(17, 5);   // 1
 */
export function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

/**
 * Calculates the Least Common Multiple (LCM) of two numbers.
 *
 * @param {number} a - The first number
 * @param {number} b - The second number
 * @returns {number} The least common multiple of a and b
 *
 * @example
 * lcm(4, 6);   // 12
 * lcm(3, 5);   // 15
 * lcm(12, 18); // 36
 */
export function lcm(a, b) {
  return Math.abs(a * b) / gcd(a, b);
}

/**
 * Simplifies a fraction to its lowest terms.
 *
 * @param {[number, number]} frac - Fraction as [numerator, denominator]
 * @returns {[number, number]} The simplified fraction in lowest terms
 *
 * @example
 * simplifyFraction([4, 8]);   // [1, 2]
 * simplifyFraction([6, 9]);   // [2, 3]
 * simplifyFraction([7, 11]);  // [7, 11] (already simplified)
 * simplifyFraction([0, 5]);   // [0, 1]
 */
export function simplifyFraction(frac) {
  let [num, den] = frac;

  // Find GCD and divide both by it
  const divisor = gcd(num, den);
  num /= divisor;
  den /= divisor;

  return [num, den];
}

/**
 * Adds two fractions and returns the simplified result.
 *
 * @param {[number, number]} frac1 - First fraction as [numerator, denominator]
 * @param {[number, number]} frac2 - Second fraction as [numerator, denominator]
 * @returns {[number, number]} The simplified sum as [numerator, denominator]
 *
 * @example
 * addFractions([1, 2], [1, 4]); // [3, 4]
 * addFractions([1, 3], [1, 3]); // [2, 3]
 * addFractions([2, 6], [1, 3]); // [2, 3] (simplified from [4, 6])
 */
export function addFractions(frac1, frac2) {
  const [num1, den1] = frac1;
  const [num2, den2] = frac2;

  // Find common denominator using LCM
  const commonDen = lcm(den1, den2);

  // Convert to common denominator and add
  const numerator = num1 * (commonDen / den1) + num2 * (commonDen / den2);
  let denominator = commonDen;

  // Simplify
  const divisor = gcd(numerator, denominator);
  return [numerator / divisor, denominator / divisor];
}

/**
 * Subtracts two fractions and returns the simplified result.
 *
 * @param {[number, number]} frac1 - First fraction as [numerator, denominator]
 * @param {[number, number]} frac2 - Second fraction as [numerator, denominator]
 * @returns {[number, number]} The simplified difference as [numerator, denominator]
 *
 * @example
 * subtractFractions([3, 4], [1, 4]); // [1, 2]
 * subtractFractions([1, 2], [1, 3]); // [1, 6]
 * subtractFractions([5, 6], [1, 3]); // [1, 2] (simplified from [3, 6])
 */
export function subtractFractions(frac1, frac2) {
  const [num1, den1] = frac1;
  const [num2, den2] = frac2;

  // Find common denominator using LCM
  const commonDen = lcm(den1, den2);

  // Convert to common denominator and subtract
  const numerator = num1 * (commonDen / den1) - num2 * (commonDen / den2);
  let denominator = commonDen;

  // Simplify
  const divisor = gcd(numerator, denominator);
  return [numerator / divisor, denominator / divisor];
}

/**
 * Simplifies two fractions by first reducing each to lowest terms,
 * then canceling common factors across numerators and denominators.
 *
 * @param {[number, number]} frac1 - First fraction as [numerator, denominator]
 * @param {[number, number]} frac2 - Second fraction as [numerator, denominator]
 * @returns {[[number, number], [number, number]]} Two simplified fractions after full cancellation
 *
 * @example
 * simplifyBeforeMultiplication([4, 8], [6, 9]);
 * // → [[1, 2], [2, 3]] (first simplify each: [1,2] and [2,3], then no cross-cancellation)
 *
 * simplifyBeforeMultiplication([6, 8], [4, 9]);
 * // → [[3, 2], [1, 9]] (simplify: [3,4] and [4,9] → then cancel 4 across → [3,2] and [1,9])
 */
export function simplifyBeforeMultiplication(frac1, frac2) {
  let [num1, den1] = frac1;
  let [num2, den2] = frac2;

  // Step 1: Simplify each fraction individually
  const gcd1 = gcd(num1, den1);
  num1 /= gcd1;
  den1 /= gcd1;

  const gcd2 = gcd(num2, den2);
  num2 /= gcd2;
  den2 /= gcd2;

  // Step 2: Cross-cancel between fractions
  const crossGcd1 = gcd(num1, den2);
  num1 /= crossGcd1;
  den2 /= crossGcd1;

  const crossGcd2 = gcd(num2, den1);
  num2 /= crossGcd2;
  den1 /= crossGcd2;

  return [
    [num1, den1],
    [num2, den2],
  ];
}

/**
 * Multiplies two fractions and returns the simplified result.
 *
 * @param {[number, number]} frac1 - First fraction as [numerator, denominator]
 * @param {[number, number]} frac2 - Second fraction as [numerator, denominator]
 * @returns {[number, number]} The simplified product as [numerator, denominator]
 *
 * @example
 * multiplyFractions([1, 2], [3, 4]); // [3, 8]
 * multiplyFractions([2, 3], [3, 4]); // [1, 2] (simplified from [6, 12])
 * multiplyFractions([5, 6], [2, 5]); // [1, 3] (simplified from [10, 30])
 */
export function multiplyFractions(frac1, frac2) {
  const [num1, den1] = frac1;
  const [num2, den2] = frac2;

  // Multiply: (a/b) * (c/d) = (a*c) / (b*d)
  let numerator = num1 * num2;
  let denominator = den1 * den2;

  // Simplify by dividing by GCD
  const divisor = gcd(numerator, denominator);
  numerator /= divisor;
  denominator /= divisor;

  return [numerator, denominator];
}
