import { useDeviceSelectors } from "react-device-detect";
import { Outlet } from "react-router";
import { Provider } from "react-redux";
import { store } from "./store";

export const App = (props) => {
  const {
    loaderData: { userAgent },
  } = props;
  const [{ isMobile }] = useDeviceSelectors(userAgent);

  return (
    <Provider
      store={store({
        app: {
          auth: {
            user:
              process.env.NODE_ENV === "development"
                ? { email: import.meta.env.VITE_PUBLIC_EMAIL2 }
                : undefined,
          },
          isMobile,
          locale: import.meta.env.VITE_PUBLIC_LOCALE,
          modal: { isOpen: false },
        },
      })}
    >
      <Outlet />
    </Provider>
  );
};
