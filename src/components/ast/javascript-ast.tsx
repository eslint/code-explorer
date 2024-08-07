import * as espree from 'espree';
import { Accordion } from '@/components/ui/accordion';
import { Editor } from '@/components/editor';
import { useExplorer } from '@/hooks/use-explorer';
import { JavascriptAstTreeItem } from './javascript-ast-tree-item';
import type { FC } from 'react';
import { parseError } from '@/lib/parse-error';

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
    const message = parseError(error);
    return (
      <div className="bg-red-50 -mt-[72px] pt-[72px] h-full">
        <div className="p-4 text-red-700">{message}</div>
      </div>
    );
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
        <JavascriptAstTreeItem data={tree} index={0} />
      </Accordion>
    );
  }

  return <Editor defaultLanguage="json" value={ast}  readOnly={true}/>;
};
