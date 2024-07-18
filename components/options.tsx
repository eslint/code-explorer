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
import {
  jsonModes,
  languages,
  parsers,
  sourceTypes,
  versions,
} from '@/lib/const';
import { Button } from './ui/button';
import { Label } from './ui/label';
import type { FC } from 'react';

export const Options: FC = () => {
  const {
    language,
    setLanguage,
    tool,
    setTool,
    jsonMode,
    setJsonMode,
    parser,
    setParser,
    sourceType,
    setSourceType,
    esVersion,
    setEsVersion,
    isJSX,
    setIsJSX,
  } = useExplorer();

  const currentLanguage = languages.find(({ value }) => value === language);

  if (!currentLanguage) {
    return null;
  }

  const handleChangeLanguage = (value: string) => {
    setLanguage(value);

    if (value === 'json' && tool !== 'ast') {
      setTool('ast');
    }
  };

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
          <Select value={language} onValueChange={handleChangeLanguage}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map(({ value, icon, label }) => (
                <SelectItem key={value} value={value}>
                  <div className="flex items-center gap-1.5">
                    <Image
                      src={icon}
                      alt={label}
                      width={16}
                      height={16}
                      className="w-4 h-4"
                    />
                    <span>{label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {language === 'json' ? (
          <div className="space-y-1.5">
            <Label htmlFor="jsonMode">Mode</Label>
            <Select value={jsonMode} onValueChange={setJsonMode}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Mode" />
              </SelectTrigger>
              <SelectContent>
                {jsonModes.map((mode) => (
                  <SelectItem key={mode.value} value={mode.value}>
                    {mode.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <>
            <div className="space-y-1.5">
              <Label htmlFor="parser">Parser</Label>
              <Select value={parser} onValueChange={setParser}>
                <SelectTrigger className="w-full" disabled>
                  <SelectValue placeholder="Parser" />
                </SelectTrigger>
                <SelectContent>
                  {parsers.map(({ value, icon, label }) => (
                    <SelectItem key={value} value={value}>
                      <div className="flex items-center gap-1.5">
                        <Image
                          src={icon}
                          alt={label}
                          width={16}
                          height={16}
                          className="w-4 h-4"
                        />
                        <span>{label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="sourceType">Source Type</Label>
              <Select value={sourceType} onValueChange={setSourceType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Source Type" />
                </SelectTrigger>
                <SelectContent>
                  {sourceTypes.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="esVersion">ECMAScript Version</Label>
              <Select value={String(esVersion)} onValueChange={setEsVersion}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="ECMAScript Version" />
                </SelectTrigger>
                <SelectContent>
                  {versions.map((version) => (
                    <SelectItem
                      key={version.value}
                      value={String(version.value)}
                    >
                      {version.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-1.5">
              <Switch id="jsx" checked={isJSX} onCheckedChange={setIsJSX} />
              <Label htmlFor="jsx">JSX</Label>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
};
