import { twMerge } from "tailwind-merge";
import { radixThemePlugin } from "./app/lib/plugins";

// no fast-refresh
const base = (theme) => ({
  body: {
    backgroundImage: "url('/bg.jpg')",
    backgroundRepeat: "repeat",
    margin: "0 auto",
    maxWidth: twMerge(theme("screens.lg")),
  },
  h1: {
    fontSize: twMerge(theme("fontSize.2xl")),
    margin: 0,
  },
  h2: { fontSize: twMerge(theme("fontSize.xl")), margin: 0 },
  h3: { fontSize: twMerge(theme("fontSize.lg")), margin: 0 },
  p: { margin: 0 },
  pre: { background: "black !important" },
});

const config = {
  darkMode: "selector",
  plugins: [
    //require("@headlessui/tailwindcss")(),
    //require("tailwindcss-radix")(),
    radixThemePlugin(base),
  ],
};

export default config;
