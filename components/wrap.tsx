'use client';

import { WrapTextIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useExplorer } from '@/hooks/use-explorer';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import type { FC } from 'react';

export const Wrap: FC = () => {
  const explorer = useExplorer();
  const pathname = usePathname();

  if (pathname === '/' && explorer.astViewMode !== 'json') {
    return null;
  }

  if (pathname === '/path' && explorer.pathViewMode !== 'code') {
    return null;
  }

  return (
    <Button
      onClick={() => explorer.setWrap(!explorer.wrap)}
      variant={explorer.wrap ? 'outline' : 'ghost'}
      className={cn(
        'flex items-center gap-2',
        !explorer.wrap && 'text-muted-foreground border border-transparent'
      )}
    >
      <WrapTextIcon size={16} />
      <span>Wrap</span>
    </Button>
  );
};
