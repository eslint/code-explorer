import { Ast } from '@/components/ast';
import type { Metadata } from 'next';
import type { FC } from 'react';

export const metadata: Metadata = {
  title: 'AST',
  description: 'AST',
};

const Home: FC = () => <Ast />;

export default Home;
