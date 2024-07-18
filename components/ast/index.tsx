'use client';

import { useExplorer } from '@/hooks/use-explorer';
import { JavascriptAst } from './javascript-ast';
import { JsonAst } from './json-ast';
import type { FC } from 'react';

export const Ast: FC = () => {
  const { language } = useExplorer();

  if (language === 'json') {
    return <JsonAst />;
  }

  return <JavascriptAst />;
};
