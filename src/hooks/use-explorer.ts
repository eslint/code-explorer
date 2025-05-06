import { create } from "zustand";
import {
	devtools,
	persist,
	StateStorage,
	createJSONStorage,
} from "zustand/middleware";
import type { Options } from "espree";
import {
	defaultCode,
	defaultJsOptions,
	defaultJsonOptions,
	defaultMarkdownOptions,
	defaultCssOptions,
	defaultPathIndex,
	defaultViewModes,
} from "../lib/const";
export type SourceType = Exclude<Options["sourceType"], undefined>;
export type Version = Exclude<Options["ecmaVersion"], undefined>;
export type Language = "javascript" | "json" | "markdown" | "css";
export type JsonMode = "json" | "jsonc" | "json5";
export type MarkdownMode = "commonmark" | "gfm";
export type MarkdownFrontmatter = "off" | "yaml" | "toml";
export type CssMode = "css";

export type Code = {
	javascript: string;
	json: string;
	markdown: string;
	css: string;
};
export type JsOptions = {
	parser: string;
	sourceType: SourceType;
	esVersion: Version;
	isJSX: boolean;
};

export type JsonOptions = {
	jsonMode: JsonMode;
	allowTrailingCommas: boolean;
};

export type MarkdownOptions = {
	markdownMode: MarkdownMode;
	markdownFrontmatter: MarkdownFrontmatter;
};

export type CssOptions = {
	cssMode: CssMode;
	tolerant: boolean;
};

export type PathIndex = {
	index: number;
	indexes: number;
};

export type EsquerySelector = {
	selector: string;
};

export type ViewModes = {
	astView: "tree" | "json";
	scopeView: "flat" | "nested";
	pathView: "code" | "graph";
};

type ExplorerState = {
	tool: "ast" | "scope" | "path";
	setTool: (tool: ExplorerState["tool"]) => void;

	code: Code;
	setCode: (code: Code) => void;

	language: Language;
	setLanguage: (language: Language) => void;

	jsOptions: JsOptions;
	setJsOptions: (jsOptions: JsOptions) => void;

	jsonOptions: JsonOptions;
	setJsonOptions: (jsonOptions: JsonOptions) => void;

	markdownOptions: MarkdownOptions;
	setMarkdownOptions: (markdownOptions: MarkdownOptions) => void;

	cssOptions: CssOptions;
	setCssOptions: (cssOptions: CssOptions) => void;

	wrap: boolean;
	setWrap: (wrap: boolean) => void;

	viewModes: ViewModes;
	setViewModes: (viewModes: ViewModes) => void;

	pathIndex: PathIndex;
	setPathIndex: (pathIndex: PathIndex) => void;

	esquerySelector?: EsquerySelector;
	setEsquerySelector: (esquerySelector: EsquerySelector) => void;
};

const hashStorage: StateStorage = {
	getItem: (key): string => {
		const searchParams = new URLSearchParams(location.hash.slice(1));
		const storedValue = searchParams.get(key) ?? "";
		return storedValue ? JSON.parse(atob(storedValue)) : "";
	},
	setItem: (key, newValue): void => {
		const searchParams = new URLSearchParams(location.hash.slice(1));
		const encodedValue = btoa(JSON.stringify(newValue));
		searchParams.set(key, encodedValue);
		location.hash = searchParams.toString();
	},
	removeItem: (key): void => {
		const searchParams = new URLSearchParams(location.hash.slice(1));
		searchParams.delete(key);
		location.hash = searchParams.toString();
	},
};

export const useExplorer = create<ExplorerState>()(
	devtools(
		persist(
			persist(
				set => ({
					tool: "ast",
					setTool: tool => set({ tool }),

					code: defaultCode,
					setCode: code => set({ code }),

					language: "javascript",
					setLanguage: language => set({ language }),

					jsOptions: defaultJsOptions,
					setJsOptions: jsOptions => set({ jsOptions }),

					jsonOptions: defaultJsonOptions,
					setJsonOptions: jsonOptions => set({ jsonOptions }),

					cssOptions: defaultCssOptions,
					setCssOptions: cssOptions => set({ cssOptions }),

					markdownOptions: defaultMarkdownOptions,
					setMarkdownOptions: markdownOptions =>
						set({ markdownOptions }),

					wrap: true,
					setWrap: wrap => set({ wrap }),

					viewModes: defaultViewModes,
					setViewModes: viewModes => set({ viewModes }),

					pathIndex: defaultPathIndex,
					setPathIndex: pathIndex => set({ pathIndex }),

					esquerySelector: {
						selector: "",
					},
					setEsquerySelector: esquerySelector =>
						set({ esquerySelector }),
				}),
				{
					name: "eslint-explorer",
					storage: createJSONStorage(() => hashStorage),
				},
			),
			{
				name: "eslint-explorer",
			},
		),
	),
);
