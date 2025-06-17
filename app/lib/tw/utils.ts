import {
  accentColors,
  grayColors,
} from "@radix-ui/themes/src/props/color.prop.js";

const useTailwindColorNames = true;
const mapMissingTailwindColors = true;

export const grayColorNames: string[] = [];
grayColors.map((color) => {
  if (color !== "auto") {
    grayColorNames.push(color);
  }
});

const accentColorNames: string[] = [];
[
  {
    label: "Regulars",
    values: [
      "tomato",
      "red",
      "ruby",
      "crimson",
      "pink",
      "plum",
      "purple",
      "violet",
      "iris",
      "indigo",
      "blue",
      "cyan",
      "teal",
      "jade",
      "green",
      "grass",
      "brown",
      "orange",
    ],
  },
  { label: "Brights", values: ["sky", "mint", "lime", "yellow", "amber"] },
  { label: "Metals", values: ["gold", "bronze"] },
  { label: "Gray", values: ["gray"] as const },
].map((group) => {
  accentColorNames.push(...group.values.filter((color) => color !== "gray"));
});

const radixRadiusToTailwindMap = {
  1: "xxs",
  2: "xs",
  3: "sm",
  4: "md",
  5: "lg",
  6: "xl",
} as const;
export function getRadiusTokenName(
  radius: keyof typeof radixRadiusToTailwindMap,
): string | number {
  return useTailwindColorNames ? radixRadiusToTailwindMap[radius] : radius;
}

type RadixColorScales = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export function generateTailwindColors(colorName: string) {
  function getColorTokenName(
    number: RadixColorScales,
    alpha?: boolean,
  ): number | string {
    const map: Record<number, number> = {
      1: 25,
      2: 50,
      3: 100,
      4: 200,
      5: 300,
      6: 400,
      7: 500,
      8: 600,
      9: 700,
      10: 800,
      11: 900,
      12: 950,
    } as const;

    if (!useTailwindColorNames) {
      return alpha ? `${number}A` : number;
    }

    return alpha ? (`${map[number]}A` as string) : (map[number] as number);
  }
  function getColorDefinitions(color: string, alpha?: boolean) {
    const radixColorScales = 12;
    const colors = Array.from(Array(radixColorScales).keys()).reduce(
      (acc, _, i) => {
        acc[
          getColorTokenName((i + 1) as RadixColorScales, alpha)
        ] = `var(--${color}-${alpha ? "a" : ""}${i + 1})`;
        return acc;
      },
      {} as Record<string, string>,
    );

    if (!alpha) {
      colors[
        `${getColorTokenName(9, alpha)}-contrast`
      ] = `var(--${color}-9-contrast)`;
      colors.surface = `var(--${color}-surface)`;
      colors.DEFAULT = `var(--${color}-9)`;
      if (color === "accent") {
        colors.surface = "var(--color-surface-accent)";
      }
    }

    return colors;
  }

  const c = {
    ...getColorDefinitions(colorName, false),
    ...getColorDefinitions(colorName, true),
  };

  if (grayColorNames.includes(colorName)) {
    c[
      `${getColorTokenName(2, false)}-translucent`
    ] = `var(--${colorName}-2-translucent)`;
  }

  return c;
}

export function getMappings() {
  let mappingsOfMissingTailwindColors = {};
  if (typeof mapMissingTailwindColors === "boolean") {
    mappingsOfMissingTailwindColors = {
      zinc: generateTailwindColors("sand"),
      neutral: generateTailwindColors("sage"),
      stone: generateTailwindColors("mauve"),
      emerald: generateTailwindColors("grass"),
      fuchsia: generateTailwindColors("plum"),
      rose: generateTailwindColors("crimson"),
    };
  } else if (typeof mapMissingTailwindColors === "object") {
    mappingsOfMissingTailwindColors = {
      zinc:
        typeof mapMissingTailwindColors.zinc === "string"
          ? generateTailwindColors(mapMissingTailwindColors.zinc)
          : mapMissingTailwindColors.zinc,
      neutral:
        typeof mapMissingTailwindColors.neutral === "string"
          ? generateTailwindColors(mapMissingTailwindColors.neutral)
          : mapMissingTailwindColors.neutral,
      stone:
        typeof mapMissingTailwindColors.stone === "string"
          ? generateTailwindColors(mapMissingTailwindColors.stone)
          : mapMissingTailwindColors.stone,
      emerald:
        typeof mapMissingTailwindColors.emerald === "string"
          ? generateTailwindColors(mapMissingTailwindColors.emerald)
          : mapMissingTailwindColors.emerald,
      fuchsia:
        typeof mapMissingTailwindColors.fuchsia === "string"
          ? generateTailwindColors(mapMissingTailwindColors.fuchsia)
          : mapMissingTailwindColors.fuchsia,
      rose:
        typeof mapMissingTailwindColors.rose === "string"
          ? generateTailwindColors(mapMissingTailwindColors.rose)
          : mapMissingTailwindColors.rose,
    };
  }
  return mappingsOfMissingTailwindColors;
}

export function allRadixColors() {
  const accentColorNames: string[] = [];
  [
    {
      label: "Regulars",
      values: [
        "tomato",
        "red",
        "ruby",
        "crimson",
        "pink",
        "plum",
        "purple",
        "violet",
        "iris",
        "indigo",
        "blue",
        "cyan",
        "teal",
        "jade",
        "green",
        "grass",
        "brown",
        "orange",
      ],
    },
    { label: "Brights", values: ["sky", "mint", "lime", "yellow", "amber"] },
    { label: "Metals", values: ["gold", "bronze"] },
    { label: "Gray", values: ["gray"] as const },
  ].map((group) => {
    accentColorNames.push(...group.values.filter((color) => color !== "gray"));
  });
  return [...accentColorNames, ...grayColorNames].reduce<
    Record<string, Record<string, string>>
  >((acc, colorName) => {
    acc[colorName] = { ...generateTailwindColors(colorName) };
    return acc;
  }, {});
}

type RadixColors = Exclude<
  (typeof accentColors)[number] | (typeof grayColors)[number],
  "auto"
>;
const tailwindColorsToRadixMap: Record<
  "zinc" | "neutral" | "stone" | "emerald" | "fuchsia" | "rose",
  RadixColors | Record<string, string>
> = {
  zinc: "sand",
  neutral: "sage",
  stone: "sand",
  emerald: "grass",
  fuchsia: "plum",
  rose: "crimson",
};
