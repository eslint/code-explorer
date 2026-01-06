import { create } from "zustand";
import {
	devtools,
	persist,
	StateStorage,
	createJSONStorage,
} from "zustand/middleware";
import type { EcmaVersion, Options } from "espree";
import {
	defaultCode,
	defaultJsOptions,
	defaultJsonOptions,
	defaultMarkdownOptions,
	defaultCssOptions,
	defaultHtmlOptions,
	defaultPathIndex,
	defaultViewModes,
} from "../lib/const";

export type SourceType = Exclude<Options["sourceType"], undefined>;
export type Language = "javascript" | "json" | "markdown" | "css" | "html";
export type JsonMode = "json" | "jsonc" | "json5";
export type MarkdownMode = "commonmark" | "gfm";
export type MarkdownFrontmatter = "off" | "yaml" | "toml" | "json";
export type CssMode = "css";
export type TemplateEngineSyntax = "none" | "handlebars" | "twig" | "erb";

export type Code = {
	javascript: string;
	json: string;
	markdown: string;
	css: string;
	html: string;
};
export type JsOptions = {
	parser: string;
	sourceType: SourceType;
	esVersion: EcmaVersion;
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

export type HtmlOptions = {
	templateEngineSyntax: TemplateEngineSyntax;
	frontmatter: boolean;
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

	htmlOptions: HtmlOptions;
	setHtmlOptions: (htmlOptions: HtmlOptions) => void;

	wrap: boolean;
	setWrap: (wrap: boolean) => void;

	viewModes: ViewModes;
	setViewModes: (viewModes: ViewModes) => void;

	pathIndex: PathIndex;
	setPathIndex: (pathIndex: PathIndex) => void;

	esquerySelector?: EsquerySelector;
	setEsquerySelector: (esquerySelector: EsquerySelector) => void;
};

const getHashParams = (): URLSearchParams => {
	return new URLSearchParams(location.hash.slice(1));
};

const hybridStorage: StateStorage = {
	getItem: (key): string => {
		// Priority: URL hash first, then localStorage fallback
		const hashValue = getHashParams().get(key);
		if (hashValue) {
			return JSON.parse(atob(hashValue));
		}

		const localValue = localStorage.getItem(key);
		return localValue || "";
	},
	setItem: (key, newValue): void => {
		const searchParams = getHashParams();
		const encodedValue = btoa(JSON.stringify(newValue));
		searchParams.set(key, encodedValue);
		location.hash = searchParams.toString();

		localStorage.setItem(key, newValue);
	},
	removeItem: (key): void => {
		const searchParams = getHashParams();
		searchParams.delete(key);
		location.hash = searchParams.toString();

		localStorage.removeItem(key);
	},
};

export const useExplorer = create<ExplorerState>()(
	devtools(
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
				setMarkdownOptions: markdownOptions => set({ markdownOptions }),

				htmlOptions: defaultHtmlOptions,
				setHtmlOptions: htmlOptions => set({ htmlOptions }),

				wrap: true,
				setWrap: wrap => set({ wrap }),

				viewModes: defaultViewModes,
				setViewModes: viewModes => set({ viewModes }),

				pathIndex: defaultPathIndex,
				setPathIndex: pathIndex => set({ pathIndex }),

				esquerySelector: {
					selector: "",
				},
				setEsquerySelector: esquerySelector => set({ esquerySelector }),
			}),
			{
				name: "eslint-explorer",
				storage: createJSONStorage(() => hybridStorage),
				onRehydrateStorage: () => state => {
					if (!state) return;

					let needsPatching = false;
					const patchedCode = { ...defaultCode };

					(Object.keys(defaultCode) as (keyof Code)[]).forEach(
						key => {
							if (state.code && key in state.code) {
								patchedCode[key] = state.code[key];
							} else {
								needsPatching = true;
							}
						},
					);

					if (needsPatching) {
						state.setCode(patchedCode);
					}
				},
			},
		),
	),
);
