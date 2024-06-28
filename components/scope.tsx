'use client';

import * as espree from 'espree';
import * as eslintScope from 'eslint-scope';
import { useExplorer } from '@/hooks/use-explorer';
import { Accordion } from '@/components/ui/accordion';
import { ScopeItem } from './scope-item';
import type { FC } from 'react';

export const Scope: FC = () => {
  const explorer = useExplorer();

  const ast = espree.parse(explorer.code, {
    range: true,
    ecmaVersion: explorer.esVersion,
    sourceType: explorer.sourceType,
  });

  if (explorer.sourceType === 'commonjs') {
    return (
      <div className="text-center text-red-500">
        CommonJS is not supported by eslint-scope.
      </div>
    );
  }

  if (explorer.esVersion === 'latest') {
    return (
      <div className="text-center text-red-500">
        Latest ECMAScript version is not supported by eslint-scope.
      </div>
    );
  }

  const scopeManager = eslintScope.analyze(ast, {
    sourceType: explorer.sourceType,
    ecmaVersion: explorer.esVersion,
  });

  return (
    <Accordion type="multiple" className="px-8 font-mono space-y-3">
      {explorer.scopeViewMode === 'flat' ? (
        <>
          {scopeManager.scopes.map((scope, index) => (
            <ScopeItem key={index} data={scope} index={index + 1} />
          ))}
        </>
      ) : (
        <ScopeItem data={scopeManager.globalScope} index={0} />
      )}
    </Accordion>
  );
};
