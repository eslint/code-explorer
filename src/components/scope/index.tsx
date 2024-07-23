'use client';

import * as espree from 'espree';
import * as eslintScope from 'eslint-scope';
import { useExplorer } from '@/hooks/use-explorer';
import { Accordion } from '@/components/ui/accordion';
import { ScopeItem } from './scope-item';
import type { FC } from 'react';
import { parseError } from '@/lib/parse-error';

export const Scope: FC = () => {
  const explorer = useExplorer();
  let ast = {};

  try {
    ast = espree.parse(explorer.code, {
      range: true,
      ecmaVersion: explorer.esVersion,
      sourceType: explorer.sourceType,
      ecmaFeatures: {
        jsx: explorer.isJSX,
      },
    });
  } catch (error) {
    const message = parseError(error);
    return (
      <div className="bg-red-50 -mt-[72px] pt-[72px] h-full">
        <div className="p-4 text-red-700">{message}</div>
      </div>
    );
  }

  // eslint-scope types are on DefinitelyTyped and haven't been updated.
  const scopeManager = eslintScope.analyze(ast, {
    sourceType: explorer.sourceType as never,
    ecmaVersion: explorer.esVersion as never,
  });

  return (
    <Accordion
      type="multiple"
      className="px-8 font-mono space-y-3"
      defaultValue={['0-global']}
    >
      {explorer.scopeViewMode === 'flat' ? (
        <>
          {scopeManager.scopes.map((subScope, index) => (
            <ScopeItem key={index} data={subScope} index={index + 1} />
          ))}
        </>
      ) : (
        <ScopeItem data={scopeManager.globalScope} index={-1} />
      )}
    </Accordion>
  );
};
