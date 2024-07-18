import { parse } from '@humanwhocodes/momoa';
import { useEffect, useState } from 'react';
import { Accordion } from '@/components/ui/accordion';
import { Editor } from '@/components/editor';
import { useExplorer } from '@/hooks/use-explorer';
import { parseError } from '@/lib/parse-error';
import { JsonAstTreeItem } from './json-ast-tree-item';
import type { FC } from 'react';

export const JsonAst: FC = () => {
  const { code, jsonMode, astViewMode, setError } = useExplorer();
  const [ast, setAst] = useState('');
  const [tree, setTree] = useState<ReturnType<typeof parse> | null>(null);

  useEffect(() => {
    try {
      const newTree = parse(code, {
        mode: jsonMode,
        ranges: true,
        tokens: true,
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
  }, [code, jsonMode, setError, tree]);

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
        <JsonAstTreeItem data={tree} index={-1} />
      </Accordion>
    );
  }

  return <Editor defaultLanguage="json" value={ast} />;
};
