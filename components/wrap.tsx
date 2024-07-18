'use client';

import { WrapTextIcon } from 'lucide-react';
import { useExplorer } from '@/hooks/use-explorer';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import type { FC } from 'react';

export const Wrap: FC = () => {
  const { tool, astViewMode, pathViewMode, setWrap, wrap } = useExplorer();

  if (tool === 'ast' && astViewMode !== 'json') {
    return null;
  }

  if (tool === 'path' && pathViewMode !== 'code') {
    return null;
  }

  return (
    <Button
      onClick={() => setWrap(!wrap)}
      variant={wrap ? 'outline' : 'ghost'}
      className={cn(
        'flex items-center gap-2',
        !wrap && 'text-muted-foreground border border-transparent'
      )}
    >
      <WrapTextIcon size={16} />
      <span>Wrap</span>
    </Button>
  );
};
