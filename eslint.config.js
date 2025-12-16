import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginJsxA11y from "eslint-plugin-jsx-a11y";
import { defineConfig, globalIgnores } from "@eslint/config-helpers";

export default defineConfig([
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	pluginReact.configs.flat.recommended,
	pluginReactHooks.configs.flat.recommended,
	{
		files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
		plugins: {
			react: pluginReact,
			"react-hooks": pluginReactHooks,
			"jsx-a11y": pluginJsxA11y,
		},
		languageOptions: {
			globals: globals.browser,
			sourceType: "module",
		},
		rules: {
			"react/react-in-jsx-scope": "off", // React 17+ doesn't require React to be in scope
			"react/prop-types": "off", // TypeScript handles type checking
			"@typescript-eslint/ban-ts-comment": "off",
			"jsx-a11y/anchor-is-valid": "warn",
			"jsx-a11y/alt-text": "warn",
		},
		settings: {
			react: {
				version: "detect",
			},
		},
	},
	globalIgnores(["**/*.config.js", "build/**"]),
]);
