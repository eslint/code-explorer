'use client';

import { useExplorer } from '@/hooks/use-explorer';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { scopeViewOptions } from '@/lib/const';
import { cn } from '@/lib/utils';
import type { FC } from 'react';

export const ScopeViewMode: FC = () => {
  const { scopeViewMode, setScopeViewMode } = useExplorer();

  const handleValueChange = (value: string) => {
    if (!value) {
      return;
    }

    setScopeViewMode(value as 'nested' | 'flat');
  };

  return (
    <ToggleGroup
      type="single"
      value={scopeViewMode}
      onValueChange={handleValueChange}
      className="border rounded-md"
    >
      {scopeViewOptions.map((option) => (
        <ToggleGroupItem
          key={option.value}
          value={option.value}
          className={cn(
            'border -m-px flex items-center gap-1.5',
            option.value === scopeViewMode
              ? '!bg-background'
              : 'border-transparent hover:bg-transparent text-muted-foreground'
          )}
        >
          <option.icon size={16} />
          {option.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
};
