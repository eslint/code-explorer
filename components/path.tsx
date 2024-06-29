/* eslint-disable promise/prefer-await-to-then, github/no-then */
'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useExplorer } from '@/hooks/use-explorer';
import { generateCodePath } from '@/app/actions/generate-code-path';
import { Editor } from './editor';
import type { FC } from 'react';

const Graphviz = dynamic(
  async () =>
    import(
      /* webpackChunkName: "graphviz-react" */
      'graphviz-react'
    ),
  { ssr: false }
);

type ParsedResponse = {
  codePathList: {
    dot: string;
  }[];
};

export const CodePath: FC = () => {
  const explorer = useExplorer();
  const [extracted, setExtracted] = useState<ParsedResponse | null>(null);

  useEffect(() => {
    generateCodePath(explorer.code, explorer.esVersion, explorer.sourceType)
      .then((response) => {
        if ('error' in response) {
          throw new Error(response.error);
        }

        return JSON.parse(response.response) as ParsedResponse;
      })
      .then(setExtracted)
      // eslint-disable-next-line @typescript-eslint/use-unknown-in-catch-callback-variable, no-console
      .catch(console.error);
  }, [explorer.code, explorer.esVersion, explorer.sourceType]);

  if (!extracted) {
    return <pre>Loading...</pre>;
  }

  const code = extracted.codePathList[0].dot;

  if (explorer.pathViewMode === 'code') {
    return <Editor language="txt" value={code} />;
  }

  return <Graphviz dot={code} />;
};
