import plugins from "./app/lib/tw/plugins";
import type { Config } from "tailwindcss/types";

const config: Partial<Config> = {
  darkMode: "selector",
  plugins,
};

export default config;
