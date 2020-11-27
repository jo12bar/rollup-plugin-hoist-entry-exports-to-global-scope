/* eslint-disable @typescript-eslint/no-unsafe-assignment */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
  env: {
    es2017: true,
    node: true,
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:eslint-comments/recommended',
    'prettier',
    'prettier/@typescript-eslint',
  ],
  rules: {
    'eslint-comments/no-unused-disable': 'error',
    '@typescript-eslint/no-namespace': 'off',
  },
};
/* eslint-enable @typescript-eslint/no-unsafe-assignment */
