import { create } from 'zustand';
import { devtools, persist, StateStorage, createJSONStorage } from 'zustand/middleware';
import type { Options } from 'espree';
import { defaultJsCode, defaultJsonCode } from '../lib/const';

export type SourceType = Exclude<Options['sourceType'], undefined>;
export type Version = Exclude<Options['ecmaVersion'], undefined>;

const hashStorage: StateStorage = {
  getItem: (key): string => {
    const searchParams = new URLSearchParams(location.hash.slice(1));
    const storedValue = searchParams.get(key) ?? '';
    return storedValue ? JSON.parse(atob(storedValue)) : '';
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
  }
};

type ExplorerState = {
	tool: "ast" | "scope" | "path";
	setTool: (tool: ExplorerState["tool"]) => void;

	jsCode: string;
	setJsCode: (jsCode: string) => void;

	jsonCode: string;
	setJsonCode: (jsonCode: string) => void;

	language: string;
	setLanguage: (language: string) => void;

	parser: string;
	setParser: (parser: string) => void;

	sourceType: SourceType;
	setSourceType: (sourceType: string) => void;

	esVersion: Version;
	setEsVersion: (esVersion: string) => void;

	isJSX: boolean;
	setIsJSX: (isJSX: boolean) => void;

	jsonMode: "json" | "jsonc";
	setJsonMode: (mode: ExplorerState["jsonMode"]) => void;

	wrap: boolean;
	setWrap: (wrap: boolean) => void;

	astViewMode: "tree" | "json";
	setAstViewMode: (mode: ExplorerState["astViewMode"]) => void;

	scopeViewMode: "flat" | "nested";
	setScopeViewMode: (mode: ExplorerState["scopeViewMode"]) => void;

	pathViewMode: "code" | "graph";
	setPathViewMode: (mode: ExplorerState["pathViewMode"]) => void;

	pathIndexes: number;
	setPathIndexes: (indexes: number) => void;

	pathIndex: number;
	setPathIndex: (index: number) => void;
};

export const useExplorer = create<ExplorerState>()(
  devtools(
    persist(
      persist(
        (set) => ({
          tool: 'ast',
          setTool: (tool) => set({ tool }),

          jsCode: defaultJsCode,
          setJsCode: (jsCode) => set({ jsCode }),

          jsonCode: defaultJsonCode,
          setJsonCode: (jsonCode) => set({ jsonCode }),

          language: 'javascript',
          setLanguage: (language) => set({ language }),

          parser: 'espree',
          setParser: (parser) => set({ parser }),

          sourceType: 'module',
          setSourceType: (sourceType) =>
            set({ sourceType: sourceType as SourceType }),

          esVersion: 'latest',
          setEsVersion: (esVersion) =>
            set({
              esVersion:
                esVersion === 'latest'
                  ? 'latest'
                  : (Number(esVersion) as Options['ecmaVersion']),
            }),

          isJSX: true,
          setIsJSX: (isJSX) => set({ isJSX }),

          jsonMode: 'jsonc',
          setJsonMode: (mode) => set({ jsonMode: mode }),

          wrap: true,
          setWrap: (wrap) => set({ wrap }),

          astViewMode: 'json',
          setAstViewMode: (mode) => set({ astViewMode: mode }),

          scopeViewMode: 'flat',
          setScopeViewMode: (mode) => set({ scopeViewMode: mode }),

          pathViewMode: 'code',
          setPathViewMode: (mode) => set({ pathViewMode: mode }),

          pathIndexes: 1,
          setPathIndexes: (indexes) => set({ pathIndexes: indexes }),

          pathIndex: 0,
          setPathIndex: (index) => set({ pathIndex: index }),
        }),
        {
          name: 'eslint-explorer',
          storage: createJSONStorage(() => hashStorage),
        }
      ),
      {
        name: 'eslint-explorer',
      }
    )
  )
);
