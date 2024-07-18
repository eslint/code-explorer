import { Explorer } from '@/components/explorer';
import type { Metadata } from 'next';
import type { FC } from 'react';

export const metadata: Metadata = {
  title: 'ESLint Code Explorer',
  description: 'Explore ESLint rules and configurations.',
};

const Page: FC = () => <Explorer />;

export default Page;
