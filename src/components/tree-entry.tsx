import { MinusSquareIcon, PlusSquareIcon } from 'lucide-react';
import { useState } from 'react';
import { renderValue } from '@/lib/render-value';
// eslint-disable-next-line import/no-cycle
import { ScopeItem } from './scope/scope-item';
import type { Scope } from 'eslint-scope';
import type { FC, ReactNode } from 'react';

type TreeEntryProperties = {
  readonly data: [string, unknown];
};

const sanitizeValue = (value: unknown): ReactNode => {
  if (!value) {
    return null;
  }

  if (Array.isArray(value)) {
    if (typeof value[0] === 'object') {
      return value.map(sanitizeValue);
    }

    return (
      <pre className="ml-8 max-h-44 bg-card border overflow-auto rounded-lg p-3">
        {JSON.stringify(value, null, 2)}
      </pre>
    );
  }

  if (
    value.constructor.name === 'Variable' ||
    value.constructor.name === 'GlobalScope' ||
    value.constructor.name === 'FunctionScope' ||
    value.constructor.name === 'Reference' ||
    value.constructor.name === 'BlockScope' ||
    value.constructor.name === 'Node'
  ) {
    return (
      <div className="mt-3 space-y-3 ml-2">
        <ScopeItem data={value as Scope} index={0} />
      </div>
    );
  }

  return (
    <pre className="ml-8 max-h-44 bg-card border overflow-auto rounded-lg p-3">
      {JSON.stringify(value, null, 2)}
    </pre>
  );
};

export const TreeEntry: FC<TreeEntryProperties> = ({ data }) => {
  const [key, value] = data;
  const [open, setOpen] = useState(false);
  const Icon = open ? MinusSquareIcon : PlusSquareIcon;

  const toggleOpen = () => setOpen(!open);

  return (
    <>
      <div className="flex items-center gap-3">
        {typeof value === 'object' || Array.isArray(value) ? (
          <button onClick={toggleOpen} aria-label="Toggle" type="button">
            <Icon size={16} className="text-muted-foreground" />
          </button>
        ) : (
          <div className="w-4 h-4" />
        )}
        <span>{key}</span>
        {renderValue(value).map((part, partIndex) => (
          <span
            key={partIndex}
            className={partIndex ? 'text-muted-foreground' : 'text-primary'}
          >
            {part}
          </span>
        ))}
      </div>
      {open ? sanitizeValue(value) : null}
    </>
  );
};
