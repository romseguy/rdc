import { css } from "@emotion/react";
import unitless from "@emotion/unitless";
import { type CSSProperties } from "react";
export const MB = 1000000;

export const bindEvent = (
  target: Document | Element,
  eventName: string,
  fun: () => void,
) => {
  if (target.addEventListener) {
    target.removeEventListener(eventName, fun, false);
    target.addEventListener(eventName, fun, false);
  }
};

export const localize: (fr: string, en?: string) => string = (fr, en) => {
  if (!en) return import.meta.env.VITE_PUBLIC_LOCALE === "en" ? `${fr}_en` : fr;
  return import.meta.env.VITE_PUBLIC_LOCALE === "en" ? en : fr;
};

export const rand = () => Math.round(Math.random() * 100);

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

export const toUsername = (email) => {
  return email?.replace(/@.+/, "");
};

//#region date
import {
  addDays,
  compareDesc,
  format,
  formatDuration as oFormatDuration,
  getDay,
  getDaysInMonth,
  getHours,
  getMinutes,
  getSeconds,
  intervalToDuration,
  parseISO,
  setDay,
  setHours,
  setMinutes,
  setSeconds,
  startOfMonth,
} from "date-fns";
import { fr } from "date-fns/locale";

/*
compareAsc
  Compare the two dates and return
  1 if the first date is after the second
  -1 if the first date is before the second
  0 if dates are equal.

compareDesc
  Compare the two dates and return
  1 if the first date is before the second 
  -1 if the first date is after the second
   0 if dates are equal.
*/

export const days = [
  "lundi",
  "mardi",
  "mercredi",
  "jeudi",
  "vendredi",
  "samedi",
  "dimanche",
];

var DAYS_IN_A_WEEK = 7;

/**
 * @name getNthDayOfMonth
 * @category Month Helpers
 * @summary Get the nth weekday for a date
 *
 * @description
 * Get then nth weekday in a month of the given date, day and week.
 *
 * @param {Date|Number} date - the given date
 * @param {Number} day - the given day to be found in the month
 * @param {Date|Number} week - the given week to be calculated *
 * @returns {Date} the date of nth day of the month
 * @throws {TypeError} 3 argument required
 * @throws {RangeError}  day is between 0 and 6 _and_ is not NaN
 * @throws {RangeError}  the day calulated should not exceed the given month
 *
 *
 *
 * @example
 * // What is the 4th Wednesday of 1st July, 2020?
 * var result = getNthDayOfMonth(new Date(2020, 6, 1), 3, 4)
 * //=> Wed Jul 22 2020 00:00:00 (4th Wednesday of the month)
 */
export function getNthDayOfMonth(date: Date, day: number, week: number) {
  if (!(day >= 0 && day <= 6)) {
    console.error("day must be between 0 and 6 inclusively", day);
    return date;
  }

  const startOfMonthVal = startOfMonth(date);
  const daysToBeAdded =
    (week - 1) * DAYS_IN_A_WEEK +
    ((DAYS_IN_A_WEEK + day - getDay(startOfMonthVal)) % DAYS_IN_A_WEEK);
  const nthDayOfMonth = addDays(startOfMonthVal, daysToBeAdded);

  //Test if the days to be added excees the current month
  if (daysToBeAdded >= getDaysInMonth(date)) {
    console.error("the nth day exceeds the month");
    return date;
  }

  return nthDayOfMonth;
}

export const formatArray = [
  "years",
  "months",
  "weeks",
  "days",
  "hours",
  "minutes",
];

const formatDistanceLocale = {
  xSeconds: "{{count}}s",
  xMinutes: "{{count}}m",
  xHours: "{{count}}h",
  xDays: "{{count}}j",
  xMonths: "{{count}}M",
  xYears: "{{count}}y",
} as { [key: string]: string };

export const formatDuration = (
  duration: Duration,
  { format }: { format: string[] },
) => {
  return oFormatDuration(duration, {
    format,
    locale: {
      formatDistance: (token, count) =>
        formatDistanceLocale[token].replace("{{count}}", count),
    },
  });
};

export const fullDateString = (date: Date | string) => {
  return format(
    typeof date === "string" ? parseISO(date) : date,
    "eeee dd MMMM yyyy à H'h'mm",
    {
      locale: fr,
    },
  );
};

export const timeAgo = (args: { date: Date | string }) => {
  let { date } = args;
  if (typeof date === "string") date = parseISO(date);
  const duration = intervalToDuration({
    start: new Date(),
    end: date,
  });
  const format2 = formatArray.filter((f) => {
    if (typeof duration.years === "number" && duration.years > 0)
      return f === "years";
    if (typeof duration.months === "number" && duration.months > 0)
      return f === "months";
    if (typeof duration.days === "number" && duration.days > 0)
      return f === "days";
    if (typeof duration.hours === "number" && duration.hours > 0)
      return f === "hours";
    return f === "minutes";
  });
  const formatted = formatDuration(duration, {
    format: format2,
  });
  return formatted || localize("Il y a quelques secondes", "A few seconds ago");
};
// export const timeAgo = (
//   date?: string | Date,
//   isShort?: boolean,
//   format?: string[],
// ) => {
//   const end =
//     typeof date === "string"
//       ? parseISO(date)
//       : date !== undefined
//       ? date
//       : new Date();
//   const fullDate = fullDateString(end);
//   const duration = intervalToDuration({
//     start: new Date(),
//     end,
//   });
//   const format2 = isShort
//     ? (format || formatArray).filter((f) => {
//         if (typeof duration.years === "number" && duration.years > 0)
//           return f === "years";
//         if (typeof duration.months === "number" && duration.months > 0)
//           return f === "months";
//         if (typeof duration.days === "number" && duration.days > 0)
//           return f === "days";
//         if (typeof duration.hours === "number" && duration.hours > 0)
//           return f === "hours";
//         return f === "minutes";
//       })
//     : format || formatArray;

//   const formatted = formatDuration(duration, {
//     format: format2,
//   });

//   return { timeAgo: formatted === "" ? "1m" : formatted, fullDate };
// };

export const moveDateToCurrentWeek = (date: Date) => {
  const today = new Date();
  return setSeconds(
    setMinutes(
      setHours(setDay(today, getDay(date)), getHours(date)),
      getMinutes(date),
    ),
    getSeconds(date),
  );
};
//#endregion

//#region image
export async function getImageSize(file: File | Blob | string) {
  let img = new Image();
  if (typeof file === "string") {
    img.src = file;
  } else {
    img.src = URL.createObjectURL(file);
  }

  await img.decode();
  let width = img.width;
  let height = img.height;
  return {
    width,
    height,
  };
}
//#endregion

//#region hooks
import React, { useRef } from "react";

export const useScroll = <T extends HTMLElement>(
  options?: boolean | ScrollIntoViewOptions,
): [() => void, React.LegacyRef<T>] => {
  const elRef = useRef<T>(null);
  const executeScroll = (): void => {
    if (elRef.current) {
      elRef.current.scrollIntoView(options);
    }
  };

  return [executeScroll, elRef];
};
//#endregion

export function iosPWASplash(icon, color = "white") {
  // Check if the provided 'icon' is a valid URL
  if (typeof icon !== "string" || icon.length === 0) {
    throw new Error("Invalid icon URL provided");
  }

  // Calculate the device's width and height
  let deviceWidth = screen.width;
  let deviceHeight = screen.height;

  // The following detects the device's width and height in private mode
  if (window.visualViewport?.width) {
    const deviceWidthPM = Math.round(
      window.visualViewport.width * window.visualViewport.scale,
    );
    // if not private mode, then both values should be equal so the code will not run
    if (deviceWidth > deviceWidthPM) {
      deviceWidth = deviceWidthPM;
      // in private mode, uses the direct ratio to calculate the height since this is the only way as of now
      deviceHeight = (284 / 131) * deviceWidth;
    }
  }

  // Calculate the pixel ratio
  const pixelRatio = window.devicePixelRatio || 1;
  // Create two canvases and get their contexts to draw landscape and portrait splash screens.
  const canvas = document.createElement("canvas");
  const canvas2 = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const ctx2 = canvas2.getContext("2d");

  // Create an image element for the icon
  const iconImage = new Image();

  iconImage.onerror = function () {
    throw new Error("Failed to load icon image");
  };

  iconImage.src = icon;
  // Load the icon image, make sure it is served from the same domain (ideal size 512pxX512px). If not then set the proper CORS headers on the image and uncomment the next line.
  //iconImage.crossOrigin="anonymous"
  iconImage.onload = function () {
    // Calculate the icon size based on the device's pixel ratio
    const iconSizew = iconImage.width / (3 / pixelRatio);
    const iconSizeh = iconImage.height / (3 / pixelRatio);

    canvas.width = deviceWidth * pixelRatio;
    canvas2.height = canvas.width;
    canvas.height = deviceHeight * pixelRatio;
    canvas2.width = canvas.height;
    ctx.fillStyle = color;
    ctx2.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx2.fillRect(0, 0, canvas2.width, canvas2.height);

    // Calculate the position to center the icon
    const x = (canvas.width - iconSizew) / 2;
    const y = (canvas.height - iconSizeh) / 2;
    const x2 = (canvas2.width - iconSizew) / 2;
    const y2 = (canvas2.height - iconSizeh) / 2;
    // Draw the icon with the calculated size
    ctx.drawImage(iconImage, x, y, iconSizew, iconSizeh);
    ctx2.drawImage(iconImage, x2, y2, iconSizew, iconSizeh);
    const imageDataURL = canvas.toDataURL("image/png");
    const imageDataURL2 = canvas2.toDataURL("image/png");

    // Add apple-mobile-web-app-capable if not already present
    if (!document.querySelector('meta[name="apple-mobile-web-app-capable"]')) {
      const metaTag = document.createElement("meta");
      metaTag.setAttribute("name", "apple-mobile-web-app-capable");
      metaTag.setAttribute("content", "yes");
      document.head.appendChild(metaTag);
    }

    // Create the first startup image <link> tag (splash screen)

    const appleTouchStartupImageLink = document.createElement("link");
    appleTouchStartupImageLink.setAttribute("rel", "apple-touch-startup-image");
    appleTouchStartupImageLink.setAttribute(
      "media",
      "screen and (orientation: portrait)",
    );
    appleTouchStartupImageLink.setAttribute("href", imageDataURL);
    document.head.appendChild(appleTouchStartupImageLink);

    // Create the second startup image <link> tag (splash screen)

    const appleTouchStartupImageLink2 = document.createElement("link");
    appleTouchStartupImageLink2.setAttribute(
      "rel",
      "apple-touch-startup-image",
    );
    appleTouchStartupImageLink2.setAttribute(
      "media",
      "screen and (orientation: landscape)",
    );
    appleTouchStartupImageLink2.setAttribute("href", imageDataURL2);
    document.head.appendChild(appleTouchStartupImageLink2);
  };
}

{
  /*
    export const scrollToBottomOfDynamicPage = (duration = 1000): Promise<void> => {
      return new Promise((resolve) => {
        const startTime: number = performance.now();
        const startY: number = window.scrollY;

        const step = (currentTime: number) => {
          const elapsed: number = currentTime - startTime;
          const progress: number = Math.min(elapsed / duration, 1);

          const targetY: number = document.body.scrollHeight - window.innerHeight;
          const newY: number = startY + (targetY - startY) * progress;

          window.scrollTo({ top: newY, behavior: "instant" });

          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            resolve();
          }
        };

        requestAnimationFrame(step);
      });
    };

    export const useScrollToBottomWhen = (condition: boolean) => {
      useEffect(() => {
        if (condition) {
          window.scrollTo({
            top: document.documentElement.scrollHeight - window.innerHeight,
            left: 0,
            behavior: "smooth",
          });
        }
      }, [condition]);
    };
  */
}

{
  /* {React.Children.map(children, (child) =>
        React.cloneElement(child, { showToast }),
      )} */
}
