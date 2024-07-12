import { parse } from '@humanwhocodes/momoa';
import { Accordion } from '@/components/ui/accordion';
import { Editor } from '@/components/editor';
import { useExplorer } from '@/hooks/use-explorer';
import { JsonAstTreeItem } from './json-ast-tree-item';
import type { FC } from 'react';

export const JsonAst: FC = () => {
  const explorer = useExplorer();
  let ast = '';
  let tree: ReturnType<typeof parse> | null = null;

  try {
    tree = parse(explorer.code, {
      mode: explorer.jsonMode,
      ranges: true,
      tokens: true,
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
        <JsonAstTreeItem data={tree} index={-1} />
      </Accordion>
    );
  }

  return <Editor defaultLanguage="json" value={ast} />;
};
