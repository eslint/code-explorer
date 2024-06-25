'use client';

import Editor from '@monaco-editor/react';
import { useState } from 'react';
import { defaultCode, tools } from '@/lib/const';
import { Button } from './ui/button';
import type { FC } from 'react';

export const Explorer: FC = () => {
  const [tool, setTool] = useState(tools[0].value);
  const [code, setCode] = useState<string | undefined>(defaultCode);

  return (
    <div className="grid grid-cols-2 divide-x h-full">
      <Editor
        height="100%"
        defaultLanguage="javascript"
        defaultValue={defaultCode}
        onChange={setCode}
        options={{
          minimap: {
            enabled: false,
          },
        }}
      />
      <div className="bg-secondary relative flex flex-col">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-1">
            {tools.map(({ name, value }) => (
              <Button
                variant={tool === value ? 'outline' : 'ghost'}
                onClick={() => setTool(value)}
                key={value}
                className={
                  tool === value
                    ? ''
                    : 'text-muted-foreground border border-transparent'
                }
              >
                {name}
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-1">
            <p>wrap</p>
            <p>json / tree</p>
          </div>
        </div>
        <pre>{code}</pre>
      </div>
    </div>
  );
};
