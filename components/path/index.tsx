/* eslint-disable promise/prefer-await-to-then, github/no-then */
'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useDebouncedEffect } from '@react-hookz/web';
import { useExplorer } from '@/hooks/use-explorer';
import { generateCodePath } from '@/app/actions/generate-code-path';
import { parseError } from '@/lib/parse-error';
import { Editor } from '../editor';
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
  const {
    code,
    esVersion,
    sourceType,
    setPathIndex,
    setPathIndexes,
    pathViewMode,
    pathIndex,
    setError,
  } = useExplorer();
  const [extracted, setExtracted] = useState<ParsedResponse | null>(null);

  useDebouncedEffect(
    () => {
      generateCodePath(code, esVersion, sourceType)
        .then((response) => {
          if ('error' in response) {
            throw new Error(response.error);
          }

          return JSON.parse(response.response) as ParsedResponse;
        })
        .then((newExtracted) => {
          setPathIndexes(newExtracted.codePathList.length);
          setPathIndex(0);
          setError(null);

          return newExtracted;
        })
        .then(setExtracted)
        // eslint-disable-next-line @typescript-eslint/use-unknown-in-catch-callback-variable, no-console, promise/prefer-await-to-callbacks
        .catch((error: unknown) => {
          const message = parseError(error);
          setError(message);
        });
    },
    [code, esVersion, sourceType],
    500
  );

  if (!extracted) {
    return null;
  }

  const extractedCode = extracted.codePathList[pathIndex].dot;

  if (pathViewMode === 'code') {
    return <Editor language="txt" value={extractedCode} />;
  }

  return (
    <>
      <svg
        className="absolute w-full h-full select-none pointer-events-none z-0"
        data-testid="rf__background"
        aria-label="Canvas background"
      >
        <pattern
          id="pattern"
          x="10"
          y="14"
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
          patternTransform="translate(-0.5,-0.5)"
        >
          <circle cx="0.5" cy="0.5" r="0.5" className="fill-muted-foreground" />
        </pattern>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern)" />
      </svg>
      <div className="relative z-10">
        <Graphviz dot={extractedCode} />
      </div>
    </>
  );
};
