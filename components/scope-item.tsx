/* eslint-disable @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars-ts, unused-imports/no-unused-vars */
import { capitalize } from '@/lib/utils';
import { useExplorer } from '@/hooks/use-explorer';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import type { Scope } from 'eslint-scope';
import type { FC } from 'react';

type ScopeItemProperties = {
  readonly index: number;
  readonly data: Scope | null;
};

export const ScopeItem: FC<ScopeItemProperties> = ({ data, index }) => {
  const explorer = useExplorer();

  if (!data) {
    return null;
  }

  const {
    variableScope,
    variables,
    references,
    upper,
    childScopes,
    type,
    through,
    implicit,
    ...rest
  } = data;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, unicorn/prefer-structured-clone
  const object = JSON.parse(JSON.stringify(rest)) as Record<string, unknown>;

  return (
    <AccordionItem
      value={`${index}-${type}`}
      className="border rounded-lg overflow-hidden"
    >
      <AccordionTrigger className="text-sm bg-muted-foreground/5 px-4 py-3">
        {index}. {capitalize(type)} Scope
      </AccordionTrigger>
      <AccordionContent className="p-4 border-t">
        <div className="space-y-1">
          {Object.entries(object).map(([key, value]) => (
            <div className="flex items-center gap-3" key={key}>
              <span>{key}</span>
              <span className="text-primary">{String(value)}</span>
            </div>
          ))}
        </div>

        {explorer.scopeViewMode === 'nested' && (
          <div className="mt-3 space-y-3">
            {childScopes.map((scope, subIndex) => (
              <ScopeItem key={subIndex} data={scope} index={subIndex} />
            ))}
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
};
