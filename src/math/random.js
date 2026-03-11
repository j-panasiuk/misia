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

export const random = {
  int(min = 0, max = 10) {
    return min + Math.floor(Math.random() * (max - min));
  },
  prime() {
    return sample([2, 3, 5, 7, 11, 13, 17, 19]);
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
