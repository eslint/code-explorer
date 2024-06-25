import { sans, mono } from '@/lib/fonts';
import './globals.css';
import { cn } from '@/lib/utils';
import { Navbar } from './components/navbar';
import type { Metadata } from 'next';
import type { FC, ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

type RootLayoutProperties = Readonly<{
  children: ReactNode;
}>;

const RootLayout: FC<RootLayoutProperties> = ({ children }) => (
  <html
    lang="en"
    className={cn(
      sans.variable,
      mono.variable,
      'antialiased touch-manipulation font-sans'
    )}
  >
    <body className="flex flex-col h-screen divide-y">
      <Navbar />
      {children}
    </body>
  </html>
);

export default RootLayout;
