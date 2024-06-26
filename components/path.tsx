'use client';

import { useExplorer } from '@/hooks/use-explorer';
import type { FC } from 'react';

export const CodePath: FC = () => {
  const explorer = useExplorer();

  return <p>Code Path</p>;
};
