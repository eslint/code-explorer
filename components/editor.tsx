'use client';

import { Editor as MonacoEditor, useMonaco } from '@monaco-editor/react';
import { useTheme } from 'next-themes';
import type { ComponentProps, FC } from 'react';

type EditorProperties = ComponentProps<typeof MonacoEditor>;

export const Editor: FC<EditorProperties> = (properties) => {
  const { resolvedTheme } = useTheme();
  const monaco = useMonaco();

  monaco?.editor.defineTheme('eslint-light', {
    base: 'vs',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': '#FFFFFF00',
    },
  });

  monaco?.editor.defineTheme('eslint-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': '#FFFFFF00',
    },
  });

  return (
    <MonacoEditor
      height="100%"
      options={{
        minimap: {
          enabled: false,
        },
      }}
      theme={resolvedTheme === 'dark' ? 'eslint-dark' : 'eslint-light'}
      {...properties}
    />
  );
};
