/**
 * Copied from the ESLint playground.
 * @see https://github.com/eslint/eslint.org/blob/e6f10f42b5aa203096412686076e91190b93cf9f/src/playground/utils/unicode.js
 */

// Provides conversion functions between a unicode string and a base64 string.
// See also: https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/btoa#Unicode_strings

export default {
    encodeToBase64(text) {
        return window.btoa(unescape(encodeURIComponent(text)));
    },

    decodeFromBase64(base64) {
        return decodeURIComponent(escape(window.atob(base64)));
    }
};
