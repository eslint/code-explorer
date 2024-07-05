'use client';

import * as espree from 'espree';
import * as eslintScope from 'eslint-scope';
import { useExplorer } from '@/hooks/use-explorer';
import { Accordion } from '@/components/ui/accordion';
import { ScopeItem } from './scope-item';
import type { FC } from 'react';

export const Scope: FC = () => {
  const explorer = useExplorer();
  let scope = {};

  try {
    scope = espree.parse(explorer.code, {
      range: true,
      ecmaVersion: explorer.esVersion,
      sourceType: explorer.sourceType,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }

  const scopeManager = eslintScope.analyze(scope, {
    sourceType: explorer.sourceType as never,
    ecmaVersion: explorer.esVersion as never,
  });

  return (
    <Accordion type="multiple" className="px-8 font-mono space-y-3">
      {explorer.scopeViewMode === 'flat' ? (
        <>
          {scopeManager.scopes.map((subScope, index) => (
            <ScopeItem key={index} data={subScope} index={index + 1} />
          ))}
        </>
      ) : (
        <ScopeItem data={scopeManager.globalScope} index={0} />
      )}
    </Accordion>
  );
};
