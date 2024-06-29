import { sans, mono } from '@/lib/fonts';
import './globals.css';
import { cn } from '@/lib/utils';
import { Navbar } from '@/components/navbar';
import { ThemeProvider } from '@/providers/theme-provider';
import type { Metadata } from 'next';
import type { FC, ReactNode } from 'react';

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
        <div className="h-full overflow-hidden">{children}</div>
      </ThemeProvider>
    </body>
  </html>
);

export default RootLayout;
