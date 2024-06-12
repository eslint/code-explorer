/**
 * @fileoverview Debounce function
 * 
 * Copied from the ESLint playground.
 * @see https://github.com/eslint/eslint.org/blob/e6f10f42b5aa203096412686076e91190b93cf9f/src/playground/utils/debounce.js
 */

export default function debounce(callback, delay) {
    let timerId;

    return (...args) => {
        clearTimeout(timerId);
        timerId = setTimeout(() => {
            callback(...args);
        }, delay);
    };
}
