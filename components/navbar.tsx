import { Logo } from './logo';
import { ModeToggle } from './mode-toggle';
import { CallToAction } from './cta';
import type { FC } from 'react';

export const Navbar: FC = () => (
  <nav className="border-t-4 border-primary">
    <div className="px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Logo />
        <p>Code Explorer</p>
      </div>
      <div className="flex items-center gap-2">
        <ModeToggle />
        <p>Options</p>
        <CallToAction />
      </div>
    </div>
  </nav>
);
