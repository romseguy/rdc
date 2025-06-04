import { css } from "@emotion/react";
import unitless from "@emotion/unitless";
import { type CSSProperties } from "react";

export const toCss = (
  styleMap: Record<string, string>,
  isImportant?: boolean,
) => {
  function trimCssSelector(selector: string) {
    return selector
      .replace(/\s*([+~>])\s*/g, "$1")
      .replace(/\s{2,}/g, " ")
      .trim();
  }

  function stringifyCSSProperties(
    cssProperties: CSSProperties,
    isImportant: boolean = false,
  ) {
    function camelToKebab(str: string) {
      return str.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
    }
    function applyCssUnits(
      prop: string,
      value: string | number,
      units: string = "px",
    ) {
      if (typeof value !== "string" && typeof value !== "number") {
        throw new Error(
          "Invalid input: value of 'cssProperties' must be string or number.",
        );
      }

      if (typeof value === "number" && value !== 0 && !isUnitless(prop)) {
        return `${value}${units}`;
      }

      function isUnitless(prop: string) {
        return unitless[prop] === 1;
      }

      return `${value}`;
    }
    if (typeof cssProperties !== "object" || cssProperties === null) {
      throw new Error("Invalid input: 'cssProperties' must be an object.");
    }

    const important = isImportant ? "!important" : "";
    const str = Object.entries(cssProperties)
      .filter(([_, value]) => isCSSPropertyValue(value))
      .map(([key, value]) => {
        return `${camelToKebab(key)}:${applyCssUnits(key, value)}${important};`;
      })
      .join("");
    return str;
  }

  function isCSSPropertyValue(value: unknown): value is number | string {
    return typeof value === "number" || typeof value === "string";
  }

  const str = Object.keys(styleMap)
    .map((key) => [key, styleMap[key]])
    .reduce<string[]>((result, [key, value]) => {
      if (Object.keys(value).length > 0) {
        const str = `${stringifyCSSProperties(
          { [trimCssSelector(key)]: value },
          isImportant,
        )}`;
        result.push(str);
      }
      return result;
    }, [])
    .join("");
  return css(str);
};
