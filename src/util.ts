/**
 * Returns true if the passed value is not `undefined` or `null`.
 *
 * Helps TypeScript with type inference.
 * @param val Some value, `undefined`, or `null`.
 * @returns `true` if the value is not `undefined` nor `null`; `false` otherwise.
 */
export function hasValue<T>(val: T | undefined | null): val is T {
  return val !== undefined && val !== null;
}
