import { MinusSquareIcon, PlusSquareIcon } from 'lucide-react';
import { useState } from 'react';
import { renderValue } from '@/lib/render-value';
import type { FC } from 'react';

type AstTreeEntryProperties = {
  readonly data: [string, unknown];
};

export const AstTreeEntry: FC<AstTreeEntryProperties> = ({ data }) => {
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
          {JSON.stringify(value, null, 2)}
        </pre>
      ) : null}
    </>
  );
};
