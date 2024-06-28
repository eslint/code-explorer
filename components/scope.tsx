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

  // eslint-disable-next-line unused-imports/no-unused-vars, unused-imports/no-unused-vars-ts, @typescript-eslint/no-unused-vars
  const { variableScope, childScopes, ...rest } = scopeManager.globalScope;

  return (
    <Accordion
      type="single"
      collapsible
      className="p-8"
      defaultValue="global-scope"
    >
      <AccordionItem value="global-scope">
        <AccordionTrigger>0. Global Scope</AccordionTrigger>
        <AccordionContent>
          <pre className="text-wrap">{JSON.stringify(rest)}</pre>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
