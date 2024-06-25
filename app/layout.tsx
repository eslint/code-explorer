import { sans, mono } from '@/lib/fonts';
import './globals.css';
import { cn } from '@/lib/utils';
import { Navbar } from '@/components/navbar';
import { ThemeProvider } from '@/providers/theme-provider';
import { SourceCode } from '@/components/source-code';
import { tools } from '@/lib/const';
import { Button } from '@/components/ui/button';
import type { Metadata } from 'next';
import type { FC, ReactNode } from 'react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'ESLint Code Explorer',
  description: 'Explore ESLint rules and configurations.',
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
    suppressHydrationWarning
  >
    <body className="flex flex-col h-screen">
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <Navbar />
        <div className="grid grid-cols-2 divide-x border-t h-full">
          <SourceCode />
          <div className="bg-secondary relative flex flex-col">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-1">
                {tools.map(({ name, value }) => (
                  <Button key={value} asChild>
                    <Link href={`/${value}`}>{name}</Link>
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
      </ThemeProvider>
    </body>
  </html>
);

export default RootLayout;
