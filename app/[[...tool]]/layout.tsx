import Link from 'next/link';
import { SourceCode } from '@/components/source-code';
import { Button } from '@/components/ui/button';
import { tools } from '@/lib/const';
import type { FC, ReactNode } from 'react';

type ToolLayoutProperties = Readonly<{
  children: ReactNode;
  params: {
    tool?: string;
  };
}>;

const ToolLayout: FC<ToolLayoutProperties> = ({ children, params }) => (
  <div className="grid grid-cols-2 divide-x border-t h-full">
    <SourceCode />
    <div className="bg-secondary relative flex flex-col">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-1">
          {tools.map(({ name, value, href }) => (
            <Button
              key={value}
              asChild
              variant={href === `/${params.tool ?? ''}` ? 'outline' : 'ghost'}
              className={
                href === `/${params.tool ?? ''}`
                  ? ''
                  : 'border border-transparent text-muted-foreground'
              }
            >
              <Link href={href}>{name}</Link>
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <p>wrap</p>
          <p>json / tree</p>
        </div>
      </div>
      {children}
    </div>
  </div>
);

export default ToolLayout;
