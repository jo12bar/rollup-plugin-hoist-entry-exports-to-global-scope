import { extractAssignedNames } from '@rollup/pluginutils';
import { walk } from 'estree-walker';
import {
  BaseNode,
  ExportNamedDeclaration,
  Declaration,
  FunctionDeclaration,
  VariableDeclaration,
  ClassDeclaration,
} from 'estree';
import { Plugin, ModuleInfo } from 'rollup';

import { name as packageName } from '../package.json';

function hasValue<T>(obj: T | undefined | null): obj is T {
  return obj !== undefined && obj !== null;
}

function isNamedExportDeclaration(
  node?: BaseNode
): node is ExportNamedDeclaration {
  return hasValue(node) && node.type === 'ExportNamedDeclaration';
}

function isFunctionDeclaration(
  declaration?: Declaration
): declaration is FunctionDeclaration {
  return hasValue(declaration) && declaration.type === 'FunctionDeclaration';
}

function isClassDeclaration(
  declaration?: Declaration
): declaration is ClassDeclaration {
  return hasValue(declaration) && declaration.type === 'ClassDeclaration';
}

enum ExportedNameType {
  Function,
  Variable,
  Class,
}

type ExportedName = {
  name: string;
  type: ExportedNameType;
};

function isVariableDeclaration(
  declaration?: Declaration
): declaration is VariableDeclaration {
  return hasValue(declaration) && declaration.type === 'VariableDeclaration';
}

export default function hoistEntryExportsToGlobalScope(
  moduleName: string
): Plugin {
  const exportedNames: ExportedName[] = [];

  return {
    name: packageName,

    moduleParsed(moduleInfo: ModuleInfo): void {
      if (!moduleInfo.isEntry || !moduleInfo.ast) {
        return;
      }

      walk(moduleInfo.ast, {
        enter(node: BaseNode) {
          if (!isNamedExportDeclaration(node)) {
            return;
          }

          const declaration = node.declaration;

          if (!hasValue(declaration)) {
            return;
          }

          if (isFunctionDeclaration(declaration)) {
            // declaration.id is null if the function is part of a 'export default function'
            // statement.
            exportedNames.push({
              name: declaration.id?.name ?? 'default',
              type: ExportedNameType.Function,
            });
          } else if (isClassDeclaration(declaration)) {
            // declaration.id is null if the class is part of a `export default class`
            // statement.
            exportedNames.push({
              name: declaration.id?.name ?? 'default',
              type: ExportedNameType.Class,
            });
          } else if (isVariableDeclaration(declaration)) {
            for (const varDeclarator of declaration.declarations) {
              exportedNames.push(
                ...extractAssignedNames(varDeclarator.id).map((name) => ({
                  name,
                  type: ExportedNameType.Variable,
                }))
              );
            }
          }
        },
      });
    },

    footer(): string {
      const outputStrings: string[] = [];

      for (const exp of exportedNames) {
        if (exp.type === ExportedNameType.Function) {
          outputStrings.push(
            `function ${exp.name}(){` +
              `return ${moduleName}.${exp.name}.apply(null,arguments);` +
              `}`
          );
        } else if (
          exp.type === ExportedNameType.Class ||
          exp.type === ExportedNameType.Variable
        ) {
          outputStrings.push(`var ${exp.name}=${moduleName}.${exp.name};`);
        }
      }

      return outputStrings.join('');
    },
  };
}
