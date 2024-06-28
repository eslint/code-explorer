import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { Options } from 'espree';

export type SourceType = Exclude<Options['sourceType'], undefined>;
export type Version = Exclude<Options['ecmaVersion'], undefined>;

type ExplorerState = {
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

  wrap: boolean;
  setWrap: (wrap: boolean) => void;

  astViewMode: 'tree' | 'json';
  setAstViewMode: (mode: 'tree' | 'json') => void;

  scopeViewMode: 'flat' | 'nested';
  setScopeViewMode: (mode: 'flat' | 'nested') => void;
};

export const useExplorer = create<ExplorerState>()(
  devtools(
    persist(
      (set) => ({
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

        wrap: true,
        setWrap: (wrap) => set({ wrap }),

        astViewMode: 'json',
        setAstViewMode: (mode) => set({ astViewMode: mode }),

        scopeViewMode: 'flat',
        setScopeViewMode: (mode) => set({ scopeViewMode: mode }),
      }),
      {
        name: 'eslint-explorer',
      }
    )
  )
);
