import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import vitePluginRequire from "vite-plugin-require";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), vitePluginRequire(), nodePolyfills()],
});
