import { twMerge } from "tailwind-merge";
import type { CSSRuleObject, PluginAPI } from "tailwindcss/types/config";

const base: (radixTheme: PluginAPI["theme"]) => CSSRuleObject = (
  radixTheme,
) => ({
  body: {
    backgroundImage: "url('/bg.jpg')",
    backgroundRepeat: "repeat",
    margin: "0 auto",
    maxWidth: twMerge(radixTheme("screens.lg")),
  },
  h1: {
    fontSize: twMerge(radixTheme("fontSize.2xl")),
    margin: "0",
  },
  h2: { fontSize: twMerge(radixTheme("fontSize.xl")), margin: "0" },
  h3: { fontSize: twMerge(radixTheme("fontSize.lg")), margin: "0" },
  p: { margin: "0" },
  pre: { background: "black !important" },
});

export default base;
