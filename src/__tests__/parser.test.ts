import * as acorn from 'acorn';
import { promises as fs } from 'fs';
import * as path from 'path';
import { astToExportedNames, ExportedNameType } from '../parser';

async function readFileToString(relativePath: string): Promise<string> {
  const filePath = path.join(__dirname, relativePath);
  const fileBuffer = await fs.readFile(filePath);
  return fileBuffer.toString();
}

function parseToAst(javascriptString: string): acorn.Node {
  return acorn.parse(javascriptString, {
    ecmaVersion: 'latest',
    sourceType: 'module',
  });
}

async function parseFileToAst(relativePath: string): Promise<acorn.Node> {
  return parseToAst(await readFileToString(relativePath));
}

describe('astToExportedNames', () => {
  const declarationTypeExpectedTable: [
    string,
    { name: string; type: ExportedNameType }[]
  ][] = [
    [
      'variables',
      [
        { name: 'foo', type: ExportedNameType.Variable },
        { name: 'spam', type: ExportedNameType.Variable },
        { name: 'context', type: ExportedNameType.Variable },
      ],
    ],
    [
      'functions',
      [
        { name: 'fn1', type: ExportedNameType.Function },
        { name: 'fn2', type: ExportedNameType.Function },
        { name: 'identity', type: ExportedNameType.Function },
      ],
    ],
    [
      'classes',
      [
        { name: 'TestClass1', type: ExportedNameType.Class },
        { name: 'TestClass2', type: ExportedNameType.Class },
      ],
    ],
  ];

  test.each(declarationTypeExpectedTable)(
    'correctly parses a file containing only %s',
    async (declarationType, expected) => {
      const ast = await parseFileToAst(`./fixtures/just-${declarationType}.js`);
      expect(astToExportedNames(ast)).toStrictEqual(expected);
    }
  );

  test('correctly parses a file that imports other things', async () => {
    const ast = await parseFileToAst('./fixtures/importing-things.js');

    expect(astToExportedNames(ast)).toStrictEqual([
      { name: 'CompositeClass', type: ExportedNameType.Class },
    ]);
  });

  test('correctly parses a file containing all types of declarations', async () => {
    const filesToExpectedTable: [
      string,
      { name: string; type: ExportedNameType }[]
    ][] = [];

    for (const [declarationType, expected] of declarationTypeExpectedTable) {
      const fileString = await readFileToString(
        `./fixtures/just-${declarationType}.js`
      );

      filesToExpectedTable.push([fileString, expected]);
    }

    const [concatenatedFileString, expected] = filesToExpectedTable.reduce(
      ([accString, accExpected], [fileString, expected]) => {
        return [
          accString.concat('\n', fileString),
          accExpected.concat(expected),
        ];
      },
      ['', []]
    );

    const ast = parseToAst(concatenatedFileString);

    expect(astToExportedNames(ast)).toStrictEqual(expected);
  });
});
