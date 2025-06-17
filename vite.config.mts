import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  // build: {
  //   rollupOptions: {
  //     external: ["pkgname"],
  //   },
  // },
  ssr: {
    noExternal: ["date-fns"],
  },
  plugins: [reactRouter(), tsconfigPaths()],
  server: { port: 3000 },
  preview: { port: 5000 },
});
