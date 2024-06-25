import type { FC } from 'react';

export const Navbar: FC = () => (
  <nav className="border-t-4">
    <div className="px-6 py-4 flex items-center justify-between">
      <p>ESlint Code Explorer</p>
      <div className="flex items-center gap-2">
        <p>Mode Toggle</p>
        <p>Options</p>
        <a href="https://eslint.org/" target="_blank" rel="noreferrer">
          Get Started
        </a>
      </div>
    </div>
  </nav>
);
