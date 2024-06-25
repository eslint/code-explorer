'use client';

import * as espree from 'espree';
import * as eslintScope from 'eslint-scope';
import { useExplorer } from '@/hooks/use-explorer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { FC } from 'react';

export const Scope: FC = () => {
  const explorer = useExplorer();

  const options = {
    ecmaVersion: explorer.esVersion,
    sourceType: explorer.sourceType,
  };

  const ast = espree.parse(explorer.code, { range: true, ...options });
  const scopeManager = eslintScope.analyze(ast, options);

  delete scopeManager.globalScope.variableScope;
  delete scopeManager.globalScope.childScopes;

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="global-scope">
        <AccordionTrigger>0. Global Scope</AccordionTrigger>
        <AccordionContent>
          <pre>{JSON.stringify(scopeManager.globalScope)}</pre>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
