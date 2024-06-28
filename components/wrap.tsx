'use client';

import { WrapTextIcon } from 'lucide-react';
import { useExplorer } from '@/hooks/use-explorer';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import type { FC } from 'react';

export const Wrap: FC = () => {
  const explorer = useExplorer();

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
