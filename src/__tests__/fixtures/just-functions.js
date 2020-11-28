// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function fn1() {
  return true;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function fn2() {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return this;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function identity(x) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return x;
}
