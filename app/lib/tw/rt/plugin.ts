import { withOptions } from "tailwindcss/plugin";
import base from "./base";
import theme from "./theme";
import type { Config } from "tailwindcss/types";
import type { PluginCreator } from "tailwindcss/types/config";

type PluginOptions = {};

const pluginCreator: (options: PluginOptions) => PluginCreator =
  (options) =>
  ({ addBase, theme }) =>
    addBase(base(theme));

const pluginConfig: (options: PluginOptions) => Partial<Config> = (
  options,
) => ({
  darkMode: "selector",
  theme,
});

export default withOptions<PluginOptions>(pluginCreator, pluginConfig);
