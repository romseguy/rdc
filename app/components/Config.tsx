import { useScript } from "@charlietango/hooks/use-script";
import { useEffect } from "react";
import { isMobile } from "react-device-detect";
import { useDispatch, useSelector } from "react-redux";
import { postIp } from "~/api";
import { getState, setState } from "~/store";
import { splash } from "~/lib/ios/splash";

const controller = new AbortController();
const signal = controller.signal;

export const Config = () => {
  const { screenWidth } = useSelector(getState);

  const dispatch = useDispatch();
  // useScript("https://unpkg.com/pwacompat", {
  //   attributes: { async: "true", crossOrigin: "anonymous" },
  // });

  useEffect(() => {
    if (process.env.NODE_ENV === "production")
      splash("/icons/icon-512x512.png", "#000000");

    (async () => {
      try {
        if (process.env.NODE_ENV === "production") {
          const res = await fetch("https://api.ipify.org?format=json");
          const data = await res.json();
          if (data.ip)
            //@ts-expect-error
            dispatch(postIp.initiate({ ip: data.ip }));
        }
      } catch (error) {
        console.log("🚀 ~ error:", error);
      }
    })();

    function updateScreenWidth() {
      const newScreenWidth = window.innerWidth - 16;
      if (newScreenWidth !== screenWidth) {
        dispatch(setState({ screenWidth: newScreenWidth }));
      }
    }
    updateScreenWidth();

    if (!isMobile) {
      window.addEventListener("resize", updateScreenWidth);
      signal.addEventListener("abort", () => {
        window.removeEventListener("resize", updateScreenWidth);
      });
      return () => {
        if (!isMobile) controller.abort();
      };
    }
  }, []);

  return null;
};
