import {
  AlignLeftIcon,
  CodeIcon,
  GitGraphIcon,
  LayersIcon,
  ListIcon,
} from 'lucide-react';
import type { SourceType, Version } from '@/hooks/use-explorer';

export const languages = [
  {
    value: 'javascript',
    label: 'JavaScript',
    icon: '/languages/javascript.svg',
  },
  {
    value: 'json',
    label: 'JSON',
    icon: '/languages/json.svg',
  },
];

export const parsers = [
  {
    value: 'espree',
    label: 'Espree',
    icon: '/languages/eslint.svg',
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

export const defaultJavascriptCode = `
/**
 * Type or paste some JavaScript here to learn more about
 * the static analysis that ESLint can do for you.
 * 
 * The three tabs are:
 * 
 * - AST - The Abstract Syntax Tree of the code, which can
 *   be useful to understand the structure of the code. You
 *   can view this structure as JSON or in a tree format.
 * - Scope - The scope structure of the code, which can be
 *   useful to understand how variables are defined and
 *   where they are used.
 * - Code Path - The code path structure of the code, which
 *   can be useful to understand how the code is executed.
 * 
 * You can change the way that the JavaScript code is interpreted
 * by clicking "JavaScript" in the header and selecting different
 * options.
 */

import js from "@eslint/js";

function getConfig() {
    return {
        rules: {
            "prefer-const": "warn"
        }
    };
}

export default [
    ...js.configs.recommended,
    getConfig()
];`;

export const defaultJSONCode = `
/**
 * Type or paste some JSON here to learn more about
 * the static analysis that ESLint can do for you.
 *
 * The tabs are:
 *
 * - AST - The Abstract Syntax Tree of the code, which can
 *   be useful to understand the structure of the code. You
 *   can view this structure as JSON or in a tree format.
 *
 * You can change the way that the JSON code is interpreted
 * by clicking "JSON" in the header and selecting different
 * options.
 *
 * This example is in JSONC mode, which allows comments.
 */

{
    "key1": [true, false, null],
    "key2": {
        "key3": [1, 2, "3", 1e10, 1e-3]
    }
}
`