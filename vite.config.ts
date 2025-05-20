import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
	plugins: [react()],
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
	server: {
		// accept connections from everywhere because Playwright browsers run from within a Docker container which has some random IP
		allowedHosts: ["host.docker.internal", "localhost"],
	},
});
