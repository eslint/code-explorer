import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { Options } from "espree";
import {
	defaultCode,
	defaultJsOptions,
	defaultJsonOptions,
	defaultMarkdownOptions,
	defaultPathIndex,
	defualtViewModes,
} from "../lib/const";
export type SourceType = Exclude<Options["sourceType"], undefined>;
export type Version = Exclude<Options["ecmaVersion"], undefined>;
export type Language = "javascript" | "json" | "markdown";
export type JsonMode = "json" | "jsonc" | "json5";
export type MarkdownMode = "commonmark" | "gfm";

export type Code = { javascript: string; json: string; markdown: string };
export type JsOptions = {
	parser: string;
	sourceType: SourceType;
	esVersion: Version;
	isJSX: boolean;
};

export type JsonOptions = {
	jsonMode: JsonMode;
};

export type MarkdownOptions = {
	markdownMode: MarkdownMode;
};

export type PathIndex = {
	index: number;
	indexes: number;
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

	wrap: boolean;
	setWrap: (wrap: boolean) => void;

	viewModes: ViewModes;
	setViewModes: (viewModes: ViewModes) => void;

	pathIndex: PathIndex;
	setPathIndex: (pathIndex: PathIndex) => void;
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

				markdownOptions: defaultMarkdownOptions,
				setMarkdownOptions: markdownOptions => set({ markdownOptions }),

				wrap: true,
				setWrap: wrap => set({ wrap }),

				viewModes: defualtViewModes,
				setViewModes: viewModes => set({ viewModes }),

				pathIndex: defaultPathIndex,
				setPathIndex: pathIndex => set({ pathIndex }),
			}),
			{
				name: "eslint-explorer",
			},
		),
	),
);
