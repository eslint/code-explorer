'use client';

import { Editor } from '@monaco-editor/react';
import * as espree from 'espree';
import { useExplorer } from '@/hooks/use-explorer';
import type { FC } from 'react';

export const Ast: FC = () => {
  const explorer = useExplorer();
  let ast = '';

  try {
    const tree = espree.parse(explorer.code, {
      ecmaVersion: explorer.esVersion,
    });

    ast = JSON.stringify(tree, null, 2);
  } catch (error) {
    console.error(error);
  }

  return (
    <Editor
      height="100%"
      defaultLanguage="json"
      value={ast}
      options={{
        minimap: {
          enabled: false,
        },
      }}
    />
  );
};
