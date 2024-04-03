import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteCommonjs } from "./vite-plugin.js";
import { fileURLToPath } from "url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), viteCommonjs()],
    define: {
        "process.env": {}
    },
    resolve: {
        alias: {
            path: "path-browserify",
            assert: path.resolve(projectRoot, "./shim/assert.js")
        }
    }
});
