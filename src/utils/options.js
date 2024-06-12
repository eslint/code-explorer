/**
 * @fileoverview Utilities for user options.
 * @author Yosuke Ota
 */

/**
 * @typedef {import('eslint').Linter.FlatConfig} FlatConfig
 */
/**
 * @typedef {Object} ExplorerOptions
 * @property {'ast'|'scope'|'codePath'} activeTab The active explorer tab.
 * @property {FlatConfig['languageOptions']} [languageOptions] The eslint language options.
 * @property {Object} [codePathExplorerOptions] The options for Code Path Explorer.
 * @property {'dot'|'graph'} [codePathExplorerOptions.kind] The option for Code Path Explorer kind.
 * @property {number} [codePathExplorerOptions.selectedCodePathIndex] The selected code path index.
 */

/**
 * Get the default options
 * @returns {ExplorerOptions} The default options
 */
export function getDefaultOptions() {
    return {
        activeTab: "codePath",
        codePathExplorerOptions: {
            kind: "graph"
        }
    };
}

/**
 * Normalized options.
 * @param {ExplorerOptions} [options]
 * @returns {Required<ExplorerOptions>} The normalized options
 */
export function normalizeOptions(options = {}) {
    return {
        activeTab: "codePath",
        ...options,
        codePathExplorerOptions: {
            kind: "graph",
            ...options.codePathExplorerOptions
        }
    };
}

/**
 * Resolve language options.
 * @param {ExplorerOptions['languageOptions']} [options]
 * @returns {NonNullable<FlatConfig['languageOptions']>} The language options
 */
export function resolveLanguageOptions(options) {

    return {
        ecmaVersion: "latest",
        sourceType: "module",
        ...options,
        ...(!options?.parser || options.parser === "espree") ? {}
            : {

                // TODO: support other parsers
                // parser: foo
            },
        parserOptions: {
            ...options?.parserOptions,
            ecmaFeatures: {
                globalReturn: true,
                ...options?.parserOptions?.ecmaFeatures
            }
        }
    };
}
