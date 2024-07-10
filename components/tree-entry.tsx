import { MinusSquareIcon, PlusSquareIcon } from 'lucide-react';
import { useState } from 'react';
import { renderValue } from '@/lib/render-value';
import type { FC } from 'react';

type TreeEntryProperties = {
  readonly data: [string, unknown];
};

const sanitizeValue = (value: unknown): unknown => {
  if (value && typeof value === 'object') {
    if (Array.isArray(value)) {
      return value.map(sanitizeValue);
    }

    if (value.constructor.name === 'GlobalScope') {
      return 'GlobalScope';
    }

    if (value.constructor.name === 'Reference') {
      return 'Reference';
    }

    if (value.constructor.name === 'FunctionScope') {
      return 'FunctionScope';
    }

    if (value.constructor.name === 'BlockScope') {
      return 'BlockScope';
    }

    const sanitizedObject: Record<string, unknown> = {};

    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        // @ts-expect-error - We know that value is an object
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const newValue = value[key];
        sanitizedObject[key] = sanitizeValue(newValue);
      }
    }

    return sanitizedObject;
  }

  return value;
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
      {open ? (
        <pre className="ml-8 max-h-44 bg-card border overflow-auto rounded-lg p-3">
          {JSON.stringify(sanitizeValue(value), null, 2)}
        </pre>
      ) : null}
    </>
  );
};
