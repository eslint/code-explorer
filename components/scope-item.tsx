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

export const ScopeItem: FC<ScopeItemProperties> = ({ data, index }) => {
  const explorer = useExplorer();

  if (!data) {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, unicorn/prefer-structured-clone
  const { childScopes, ...rest } = data;

  return (
    <AccordionItem
      value={`${index}-${data.type}`}
      className="border rounded-lg overflow-hidden"
    >
      <AccordionTrigger className="text-sm bg-muted-foreground/5 px-4 py-3">
        {index}. {capitalize(data.type)}
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
              <span>childScopes</span>
              {renderValue(childScopes).map((part, partIndex) => (
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
            {childScopes.length > 0 && explorer.scopeViewMode === 'nested' ? (
              <div className="mt-3 space-y-3">
                {childScopes.map((scope, subIndex) => (
                  <ScopeItem key={subIndex} data={scope} index={subIndex} />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
