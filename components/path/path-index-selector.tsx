'use client';

import { useExplorer } from '@/hooks/use-explorer';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { FC } from 'react';

export const PathIndexSelector: FC = () => {
  const explorer = useExplorer();

  const handleChange = (value: string) => {
    explorer.setPathIndex(Number(value));
  };

  return (
    <Select value={String(explorer.pathIndex)} onValueChange={handleChange}>
      <SelectTrigger className="w-[10rem]">
        <SelectValue placeholder="Code Path" />
      </SelectTrigger>
      <SelectContent>
        {Array.from({ length: explorer.pathIndexes }).map((item, index) => (
          <SelectItem key={index} value={String(index)}>
            Code Path {index + 1}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
