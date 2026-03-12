// @ts-check

import { operation } from "./ast.js";

/**
 * Picks a random element from a non-empty array.
 *
 * @template T - The type of elements in the array
 * @param {[T, ...T[]]} values - A non-empty array to sample from
 * @returns {T} A randomly selected element from the array
 * @throws {Error} If the array is empty
 *
 * @example
 * const numbers = [1, 2, 3, 4, 5];
 * const randomNum = sample(numbers);
 *
 * @example
 * const fruits = ['apple', 'banana', 'orange'];
 * const randomFruit = sample(fruits);
 */
export function sample(values) {
  if (values.length === 0) {
    throw new Error("Cannot sample from an empty array");
  }
  const index = Math.floor(Math.random() * values.length);
  return /** @type {T} */ (values[index]);
}

/**
 * @type {[number, ...number[]]}
 */
const primes = [2, 3, 5, 7, 11, 13, 17, 19];

export const random = {
  int(min = 0, max = 10) {
    return min + Math.floor(Math.random() * (max - min));
  },
  prime() {
    return sample(primes);
  },
  primes(/** @type {number} */ n) {
    if (!Number.isSafeInteger(n) || n < 1 || n > primes.length)
      throw new RangeError();
    let shuffled = shuffle(primes);
    let values = [];
    let i = 0;
    while (i++ < Math.min(n, primes.length)) {
      values.push(/** @type {number} */ (shuffled.pop()));
    }
    return values;
  },
  op(/** @type {[BinaryOp, ...BinaryOp[]]} */ ops) {
    return sample(
      /** @type {[BinaryOp]} */ (
        Object.keys(operation).filter((op) =>
          ops.includes(/** @type {BinaryOp} */ (op)),
        )
      ),
    );
  },
};

/**
 * Shuffles an array using the Fisher-Yates algorithm.
 * @template T
 * @param {T[]} array - The array to shuffle
 * @returns {T[]} A new shuffled array
 */
function shuffle(array) {
  const copy = [...array];

  let currentIndex = copy.length;
  let randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    // @ts-expect-error (unsafe indexed access)
    [copy[currentIndex], copy[randomIndex]] = [
      copy[randomIndex],
      copy[currentIndex],
    ];
  }

  return copy;
}
