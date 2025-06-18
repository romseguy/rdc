//@ts-nocheck
import { withOptions } from "tailwindcss/plugin";
import { theme as rt } from "./rt/theme";

export const radixThemePlugin = withOptions(
  (base) => {
    return ({ addBase, theme }) => {
      addBase(base(theme));
    };
  },
  () => {
    return {
      darkMode: "selector",
      theme: rt,
    };
  },
);
