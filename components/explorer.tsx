'use client';

import { useExplorer } from '@/hooks/use-explorer';
import { tools } from '@/lib/tools';
import { Editor } from './editor';
import { ToolSelector } from './tool-selector';
import type { FC } from 'react';

export const Explorer: FC = () => {
  const explorer = useExplorer();
  const tool = tools.find(({ value }) => value === explorer.tool) ?? tools[0];

  return (
    <div className="grid sm:grid-cols-2 divide-x border-t h-full">
      <Editor
        className="h-[30dvh] sm:h-full"
        language={explorer.language}
        defaultValue={explorer.code}
        onChange={(value) => explorer.setCode(value ?? '')}
      />
      <div className="bg-foreground/5 pb-8 overflow-auto h-[70dvh] sm:h-full relative flex flex-col">
        <div className="flex sm:items-center flex-col sm:flex-row justify-between p-4 gap-2 z-10">
          <ToolSelector />
          <div className="flex items-center gap-1">
            {tool.options.map((Option, index) => (
              <Option key={index} />
            ))}
          </div>
        </div>
        <tool.component />
      </div>
    </div>
  );
};
