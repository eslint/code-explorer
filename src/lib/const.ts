import {
  AlignLeftIcon,
  CodeIcon,
  GitGraphIcon,
  LayersIcon,
  ListIcon,
} from 'lucide-react';
import JavaScript from './languages/javascript.svg';
import ESLint from './languages/eslint.svg';
import JSON from './languages/json.svg';
import type { StaticImageData } from 'next/image';
import type { SourceType, Version } from '@/hooks/use-explorer';

export const languages = [
  {
    value: 'javascript',
    label: 'JavaScript',
    icon: JavaScript as StaticImageData,
  },
  {
    value: 'json',
    label: 'JSON',
    icon: JSON as StaticImageData,
  },
];

export const parsers = [
  {
    value: 'espree',
    label: 'Espree',
    icon: ESLint as StaticImageData,
  },
];

export const sourceTypes: {
  value: SourceType;
  label: string;
}[] = [
  {
    value: 'commonjs',
    label: 'CommonJS',
  },
  {
    value: 'module',
    label: 'Module',
  },
  {
    value: 'script',
    label: 'Script',
  },
];

export const versions: {
  value: Version;
  label: string;
}[] = [
  {
    value: 3,
    label: '3',
  },
  {
    value: 5,
    label: '5',
  },
  {
    value: 6,
    label: '6',
  },
  {
    value: 7,
    label: '7',
  },
  {
    value: 8,
    label: '8',
  },
  {
    value: 9,
    label: '9',
  },
  {
    value: 10,
    label: '10',
  },
  {
    value: 11,
    label: '11',
  },
  {
    value: 12,
    label: '12',
  },
  {
    value: 13,
    label: '13',
  },
  {
    value: 14,
    label: '14',
  },
  {
    value: 15,
    label: '15',
  },
  {
    value: 2015,
    label: '2015',
  },
  {
    value: 2016,
    label: '2016',
  },
  {
    value: 2017,
    label: '2017',
  },
  {
    value: 2018,
    label: '2018',
  },
  {
    value: 2019,
    label: '2019',
  },
  {
    value: 2020,
    label: '2020',
  },
  {
    value: 2021,
    label: '2021',
  },
  {
    value: 2022,
    label: '2022',
  },
  {
    value: 2023,
    label: '2023',
  },
  {
    value: 2024,
    label: '2024',
  },
  {
    value: 'latest',
    label: 'Latest',
  },
];

export const jsonModes = [
  {
    value: 'json',
    label: 'JSON',
  },
  {
    value: 'jsonc',
    label: 'JSONC',
  },
];

export const astViewOptions = [
  {
    value: 'tree',
    label: 'Tree',
    icon: ListIcon,
  },
  {
    value: 'json',
    label: 'JSON',
    icon: CodeIcon,
  },
];

export const scopeViewOptions = [
  {
    value: 'flat',
    label: 'Flat',
    icon: AlignLeftIcon,
  },
  {
    value: 'nested',
    label: 'Nested',
    icon: LayersIcon,
  },
];

export const pathViewOptions = [
  {
    value: 'code',
    label: 'Code',
    icon: CodeIcon,
  },
  {
    value: 'graph',
    label: 'Graph',
    icon: GitGraphIcon,
  },
];
