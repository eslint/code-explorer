import { Button } from './ui/button';
import type { FC } from 'react';

export const CallToAction: FC = () => (
  <Button asChild>
    <a href="https://eslint.org/" target="_blank" rel="noreferrer">
      Get Started
    </a>
  </Button>
);
