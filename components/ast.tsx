'use client';

import * as espree from 'espree';
import { useExplorer } from '@/hooks/use-explorer';
import { Editor } from './editor';
import { AstTreeItem } from './ast-tree-item';
import { Accordion } from './ui/accordion';
import type { FC } from 'react';

export const Ast: FC = () => {
  const explorer = useExplorer();
  let ast = '';
  let tree: ReturnType<typeof espree.parse> | null = null;

  try {
    tree = espree.parse(explorer.code, {
      ecmaVersion: explorer.esVersion,
    });

    ast = JSON.stringify(tree, null, 2);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }

  if (explorer.astViewMode === 'tree') {
    if (tree === null) {
      return null;
    }

    return (
      <Accordion
        type="multiple"
        className="px-8 font-mono space-y-3"
        defaultValue={['0-Program']}
      >
        <AstTreeItem data={tree} index={0} />
      </Accordion>
    );
  }

  return <Editor defaultLanguage="json" value={ast} />;
};
