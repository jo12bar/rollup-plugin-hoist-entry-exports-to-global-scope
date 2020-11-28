import json from '@rollup/plugin-json';
import typescript from 'rollup-plugin-typescript2';

import pkg from './package.json';
import tsconfig from './tsconfig.json';

const external = Object.keys(pkg.dependencies);

export default {
  input: 'src/index.ts',
  plugins: [
    json(),
    typescript({
      tsconfig: 'tsconfig.json',
      useTsconfigDeclarationDir: true,
      tsconfigOverride: {
        exclude: [...tsconfig.exclude, '**/*.test.ts', 'src/**/__tests__/**/*'],
      },
    }),
  ],
  external,
  output: [
    { format: 'cjs', file: pkg.main, exports: 'auto' },
    { format: 'esm', file: pkg.module },
  ],
};
