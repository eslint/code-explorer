/* eslint-disable @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars-ts, unused-imports/no-unused-vars */
import { ChevronDownSquareIcon } from 'lucide-react';
import { capitalize } from '@/lib/utils';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { renderValue } from '@/lib/render-value';
import { TreeEntry } from '../tree-entry';
import type { FC } from 'react';
import type * as espree from 'espree';

type JavascriptAstTreeItemProperties = {
  readonly index: number;
  readonly data:
    | ReturnType<typeof espree.parse>
    | ReturnType<typeof espree.parse>['body'][number];
};

export const JavascriptAstTreeItem: FC<JavascriptAstTreeItemProperties> = ({
  data,
  index,
}) => {
  const rest =
    'body' in data
      ? Object.fromEntries(
          Object.entries(data).filter(([key]) => key !== 'body')
        )
      : data;

  const body = 'body' in data ? data.body : null;

  return (
    <AccordionItem
      value={`${index}-${data.type}`}
      className="border rounded-lg overflow-hidden"
    >
      <AccordionTrigger className="text-sm bg-muted-foreground/5 px-4 py-3">
        {capitalize(data.type)}
      </AccordionTrigger>
      <AccordionContent className="p-4 border-t">
        <div className="space-y-1">
          {Object.entries(rest).map((item) => (
            <TreeEntry key={item[0]} data={item} />
          ))}
          <div>
            <div className="flex items-center gap-3">
              {body && Array.isArray(body) ? (
                <ChevronDownSquareIcon
                  size={16}
                  className="text-muted-foreground"
                />
              ) : (
                <div className="w-4 h-4" />
              )}
              <span>body</span>
              {renderValue(body).map((part, partIndex) => (
                <span
                  key={partIndex}
                  className={
                    partIndex ? 'text-muted-foreground' : 'text-primary'
                  }
                >
                  {part}
                </span>
              ))}
            </div>
            {body && Array.isArray(body) ? (
              <div className="mt-3 space-y-3 ml-2">
                {body.map((scope, subIndex) => (
                  <JavascriptAstTreeItem
                    key={subIndex}
                    data={scope}
                    index={subIndex}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
