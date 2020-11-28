import { hasValue } from '../util';

describe('hasValue', () => {
  test("returns true if passed something that isn't undefined or null", () => {
    expect(hasValue(2)).toBe(true);
    expect(hasValue('foo')).toBe(true);
    expect(hasValue(new Date())).toBe(true);
  });

  test('returns false if passed undefined or null', () => {
    expect(hasValue(undefined)).toBe(false);
    expect(hasValue(null)).toBe(false);
  });
});
