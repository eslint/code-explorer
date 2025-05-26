import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

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
	},
	esbuild: {
		keepNames: true,
	},
	define: {
		"process.env.NODE_DEBUG": JSON.stringify(process.env.NODE_DEBUG),
	},
});
