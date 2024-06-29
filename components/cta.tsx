import { ExternalLinkIcon } from 'lucide-react';
import { Button } from './ui/button';
import type { FC } from 'react';

export const CallToAction: FC = () => (
  <div className="light">
    <Button asChild size="sm">
      <a href="https://eslint.org/" target="_blank" rel="noreferrer">
        <span className="hidden sm:block">Get Started</span>
        <span className="sm:hidden">
          <ExternalLinkIcon size={16} />
        </span>
      </a>
    </Button>
  </div>
);
