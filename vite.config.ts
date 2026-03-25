import path from "node:path";
import babel from "@rolldown/plugin-babel";
import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";

const chunkGroups = {
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
		"@codemirror/view",
		"@lezer/highlight",
	],
	// Utilities and styling (frequently changing)
	utils: [
		"clsx",
		"tailwind-merge",
		"class-variance-authority",
		"lucide-react",
	],
	// Visualization libraries
	visualization: ["graphviz-react", "react-resizable-panels"],
};

const pathSeparatorPattern = String.raw`[/\\]`;
const nodeModulesPattern = `${pathSeparatorPattern}node_modules${pathSeparatorPattern}`;

function createChunkGroupPattern(dependencies: string[]) {
	return new RegExp(
		`${nodeModulesPattern}(?:${dependencies
			.map(dependency => dependency.split("/").join(pathSeparatorPattern))
			.join("|")})(?:${pathSeparatorPattern}|$)`,
	);
}

export default defineConfig({
	plugins: [
		react(),
		babel({
			presets: [reactCompilerPreset()],
		}),
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src"),
		},
	},
	build: {
		outDir: "build",
		rolldownOptions: {
			output: {
				codeSplitting: {
					groups: Object.entries(chunkGroups).map(
						([chunkName, dependencies]) => ({
							name: chunkName,
							test: createChunkGroupPattern(dependencies),
						}),
					),
				},
				assetFileNames: "assets/[name]-[hash].[ext]",
				chunkFileNames: "assets/[name]-[hash].js",
				entryFileNames: "assets/[name]-[hash].js",
			},
		},
		chunkSizeWarningLimit: 1000,
	},
});
