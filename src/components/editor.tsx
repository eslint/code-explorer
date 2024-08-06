'use client';

import { Editor as MonacoEditor } from '@monaco-editor/react';
import { useExplorer } from '@/hooks/use-explorer';
import type { ComponentProps, FC } from 'react';

type EditorProperties = ComponentProps<typeof MonacoEditor> & {
  readOnly?: boolean;
};

export const Editor: FC<EditorProperties> = ({ readOnly, ...properties }) => {
  const { theme = "system" } = useExplorer();
  const explorer = useExplorer();
  console.log({properties});
  console.log(readOnly);

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
      {...properties}
    />
  );
};
