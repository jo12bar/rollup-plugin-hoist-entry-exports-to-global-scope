import json from '@rollup/plugin-json';
import typescript from 'rollup-plugin-typescript2';

import pkg from './package.json';

const external = Object.keys(pkg.dependencies);

export default {
  input: 'src/index.ts',
  plugins: [
    json(),
    typescript({ tsconfig: 'tsconfig.json', useTsconfigDeclarationDir: true }),
  ],
  external,
  output: [
    { format: 'cjs', file: pkg.main, exports: 'auto' },
    { format: 'esm', file: pkg.module },
  ],
};
