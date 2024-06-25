'use client';

import Editor from '@monaco-editor/react';
import { useState } from 'react';
import type { FC } from 'react';

const defaultValue = `// Start coding here!`;

export const Explorer: FC = () => {
  const [value, setValue] = useState<string | undefined>(defaultValue);

  return (
    <div className="grid grid-cols-2 divide-x h-full">
      <Editor
        height="100%"
        defaultLanguage="javascript"
        defaultValue={defaultValue}
        onChange={setValue}
        options={{
          minimap: {
            enabled: false,
          },
        }}
      />
      <div className="bg-secondary">
        <pre>{value}</pre>
      </div>
    </div>
  );
};
