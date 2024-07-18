import * as espree from 'espree';
import { useEffect, useState } from 'react';
import { Accordion } from '@/components/ui/accordion';
import { Editor } from '@/components/editor';
import { useExplorer } from '@/hooks/use-explorer';
import { parseError } from '@/lib/parse-error';
import { JavascriptAstTreeItem } from './javascript-ast-tree-item';
import type { FC } from 'react';

export const JavascriptAst: FC = () => {
  const { code, esVersion, sourceType, setError, astViewMode } = useExplorer();
  const [ast, setAst] = useState('');
  const [tree, setTree] = useState<ReturnType<typeof espree.parse> | null>(
    null
  );

  useEffect(() => {
    try {
      const newTree = espree.parse(code, {
        ecmaVersion: esVersion,
        sourceType,
      });

      const newAst = JSON.stringify(tree, null, 2);

      setAst(newAst);
      setTree(newTree);
      setError(null);
    } catch (error) {
      const message = parseError(error);
      setError(message);
      setTree(null);
      setAst('');
    }
  }, [code, esVersion, setError, sourceType, tree]);

  if (astViewMode === 'tree') {
    if (tree === null) {
      return null;
    }

    return (
      <Accordion
        type="multiple"
        className="px-8 font-mono space-y-3"
        defaultValue={['0-Program']}
      >
        <JavascriptAstTreeItem data={tree} index={-1} />
      </Accordion>
    );
  }

  return <Editor defaultLanguage="json" value={ast} />;
};
