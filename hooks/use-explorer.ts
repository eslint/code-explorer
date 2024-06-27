import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { Options } from 'espree';

type ExplorerState = {
  code: string;
  setCode: (code: string) => void;

  language: string;
  setLanguage: (language: string) => void;

  parser: string;
  setParser: (parser: string) => void;

  sourceType: Omit<Options['sourceType'], 'undefined'>;
  setSourceType: (sourceType: string) => void;

  esVersion: Options['ecmaVersion'];
  setEsVersion: (esVersion: string) => void;

  isJSX: boolean;
  setIsJSX: (isJSX: boolean) => void;
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
        setSourceType: (sourceType) => set({ sourceType }),

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
      }),
      {
        name: 'eslint-explorer',
      }
    )
  )
);
