'use client';

import * as espree from 'espree';
import { useExplorer } from '@/hooks/use-explorer';
import { Editor } from './editor';
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

  if (explorer.astViewMode === 'tree') {
    return (
      <div className="text-center text-red-500">
        Tree view is not yet implemented
      </div>
    );
  }

  return <Editor defaultLanguage="json" value={ast} />;
};
