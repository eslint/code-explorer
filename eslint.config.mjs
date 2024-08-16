import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginJsxA11y from "eslint-plugin-jsx-a11y";

export default [
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    plugins: {
      'react': pluginReact,
      'react-hooks': pluginReactHooks,
      'jsx-a11y': pluginJsxA11y
    },
    languageOptions: {
      globals: globals.browser,
      sourceType: "module",
    },
    rules: {
      'react/react-in-jsx-scope': 'off', // React 17+ doesn't require React to be in scope
      'react/prop-types': 'off', // TypeScript handles type checking
      '@typescript-eslint/ban-ts-comment': 'off',
      'jsx-a11y/anchor-is-valid': 'warn',
      'jsx-a11y/alt-text': 'warn',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    ignores: ['**/*.config.js'],
  }
];
