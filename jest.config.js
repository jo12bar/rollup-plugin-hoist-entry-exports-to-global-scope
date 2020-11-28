/** @typedef {import('ts-jest/dist/types')} */
/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  preset: 'ts-jest/presets/js-with-babel',
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['<rootDir>/.*__tests__/.*fixtures/'],
};
