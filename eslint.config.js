import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginJsxA11y from "eslint-plugin-jsx-a11y";
import playwright from "eslint-plugin-playwright";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
	globalIgnores(["build/**", "playwright-report/**", "test-results/**"]),

	pluginJs.configs.recommended,
	tseslint.configs.recommended,
	pluginReact.configs.flat.recommended,
	pluginReact.configs.flat["jsx-runtime"],
	pluginJsxA11y.flatConfigs.recommended,
	pluginReactHooks.configs.flat.recommended,
	{
		files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
		languageOptions: {
			globals: globals.browser,
			sourceType: "module",
		},
		rules: {
			"react/prop-types": "off", // TypeScript handles type checking
			"@typescript-eslint/ban-ts-comment": "off",
		},
		settings: {
			react: {
				version: "detect",
			},
		},
	},
	{
		files: ["e2e-tests/**"],
		extends: [playwright.configs["flat/recommended"]],
	},
]);
