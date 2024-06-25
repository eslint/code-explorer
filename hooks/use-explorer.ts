import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

type ExplorerState = {
  language: string;
  setLanguage: (language: string) => void;

  parser: string;
  setParser: (parser: string) => void;

  sourceType: string;
  setSourceType: (sourceType: string) => void;

  esVersion: string;
  setEsVersion: (esVersion: string) => void;

  isJSX: boolean;
  setIsJSX: (isJSX: boolean) => void;
};

export const useExplorer = create<ExplorerState>()(
  devtools(
    persist(
      (set) => ({
        language: 'javascript',
        setLanguage: (language) => set({ language }),

        parser: 'espree',
        setParser: (parser) => set({ parser }),

        sourceType: 'commonjs',
        setSourceType: (sourceType) => set({ sourceType }),

        esVersion: 'latest',
        setEsVersion: (esVersion) => set({ esVersion }),

        isJSX: true,
        setIsJSX: (isJSX) => set({ isJSX }),
      }),
      {
        name: 'eslint-explorer',
      }
    )
  )
);
