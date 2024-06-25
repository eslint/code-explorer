'use client';

import Editor from '@monaco-editor/react';
import { useState } from 'react';
import * as espree from 'espree';
import { tools } from '@/lib/const';
import { useExplorer } from '@/hooks/use-explorer';
import { Button } from './ui/button';
import type { FC } from 'react';

export const Explorer: FC = () => {
  const explorer = useExplorer();
  const [tool, setTool] = useState(tools[0].value);

  return (
    <div className="grid grid-cols-2 divide-x h-full">
      <Editor
        height="100%"
        defaultLanguage="javascript"
        value={explorer.code}
        onChange={(value) => explorer.setCode(value ?? '')}
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
        {tool === 'ast' && (
          <Editor
            height="100%"
            defaultLanguage="javascript"
            value={JSON.stringify(
              espree.parse(explorer.code, {
                ecmaVersion: explorer.esVersion,
              }),
              null,
              2
            )}
            options={{
              minimap: {
                enabled: false,
              },
            }}
          />
        )}
      </div>
    </div>
  );
};
