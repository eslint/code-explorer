'use client';

import { Editor as MonacoEditor } from '@monaco-editor/react';
import { useExplorer } from '@/hooks/use-explorer';
import { useEffect } from 'react';
import type { ComponentProps, FC } from 'react';
import { useTheme } from './theme-provider';
import type * as monacoEditor from 'monaco-editor';

type EditorProperties = ComponentProps<typeof MonacoEditor> & {
  readOnly?: boolean;
  value?: string;
  onChange?: (value: string) => void;
};

export const Editor: FC<EditorProperties> = ({ readOnly, value, onChange, ...properties }) => {
  const { theme } = useTheme();
  const { wrap, jsonMode } = useExplorer();

  useEffect(() => {
    const monaco = (window as any).monaco as typeof monacoEditor;
    if (monaco) {
      monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
        validate: true,
        allowComments: jsonMode === 'jsonc',
      });
    }
  }, [jsonMode]);

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

        monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
          validate: true,
          allowComments: jsonMode === 'jsonc',
        });
      }}
      options={{
        minimap: {
          enabled: false,
        },
        wordWrap: wrap ? 'on' : 'off',
        readOnly: readOnly ?? false,
      }}
      theme={theme === 'dark' ? 'eslint-dark' : 'eslint-light'}
      value={value}
      {...properties}
      onChange={onChange}
    />
  );
};
