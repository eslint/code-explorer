'use client';

import { useExplorer } from '@/hooks/use-explorer';
import { tools } from '@/lib/tools';
import { Editor } from './editor';
import { ToolSelector } from './tool-selector';
import type { FC } from 'react';

export const Explorer: FC = () => {
  const { tool, code, setCode, language, error } = useExplorer();
  const activeTool = tools.find(({ value }) => value === tool) ?? tools[0];

  return (
    <div className="grid sm:grid-cols-2 divide-x border-t h-full">
      <Editor
        className="h-[30dvh] sm:h-full"
        language={language}
        defaultValue={code}
        onChange={(value) => setCode(value ?? '')}
      />
      {error ? (
        <div className="bg-red-50">
          <pre className="p-4 text-red-700">{error}</pre>
        </div>
      ) : (
        <div className="bg-foreground/5 pb-8 overflow-auto h-[70dvh] sm:h-full relative flex flex-col">
          <div className="flex sm:items-center flex-col sm:flex-row justify-between p-4 gap-2 z-10">
            <ToolSelector />
            <div className="flex items-center gap-1">
              {activeTool.options.map((Option, index) => (
                <Option key={index} />
              ))}
            </div>
          </div>
          <activeTool.component />
        </div>
      )}
    </div>
  );
};
