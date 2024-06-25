import { notFound } from 'next/navigation';
import { tools } from '@/lib/const';
import type { FC } from 'react';

type PageProperties = {
  readonly params: {
    tool: string;
  };
};

export const generateMetadata = ({ params }: PageProperties): Metadata => {
  const tool = tools.find(({ value }) => value === params.tool);

  if (!tool) {
    return {};
  }

  return {
    title: tool.name,
  };
};

const Page: FC<PageProperties> = ({ params }) => {
  const tool = tools.find(({ value }) => value === params.tool);

  if (!tool) {
    notFound();
  }

  return <tool.component />;
};

export default Page;
