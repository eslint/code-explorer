import {
	AlignLeftIcon,
	CodeIcon,
	GitGraphIcon,
	LayersIcon,
	ListIcon,
} from "lucide-react";
import type {
	SourceType,
	Version,
	JsOptions,
	JsonOptions,
	MarkdownOptions,
	CssOptions,
	PathIndex,
	ViewModes,
	Code,
} from "@/hooks/use-explorer";

export const languages = [
	{
		value: "javascript",
		label: "JavaScript",
		icon: "/languages/javascript.svg",
	},
	{
		value: "json",
		label: "JSON",
		icon: "/languages/json.svg",
	},
	{
		value: "markdown",
		label: "Markdown",
		icon: "/languages/markdown.svg",
	},
	{
		value: "css",
		label: "CSS",
		icon: "/languages/css.svg",
	},
	{
		value: "html",
		label: "HTML",
		icon: "/languages/html.svg",
	},
];

export const parsers = [
	{
		value: "espree",
		label: "Espree",
		icon: "/languages/eslint.svg",
	},
];

export const sourceTypes: {
	value: SourceType;
	label: string;
}[] = [
	{
		value: "commonjs",
		label: "CommonJS",
	},
	{
		value: "module",
		label: "Module",
	},
	{
		value: "script",
		label: "Script",
	},
];

export const versions: {
	value: Version;
	label: string;
}[] = [
	{
		value: 3,
		label: "3",
	},
	{
		value: 5,
		label: "5",
	},
	{
		value: 6,
		label: "6",
	},
	{
		value: 7,
		label: "7",
	},
	{
		value: 8,
		label: "8",
	},
	{
		value: 9,
		label: "9",
	},
	{
		value: 10,
		label: "10",
	},
	{
		value: 11,
		label: "11",
	},
	{
		value: 12,
		label: "12",
	},
	{
		value: 13,
		label: "13",
	},
	{
		value: 14,
		label: "14",
	},
	{
		value: 15,
		label: "15",
	},
	{
		value: 2015,
		label: "2015",
	},
	{
		value: 2016,
		label: "2016",
	},
	{
		value: 2017,
		label: "2017",
	},
	{
		value: 2018,
		label: "2018",
	},
	{
		value: 2019,
		label: "2019",
	},
	{
		value: 2020,
		label: "2020",
	},
	{
		value: 2021,
		label: "2021",
	},
	{
		value: 2022,
		label: "2022",
	},
	{
		value: 2023,
		label: "2023",
	},
	{
		value: 2024,
		label: "2024",
	},
	{
		value: "latest",
		label: "Latest",
	},
];

export const jsonModes = [
	{
		value: "json",
		label: "json",
	},
	{
		value: "jsonc",
		label: "jsonc",
	},
	{
		value: "json5",
		label: "json5",
	},
];

export const markdownModes = [
	{
		value: "commonmark",
		label: "CommonMark",
	},
	{
		value: "gfm",
		label: "GitHub-Flavored",
	},
];

export const markdownFrontmatters = [
	{
		value: "off",
		label: "Off",
	},
	{
		value: "yaml",
		label: "YAML",
	},
	{
		value: "toml",
		label: "TOML",
	},
];

export const cssModes = [
	{
		value: "css",
		label: "CSS",
	},
];

export const astViewOptions = [
	{
		value: "tree",
		label: "Tree",
		icon: ListIcon,
	},
	{
		value: "json",
		label: "JSON",
		icon: CodeIcon,
	},
];

export const scopeViewOptions = [
	{
		value: "flat",
		label: "Flat",
		icon: AlignLeftIcon,
	},
	{
		value: "nested",
		label: "Nested",
		icon: LayersIcon,
	},
];

export const pathViewOptions = [
	{
		value: "code",
		label: "Code",
		icon: CodeIcon,
	},
	{
		value: "graph",
		label: "Graph",
		icon: GitGraphIcon,
	},
];

export const defaultJsCode = `
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
];`.trim();

export const defaultJsonCode = `
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
}`.trim();

export const defaultMarkdownCode = `
<!--
Type or paste some Markdown here to learn more about
the static analysis that ESLint can do for you.

The tabs are:

- AST - The Abstract Syntax Tree of the code, which can
be useful to understand the structure of the code. You
can view this structure as JSON or in a tree format.

You can change the way that the Markdown code is interpreted
by clicking "Markdown" in the header and selecting different
options.

This example is in CommonMark mode.
-->

# ESLint Markdown Example

This is an example of a Markdown file that can be parsed
by ESLint. Markdown is a simple markup language that is
often used for documentation.

## Features

- Make things *italic*, **bold**, or \`code\`
- Create [links](https://eslint.org)
- Supports HTML <span style="color: red;">elements</span>
- Lists
  - Nested lists

`.trim();

export const defaultCssCode = `
/**
 * Type or paste some CSS here to learn more about
 * the static analysis that ESLint can do for you.
 *
 * The tabs are:
 *
 * - AST - The Abstract Syntax Tree of the code, which can
 *   be useful to understand the structure of the code. You
 *   can view this structure as JSON or in a tree format.
 *
 * You can change the way that the CSS code is interpreted
 * by clicking "CSS" in the header and selecting different
 * options.
 */

@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

body {
	font-family: sans-serif;
}

h1 {
	color: #333;
}

p {
	margin: 1em 0;
}`.trim();

export const defaultHtmlCode = `
<!DOCTYPE html>
<!--
Type or paste some HTML here to learn more about
the static analysis that ESLint can do for you.

The tabs are:

- AST - The Abstract Syntax Tree of the code, which can
be useful to understand the structure of the code. You
can view this structure as JSON or in a tree format.
-->

<html lang="ko">
    <head>
        <meta charset="UTF-8">
        <title>HTML</title>
    </head>
    <body>
        <p>Text</p>
    </body>
</html>
`.trim();

export const defaultCode: Code = {
	javascript: defaultJsCode,
	json: defaultJsonCode,
	markdown: defaultMarkdownCode,
	css: defaultCssCode,
	html: defaultHtmlCode,
};

export const defaultJsOptions: JsOptions = {
	parser: "espree",
	sourceType: "module",
	esVersion: "latest",
	isJSX: true,
};

export const defaultJsonOptions: JsonOptions = {
	jsonMode: "jsonc",
	allowTrailingCommas: false,
};

export const defaultMarkdownOptions: MarkdownOptions = {
	markdownMode: "commonmark",
	markdownFrontmatter: "off",
};

export const defaultCssOptions: CssOptions = {
	cssMode: "css",
	tolerant: false,
};

export const defaultPathIndex: PathIndex = {
	index: 0,
	indexes: 1,
};

export const defaultViewModes: ViewModes = {
	astView: "tree",
	scopeView: "flat",
	pathView: "graph",
};
