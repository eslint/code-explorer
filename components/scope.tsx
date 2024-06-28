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
      className="px-8 font-mono"
      defaultValue="global-scope"
    >
      <AccordionItem
        value="global-scope"
        className="border rounded-lg overflow-hidden"
      >
        <AccordionTrigger className="text-sm bg-muted-foreground/5 px-4 py-3">
          0. Global Scope
        </AccordionTrigger>
        <AccordionContent className="space-y-1 p-4 border-t">
          {/* eslint-disable-next-line @typescript-eslint/no-unsafe-argument, unicorn/prefer-structured-clone */}
          {Object.entries(JSON.parse(JSON.stringify(rest))).map(
            ([key, value]) => (
              <div className="flex items-center gap-3" key={key}>
                <span>{key}</span>
                <span className="text-primary">{String(value)}</span>
              </div>
            )
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
