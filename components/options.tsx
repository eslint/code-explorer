/* eslint-disable react/jsx-handler-names */
'use client';

import Image from 'next/image';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

import { useExplorer } from '@/hooks/use-explorer';
import { languages, parsers, sourceTypes, versions } from '@/lib/const';
import { Button } from './ui/button';
import { Label } from './ui/label';
import type { FC } from 'react';

export const Options: FC = () => {
  const options = useExplorer();

  const currentLanguage = languages.find(
    (language) => language.value === options.language
  );

  if (!currentLanguage) {
    return null;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center gap-1.5">
          <Image
            src={currentLanguage.icon}
            alt={currentLanguage.label}
            width={16}
            height={16}
            className="w-4 h-4"
          />
          <span>{currentLanguage.label}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="space-y-4 w-[372px]">
        <div className="space-y-1.5">
          <Label htmlFor="language">Language</Label>
          <Select value={options.language} onValueChange={options.setLanguage}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((language) => (
                <SelectItem key={language.value} value={language.value}>
                  <div className="flex items-center gap-1.5">
                    <Image
                      src={language.icon}
                      alt={language.label}
                      width={16}
                      height={16}
                      className="w-4 h-4"
                    />
                    <span>{language.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="parser">Parser</Label>
          <Select value={options.parser} onValueChange={options.setParser}>
            <SelectTrigger className="w-full" disabled>
              <SelectValue placeholder="Parser" />
            </SelectTrigger>
            <SelectContent>
              {parsers.map((parser) => (
                <SelectItem key={parser.value} value={parser.value}>
                  <div className="flex items-center gap-1.5">
                    <Image
                      src={parser.icon}
                      alt={parser.label}
                      width={16}
                      height={16}
                      className="w-4 h-4"
                    />
                    <span>{parser.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="sourceType">Source Type</Label>
          <Select
            value={options.sourceType}
            onValueChange={options.setSourceType}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Source Type" />
            </SelectTrigger>
            <SelectContent>
              {sourceTypes.map((sourceType) => (
                <SelectItem key={sourceType.value} value={sourceType.value}>
                  {sourceType.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="esVersion">ECMAScript Version</Label>
          <Select
            value={String(options.esVersion)}
            onValueChange={options.setEsVersion}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="ECMAScript Version" />
            </SelectTrigger>
            <SelectContent>
              {versions.map((version) => (
                <SelectItem key={version.value} value={String(version.value)}>
                  {version.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-1.5">
          <Switch
            id="jsx"
            checked={options.isJSX}
            onCheckedChange={options.setIsJSX}
          />
          <Label htmlFor="jsx">JSX</Label>
        </div>
      </PopoverContent>
    </Popover>
  );
};
