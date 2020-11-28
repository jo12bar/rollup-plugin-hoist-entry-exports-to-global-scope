import { rollup, RollupOutput } from 'rollup';
import hoistExports from '../index';
import * as path from 'path';

async function generateUmdAndIifeBundles(
  relativePath: string,
  bundleName: string
): Promise<{ umd: RollupOutput; iife: RollupOutput }> {
  const bundle = await rollup({
    input: path.join(__dirname, relativePath),
    plugins: [hoistExports(bundleName)],
  });

  const umd = await bundle.generate({ name: bundleName, format: 'umd' });
  const iife = await bundle.generate({ name: bundleName, format: 'iife' });

  return { umd, iife };
}

test('generates bindings for variable-only file', async () => {
  const { umd, iife } = await generateUmdAndIifeBundles(
    './fixtures/just-variables.js',
    'JustVariables'
  );

  expect(umd).toMatchSnapshot();
  expect(iife).toMatchSnapshot();
});

test('generates bindings for function-only file', async () => {
  const { umd, iife } = await generateUmdAndIifeBundles(
    './fixtures/just-functions.js',
    'JustFunctions'
  );

  expect(umd).toMatchSnapshot();
  expect(iife).toMatchSnapshot();
});

test('generates bindings for class-only file', async () => {
  const { umd, iife } = await generateUmdAndIifeBundles(
    './fixtures/just-classes.js',
    'JustClasses'
  );

  expect(umd).toMatchSnapshot();
  expect(iife).toMatchSnapshot();
});

test('generates bindings for files that contain imports', async () => {
  const { umd, iife } = await generateUmdAndIifeBundles(
    './fixtures/importing-things.js',
    'ImportingThings'
  );

  expect(umd).toMatchSnapshot();
  expect(iife).toMatchSnapshot();
});
