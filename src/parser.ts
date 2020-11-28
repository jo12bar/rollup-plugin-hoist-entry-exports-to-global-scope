import { extractAssignedNames } from '@rollup/pluginutils';
import {
  BaseNode,
  ClassDeclaration,
  Declaration,
  ExportNamedDeclaration,
  FunctionDeclaration,
  VariableDeclaration,
} from 'estree';
import { walk } from 'estree-walker';
import { hasValue } from './util';

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

function isVariableDeclaration(
  declaration?: Declaration
): declaration is VariableDeclaration {
  return hasValue(declaration) && declaration.type === 'VariableDeclaration';
}

function isClassDeclaration(
  declaration?: Declaration
): declaration is ClassDeclaration {
  return hasValue(declaration) && declaration.type === 'ClassDeclaration';
}

export enum ExportedNameType {
  Function,
  Variable,
  Class,
}

export type ExportedName = {
  name: string;
  type: ExportedNameType;
};

export function astToExportedNames(ast: BaseNode): ReadonlyArray<ExportedName> {
  const exportedNames: ExportedName[] = [];

  walk(ast, {
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

  return exportedNames;
}
