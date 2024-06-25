/* eslint-disable react/jsx-handler-names */
'use client';

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

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">{options.language}</Button>
      </PopoverTrigger>
      <PopoverContent className="space-y-4 w-[372px]">
        <div className="space-y-1.5">
          <Label htmlFor="language">Language</Label>
          <Select value={options.language} onValueChange={options.setLanguage}>
            <SelectTrigger className="w-full" disabled>
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((language) => (
                <SelectItem key={language.value} value={language.value}>
                  {language.label}
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
                  {parser.label}
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
            value={options.esVersion}
            onValueChange={options.setEsVersion}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="ECMAScript Version" />
            </SelectTrigger>
            <SelectContent>
              {versions.map((version) => (
                <SelectItem key={version.value} value={version.value}>
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
