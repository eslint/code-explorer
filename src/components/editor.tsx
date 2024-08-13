'use client';

import { Editor as MonacoEditor } from '@monaco-editor/react';
import { useExplorer } from '@/hooks/use-explorer';
import type { ComponentProps, FC } from 'react';
import { useTheme } from './theme-provider';

type EditorProperties = ComponentProps<typeof MonacoEditor> & {
  readOnly?: boolean;
  value?: string;
  onChange?: (value: string) => void;
};

export const Editor: FC<EditorProperties> = ({ readOnly, value, onChange, ...properties }) => {
  const { theme } = useTheme();
  const explorer = useExplorer();

  return (
    <MonacoEditor
      height="100%"
      beforeMount={(monaco) => {
        monaco.editor.defineTheme("eslint-light", {
          base: "vs",
          inherit: true,
          rules: [],
          colors: {
            "editor.background": "#FFFFFF00",
          },
        });

        monaco.editor.defineTheme("eslint-dark", {
          base: "vs-dark",
          inherit: true,
          rules: [],
          colors: {
            "editor.background": "#FFFFFF00",
          },
        });
      }}
      options={{
        minimap: {
          enabled: false,
        },
        wordWrap: explorer.wrap ? 'on' : 'off',
        readOnly: readOnly ?? false,
      }}
      theme={theme === 'dark' ? 'eslint-dark' : 'eslint-light'}
      value={value}
      {...properties}
      onChange={onChange}
    />
  );
};
