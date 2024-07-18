'use client';

import * as espree from 'espree';
import * as eslintScope from 'eslint-scope';
import { useEffect, useState } from 'react';
import { useExplorer } from '@/hooks/use-explorer';
import { Accordion } from '@/components/ui/accordion';
import { parseError } from '@/lib/parse-error';
import { ScopeItem } from './scope-item';
import type { FC } from 'react';

export const Scope: FC = () => {
  const { code, esVersion, sourceType, setError, scopeViewMode } =
    useExplorer();
  const [scopeManager, setScopeManager] =
    useState<eslintScope.ScopeManager | null>(null);

  useEffect(() => {
    try {
      const newScope = espree.parse(code, {
        range: true,
        ecmaVersion: esVersion,
        sourceType,
      });

      // eslint-scope types are on DefinitelyTyped and haven't been updated.
      const newScopeManager = eslintScope.analyze(newScope, {
        sourceType: sourceType as never,
        ecmaVersion: esVersion as never,
      });

      setScopeManager(newScopeManager);
      setError(null);
    } catch (error) {
      const message = parseError(error);
      setError(message);
      setScopeManager(null);
    }
  }, [code, esVersion, setError, sourceType]);

  if (!scopeManager) {
    return null;
  }

  return (
    <Accordion
      type="multiple"
      className="px-8 font-mono space-y-3"
      defaultValue={['0-global']}
    >
      {scopeViewMode === 'flat' ? (
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
