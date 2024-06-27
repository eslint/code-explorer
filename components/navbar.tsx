import Image from 'next/image';
import ESLint from '@/lib/languages/eslint.svg';
import { ModeToggle } from './mode-toggle';
import { Options } from './options';
import { CallToAction } from './cta';
import type { StaticImageData } from 'next/image';
import type { FC } from 'react';

export const Navbar: FC = () => (
  <nav className="border-t-4 border-primary">
    <div className="px-6 py-4 flex items-center justify-between text-xl font-semibold">
      <div className="flex items-center gap-1.5">
        <Image
          src={ESLint as StaticImageData}
          alt="Code Explorer"
          width={32}
          height={32}
        />
        <p>ESLint</p>
        <p className="text-muted-foreground">Code Explorer</p>
      </div>
      <div className="flex items-center gap-2">
        <ModeToggle />
        <Options />
        <CallToAction />
      </div>
    </div>
  </nav>
);
