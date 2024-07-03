import { notFound } from 'next/navigation';
import Link from 'next/link';
import { tools } from '@/lib/tools';
import { SourceCode } from '@/components/source-code';
import { Button } from '@/components/ui/button';
import type { Metadata } from 'next';
import type { FC } from 'react';

type PageProperties = {
  readonly params: {
    tool?: string;
  };
};

export const generateMetadata = ({ params }: PageProperties): Metadata => {
  const tool = tools.find(({ href }) => href === `/${params.tool ?? ''}`);

  if (!tool) {
    return {};
  }

  return {
    title: `${tool.name} | ESLint Code Explorer`,
    description: `Explore ESLint's ${tool.name.toLowerCase()} in a visual way.`,
  };
};

const Page: FC<PageProperties> = ({ params }) => {
  const tool = tools.find(({ href }) => href === `/${params.tool ?? ''}`);

  if (!tool) {
    notFound();
  }

  return (
    <div className="grid sm:grid-cols-2 divide-x border-t h-full">
      <SourceCode />
      <div className="bg-foreground/5 pb-8 overflow-auto h-[70dvh] sm:h-full relative flex flex-col">
        <div className="flex sm:items-center flex-col sm:flex-row justify-between p-4 gap-2 z-10">
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
            {tool.options.map((Option, index) => (
              <Option key={index} />
            ))}
          </div>
        </div>
        <tool.component />
      </div>
    </div>
  );
};

export default Page;
