'use client';

import { useEffect, useState } from 'react';
import { useExplorer } from '@/hooks/use-explorer';
import { generateCodePath } from '@/app/actions/generate-code-path';
import { Editor } from './editor';
import type { FC } from 'react';

export const CodePath: FC = () => {
  const explorer = useExplorer();
  const [extracted, setExtracted] = useState(null);

  useEffect(() => {
    generateCodePath(explorer.code, explorer.esVersion, explorer.sourceType)
      .then(setExtracted)
      .catch(console.error);
  }, [explorer.code, explorer.esVersion, explorer.sourceType]);

  console.log(extracted);

  if (!extracted) {
    return <pre>Loading...</pre>;
  }

  if (extracted.error) {
    return <pre>{extracted.error}</pre>;
  }

  return <Editor value={extracted.response} />;
};
