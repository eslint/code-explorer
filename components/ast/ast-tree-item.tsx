/* eslint-disable @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars-ts, unused-imports/no-unused-vars */
import { capitalize } from '@/lib/utils';
import { useExplorer } from '@/hooks/use-explorer';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { FC } from 'react';
import type * as espree from 'espree';

type AstTreeItemProperties = {
  readonly index: number;
  readonly data:
    | ReturnType<typeof espree.parse>
    | ReturnType<typeof espree.parse>['body'][number];
};

const renderValue = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return ['Array', `[${value.length} elements]`];
  }

  if (typeof value === 'object' && value !== null) {
    const keys = Object.keys(value);
    return [
      value.constructor.name,
      keys.length > 3
        ? `{${keys.slice(0, 3).join(', ')}, ...}`
        : `{${keys.join(', ')}}`,
    ];
  }

  if (typeof value === 'boolean') {
    return ['boolean'];
  }

  return [String(value)];
};

export const AstTreeItem: FC<AstTreeItemProperties> = ({ data, index }) => {
  const explorer = useExplorer();

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
          {Object.entries(rest).map(([key, value]) => (
            <div className="flex items-center gap-3" key={key}>
              <span>{key}</span>
              {renderValue(value).map((part, partIndex) => (
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
          ))}
          <div>
            <div className="flex items-center gap-3">
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
            {body &&
            Array.isArray(body) &&
            explorer.scopeViewMode === 'nested' ? (
              <div className="mt-3 space-y-3">
                {body.map((scope, subIndex) => (
                  <AstTreeItem key={subIndex} data={scope} index={subIndex} />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
