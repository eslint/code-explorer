'use client';

import { Editor } from '@monaco-editor/react';
import { useTheme } from 'next-themes';
import { useExplorer } from '@/hooks/use-explorer';
import type { FC } from 'react';

export const SourceCode: FC = () => {
  const explorer = useExplorer();
  const { resolvedTheme } = useTheme();

  return (
    <Editor
      height="100%"
      language={explorer.language}
      defaultValue={explorer.code}
      onChange={(value) => explorer.setCode(value ?? '')}
      theme={resolvedTheme === 'dark' ? 'vs-dark' : 'light'}
      options={{
        minimap: {
          enabled: false,
        },
      }}
    />
  );
};
