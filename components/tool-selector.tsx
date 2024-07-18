import { useExplorer } from '@/hooks/use-explorer';
import { tools } from '@/lib/tools';
import { Button } from './ui/button';
import type { FC } from 'react';

export const ToolSelector: FC = () => {
  const { tool, language, setTool } = useExplorer();

  const availableTools = language === 'json' ? [tools[0]] : tools;

  return (
    <div className="flex items-center gap-1">
      {availableTools.map(({ name, value }) => (
        <Button
          key={value}
          variant={value === tool ? 'outline' : 'ghost'}
          className={
            value === tool
              ? ''
              : 'border border-transparent text-muted-foreground'
          }
          onClick={() => setTool(value as typeof tool)}
        >
          {name}
        </Button>
      ))}
    </div>
  );
};
