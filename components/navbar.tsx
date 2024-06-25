import { Logo } from './logo';
import { ModeToggle } from './mode-toggle';
import { Options } from './options';
import { CallToAction } from './cta';
import type { FC } from 'react';

export const Navbar: FC = () => (
  <nav className="border-t-4 border-primary">
    <div className="px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-1.5">
        <Logo />
        <p className="text-xl font-semibold text-muted-foreground translate-y-px">
          Code Explorer
        </p>
      </div>
      <div className="flex items-center gap-2">
        <ModeToggle />
        <Options />
        <CallToAction />
      </div>
    </div>
  </nav>
);