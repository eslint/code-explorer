import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
	plugins: [
		react({
			babel: {
				plugins: [["babel-plugin-react-compiler"]],
			},
		}),
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src"),
		},
	},
	optimizeDeps: {
		include: ["@html-eslint/eslint-plugin"],
	},
	build: {
		outDir: "build",
		rollupOptions: {
			output: {
				manualChunks: {
					// Core React dependencies (rarely change)
					vendor: ["react", "react-dom", "zustand"],

					// Heavy parsing libraries (version-dependent)
					parsers: [
						"espree",
						"esquery",
						"@eslint/css",
						"@eslint/json",
						"@eslint/markdown",
						"@html-eslint/eslint-plugin",
						"eslint-linter-browserify",
						"eslint-scope",
					],

					// UI framework components (stable)
					ui: [
						"@radix-ui/react-accordion",
						"@radix-ui/react-dialog",
						"@radix-ui/react-dropdown-menu",
						"@radix-ui/react-label",
						"@radix-ui/react-popover",
						"@radix-ui/react-select",
						"@radix-ui/react-slot",
						"@radix-ui/react-switch",
						"@radix-ui/react-toast",
						"@radix-ui/react-toggle",
						"@radix-ui/react-toggle-group",
					],

					// Code editor (large, separate feature)
					editor: [
						"@uiw/react-codemirror",
						"codemirror",
						"@codemirror/lang-css",
						"@codemirror/lang-html",
						"@codemirror/lang-javascript",
						"@codemirror/lang-json",
						"@codemirror/lang-markdown",
						"@codemirror/language",
						"@lezer/highlight",
					],

					// Utilities and styling (frequently changing)
					utils: [
						"clsx",
						"tailwind-merge",
						"class-variance-authority",
						"lucide-react",
						"use-debounced-effect",
					],

					// Visualization libraries
					visualization: ["graphviz-react", "react-resizable-panels"],
				},
				chunkFileNames: "assets/[name]-[hash].js",
				entryFileNames: "assets/[name]-[hash].js",
				assetFileNames: "assets/[name]-[hash].[ext]",
			},
		},
		minify: "esbuild",
		chunkSizeWarningLimit: 1000,
		sourcemap: false,
	},
	esbuild: {
		keepNames: true,
	},
	define: {
		"process.env.NODE_DEBUG": JSON.stringify(process.env.NODE_DEBUG),
	},
});
