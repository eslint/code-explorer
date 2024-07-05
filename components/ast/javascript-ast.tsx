import * as espree from 'espree';
import { Accordion } from '@/components/ui/accordion';
import { Editor } from '@/components/editor';
import { useExplorer } from '@/hooks/use-explorer';
import { JavascriptAstTreeItemAstTreeItem } from './javascript-ast-tree-item';
import type { FC } from 'react';

export const JavascriptAst: FC = () => {
  const explorer = useExplorer();
  let ast = '';
  let tree: ReturnType<typeof espree.parse> | null = null;

  try {
    tree = espree.parse(explorer.code, {
      ecmaVersion: explorer.esVersion,
      sourceType: explorer.sourceType,
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
        <JavascriptAstTreeItemAstTreeItem data={tree} index={0} />
      </Accordion>
    );
  }

  return <Editor defaultLanguage="json" value={ast} />;
};
