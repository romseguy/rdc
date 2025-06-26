import { useDeviceSelectors } from "react-device-detect";
import { Outlet, useLocation } from "react-router";
import { Provider } from "react-redux";
import { store } from "./store";
import { tokenKey } from "./lib/supabase/tokenKey";
import { useStorage } from "@charlietango/hooks/use-storage";

export const App = (props) => {
  const {
    loaderData: { userAgent },
  } = props;

  let bearer: string | null = "";
  if (typeof window !== "undefined") {
    if (localStorage.getItem(tokenKey)) {
      bearer = localStorage.getItem(tokenKey);
    } else if (process.env.NODE_ENV === "development") {
      bearer = import.meta.env.VITE_PUBLIC_AUTH_TOKEN;
    }
    if (bearer) {
      localStorage.setItem(tokenKey, bearer);
    }
  }

  const { user, ...token } = bearer ? JSON.parse(bearer) : {};

  const [{ isMobile }] = useDeviceSelectors(userAgent);

  const locale = import.meta.env.VITE_PUBLIC_LOCALE;

  return (
    <Provider
      store={store({
        app: {
          auth: {
            bearer,
            token,
            user,
          },
          isMobile,
          locale,
          modal: { isOpen: false },
        },
      })}
    >
      <Outlet />
    </Provider>
  );
};
