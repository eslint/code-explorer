import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { Options } from 'espree';
import { storeState } from '../lib/utils';
import {defaultCode, defaultJsOptions} from '../lib/const'
export type SourceType = Exclude<Options['sourceType'], undefined>;
export type Version = Exclude<Options['ecmaVersion'], undefined>;

type Code = { jsCode: string, jsonCode: string };
type JsOptions = { parser: string, sourceType: string, esVersion: string, isJSX: Boolean}
type ExplorerState = {
  code: Code;
  setCode: (code: Code) => void;

  language: string;
  setLanguage: (language: string) => void;

  tool: 'ast' | 'scope' | 'path';
  setTool: (tool: ExplorerState['tool']) => void;

  jsOptions: JsOptions;

  parser: string;
  setParser: (parser: string) => void;

  sourceType: SourceType;
  setSourceType: (sourceType: SourceType) => void;

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

};

const createSetter = <T extends keyof ExplorerState>(
  key: T,
  set: (state: Partial<ExplorerState>) => void
) => (value: ExplorerState[T]) => {
  set({ [key]: value });
  storeState();
};

export const useExplorer = create<ExplorerState>()(
  devtools(
    persist(
      (set) => ({
        code: defaultCode,
        setCode: createSetter('code', set),

        language: 'javascript',
        setLanguage: createSetter('language', set),

        tool: 'ast',
        setTool: createSetter('tool', set),

        jsOptions: defaultJsOptions,
        setJsOptions: createSetter('jsOptions', set),

        parser: 'espree',
        setParser: createSetter('parser', set),

        sourceType: 'module',
        setSourceType: createSetter('sourceType', set),

        esVersion: 'latest',
        setEsVersion: (esVersion) => {
          const version = esVersion === 'latest' ? 'latest' : Number(esVersion);
          createSetter('esVersion', set)(version as Version);
        },

        isJSX: true,
        setIsJSX: createSetter('isJSX', set),

        jsonMode: 'jsonc',
        setJsonMode: createSetter('jsonMode', set),

        wrap: true,
        setWrap: createSetter('wrap', set),

        astViewMode: 'json',
        setAstViewMode: createSetter('astViewMode', set),

        scopeViewMode: 'flat',
        setScopeViewMode: createSetter('scopeViewMode', set),

        pathViewMode: 'code',
        setPathViewMode: createSetter('pathViewMode', set),

        pathIndexes: 1,
        setPathIndexes: createSetter('pathIndexes', set),

        pathIndex: 0,
        setPathIndex: createSetter('pathIndex', set),
      }),
      {
        name: 'eslint-explorer',
      }
    )
  )
);