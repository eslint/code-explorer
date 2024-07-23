import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { Options } from 'espree';

export type SourceType = Exclude<Options['sourceType'], undefined>;
export type Version = Exclude<Options['ecmaVersion'], undefined>;

type ExplorerState = {
  tool: 'ast' | 'scope' | 'path';
  setTool: (tool: ExplorerState['tool']) => void;

  code: string;
  setCode: (code: string) => void;

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

  jsonMode: 'json' | 'jsonc';
  setJsonMode: (mode: ExplorerState['jsonMode']) => void;

  wrap: boolean;
  setWrap: (wrap: boolean) => void;

  astViewMode: 'tree' | 'json';
  setAstViewMode: (mode: ExplorerState['astViewMode']) => void;

  scopeViewMode: 'flat' | 'nested';
  setScopeViewMode: (mode: ExplorerState['scopeViewMode']) => void;

  pathViewMode: 'code' | 'graph';
  setPathViewMode: (mode: ExplorerState['pathViewMode']) => void;

  pathIndexes: number;
  setPathIndexes: (indexes: number) => void;

  pathIndex: number;
  setPathIndex: (index: number) => void;

  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: ExplorerState['theme']) => void;
};

export const useExplorer = create<ExplorerState>()(
  devtools(
    persist(
      (set) => ({
        tool: 'ast',
        setTool: (tool) => set({ tool }),

        code: `const a = 'b';`,
        setCode: (code) => set({ code }),

        language: 'javascript',
        setLanguage: (language) => set({ language }),

        parser: 'espree',
        setParser: (parser) => set({ parser }),

        sourceType: 'commonjs',
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

        jsonMode: 'json',
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

        theme: 'system',
        setTheme: (theme) => set({ theme: theme as ExplorerState['theme'] }),
      }),
      {
        name: 'eslint-explorer',
      }
    )
  )
);