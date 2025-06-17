import { radixThemePlugin } from "./app/lib/plugins";

const config = {
  darkMode: "selector",
  plugins: [
    radixThemePlugin({
      darkMode: "selector",
      useTailwindColorNames: true,
      useTailwindRadiusNames: true,
      mapMissingTailwindColors: true,
    }),
  ],
};

export default config;
