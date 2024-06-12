import eslintConfigESLintCJS from "eslint-config-eslint/cjs";
import globals from "globals";
import reactPlugin from "eslint-plugin-react";
import reactRecommended from "eslint-plugin-react/configs/recommended.js";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import { fixupPluginRules } from "@eslint/compat";

export default [
    {
        ignores: [
            "dist/"
        ]
    },
    ...eslintConfigESLintCJS,
    {
        files: ["**/*.{js,jsx,cjs}"],
        rules: {

            // Disable rules that the codebase doesn't currently follow.
            "jsdoc/require-jsdoc": "off",
            "jsdoc/require-returns": "off",
            "jsdoc/require-param-description": "off",
            "jsdoc/require-param-type": "off",
            "jsdoc/no-bad-blocks": ["error", {
                ignore: ["__PURE__"]
            }],
            "n/no-extraneous-require": ["error", {
                allowModules: ["luxon"]
            }]
        }
    },
    {
        files: ["**/*.{js,jsx}"],
        languageOptions: {
            sourceType: "module",
            parserOptions: {
                ecmaFeatures: {
                    jsx: true
                }
            }
        }
    },
    {
        files: ["**/*.cjs"],
        languageOptions: {
            sourceType: "script"
        }
    },
    {
        files: ["src/**/*.{js,jsx}"],
        plugins: {
            react: fixupPluginRules(reactPlugin),
            "jsx-a11y": fixupPluginRules(jsxA11yPlugin),
            "react-hooks": fixupPluginRules(reactHooksPlugin)
        },
        settings: {
            react: {
                version: "16.8.6"
            }
        },
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.es2021
            }
        },
        rules: {
            ...reactRecommended.rules,
            ...jsxA11yPlugin.configs.recommended.rules,
            "react/jsx-no-useless-fragment": "error",
            "react/jsx-no-target-blank": "error",

            // Disable rules that the codebase doesn't currently follow.
            // It might be a good idea to enable these in the future.
            "jsx-a11y/no-onchange": "off",
            "react/prop-types": "off",
            "jsdoc/require-jsdoc": "off",
            "react-hooks/rules-of-hooks": "error",
            "react-hooks/exhaustive-deps": "warn",

            // Disable eslint-plugin-node rules from eslint-config-eslint
            "no-process-exit": "off",
            "func-style": "off",
            "n/no-deprecated-api": "off",
            "n/no-extraneous-require": "off",
            "n/no-missing-require": "off",
            "n/no-unpublished-bin": "off",
            "n/no-unpublished-require": "off",
            "n/no-unsupported-features/es-builtins": "off",
            "n/no-unsupported-features/es-syntax": "off",
            "n/no-unsupported-features/node-builtins": "off",
            "n/process-exit-as-throw": "off",
            "n/shebang": "off",
            "n/no-extraneous-import": "off",
            "n/no-missing-import": "off",
            "n/no-unpublished-import": "off"
        }
    }
];
