import { useExplorer } from '@/hooks/use-explorer';
import { tools } from '@/lib/tools';
import { Button } from './ui/button';
import type { FC } from 'react';

export const ToolSelector: FC = () => {
  const explorer = useExplorer();

  return (
    <div className="flex items-center gap-1">
      {tools.map(({ name, value }) => (
        <Button
          key={value}
          variant={value === explorer.tool ? 'outline' : 'ghost'}
          className={
            value === explorer.tool
              ? ''
              : 'border border-transparent text-muted-foreground'
          }
          onClick={() => explorer.setTool(value as typeof explorer.tool)}
        >
          {name}
        </Button>
      ))}
    </div>
  );
};
