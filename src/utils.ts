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

export const timeAgo = (
  date?: string | Date,
  isShort?: boolean,
  format?: string[],
) => {
  const end =
    typeof date === "string"
      ? parseISO(date)
      : date !== undefined
      ? date
      : new Date();
  const fullDate = fullDateString(end);
  const duration = intervalToDuration({
    start: new Date(),
    end,
  });
  const format2 = isShort
    ? (format || formatArray).filter((f) => {
        if (typeof duration.years === "number" && duration.years > 0)
          return f === "years";
        if (typeof duration.months === "number" && duration.months > 0)
          return f === "months";
        if (typeof duration.days === "number" && duration.days > 0)
          return f === "days";
        if (typeof duration.hours === "number" && duration.hours > 0)
          return f === "hours";
        return f === "minutes";
      })
    : format || formatArray;

  const formatted = formatDuration(duration, {
    format: format2,
  });

  return { timeAgo: formatted === "" ? "1m" : formatted, fullDate };
};

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
import { LegacyRef, useRef } from "react";

export const useScroll = <T extends HTMLElement>(
  options?: boolean | ScrollIntoViewOptions,
): [() => void, LegacyRef<T>] => {
  const elRef = useRef<T>(null);
  const executeScroll = (): void => {
    if (elRef.current) {
      elRef.current.scrollIntoView(options);
    }
  };

  return [executeScroll, elRef];
};
//#endregion

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
          console.log("🚀 ~ useEffect ~ condition:", condition);
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
