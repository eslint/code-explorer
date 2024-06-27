'use client';

import { useExplorer } from '@/hooks/use-explorer';
import { Editor } from './editor';
import type { FC } from 'react';

export const SourceCode: FC = () => {
  const explorer = useExplorer();

  return (
    <Editor
      language={explorer.language}
      defaultValue={explorer.code}
      onChange={(value) => explorer.setCode(value ?? '')}
    />
  );
};
