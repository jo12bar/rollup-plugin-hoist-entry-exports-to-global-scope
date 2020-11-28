import { Plugin, ModuleInfo } from 'rollup';
import { astToExportedNames, ExportedName, ExportedNameType } from './parser';

import { name as packageName } from '../package.json';

export default function hoistEntryExportsToGlobalScope(
  moduleName: string
): Plugin {
  let exportedNames: ReadonlyArray<ExportedName> = [];

  return {
    name: packageName,

    moduleParsed(moduleInfo: ModuleInfo): void {
      if (!moduleInfo.isEntry || !moduleInfo.ast) {
        return;
      }

      exportedNames = astToExportedNames(moduleInfo.ast);
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
