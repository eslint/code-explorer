import {
  Space_Grotesk as createSans,
  Space_Mono as createMono,
} from 'next/font/google';

export const sans = createSans({
  weight: 'variable',
  display: 'swap',
  style: 'normal',
  variable: '--font-sans',
  subsets: ['latin'],
});

export const mono = createMono({
  weight: '400',
  display: 'swap',
  style: 'normal',
  variable: '--font-mono',
  subsets: ['latin'],
});
