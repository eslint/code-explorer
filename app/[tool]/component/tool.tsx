'use client';

import { usePathname } from 'next/navigation';
import { tools } from '@/lib/const';
import type { FC } from 'react';

export const Tool: FC = () => {
  const pathname = usePathname();
  const tool = tools.find(({ value }) => value === pathname);

  if (!tool) {
    return null;
  }

  return <tool.component />;
};
