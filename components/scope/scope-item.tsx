/* eslint-disable @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars-ts, unused-imports/no-unused-vars */
import { capitalize } from '@/lib/utils';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
// eslint-disable-next-line import/no-cycle
import { TreeEntry } from '../tree-entry';
import type { Scope } from 'eslint-scope';
import type { FC } from 'react';

type ScopeItemProperties = {
  readonly index: number;
  readonly data: Scope | null;
};

export const ScopeItem: FC<ScopeItemProperties> = ({ data, index }) => {
  if (!data) {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, unicorn/prefer-structured-clone

  return (
    <AccordionItem
      value={`${index}-${data.type}`}
      className="border rounded-lg overflow-hidden"
    >
      <AccordionTrigger className="text-sm bg-muted-foreground/5 px-4 py-3">
        {Math.max(index, 0)}. {capitalize(data.type)}
      </AccordionTrigger>
      <AccordionContent className="p-4 border-t">
        <div className="space-y-1">
          {Object.entries(data).map((item) => (
            <TreeEntry key={item[0]} data={item} />
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
