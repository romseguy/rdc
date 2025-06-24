import { useScript } from "@charlietango/hooks/use-script";
import { css } from "@emotion/react";
import { useEffect } from "react";
import { isMobile, useDeviceSelectors } from "react-device-detect";
import { Provider, useDispatch, useSelector } from "react-redux";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigation,
} from "react-router";
import { splash } from "./lib/ios/splash";
import "./root.scss";
import { Route } from "./routes/+types/$";
import { getState, setState, store } from "./store";
import { postIp } from "./api";

export { ErrorBoundary } from "~/components/ErrorBoundary";

export function Layout({ children }: { children: React.ReactNode }) {
  const navigation = useNavigation();
  useScript("https://unpkg.com/pwacompat", {
    attributes: { async: "true", crossOrigin: "anonymous" },
  });
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body
        css={
          navigation.state === "loading" &&
          css`
            overscroll-behavior: contain;
            overflow: hidden !important;
          `
        }
      >
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: import.meta.env.VITE_PUBLIC_TITLE },
    {
      name: "description",
      content:
        "Partagez des citations de livres qui participent à l'avènement d'une nouvelle conscience",
    },
    { name: "viewport", content: "width=device-width, initial-scale=1.0" },
    { name: "theme-color", content: "#000000" },
    //{ name: "apple-mobile-web-app-capable", content: "yes" },
    { name: "apple-mobile-web-app-status-bar-style", content: "black" },
    {
      name: "apple-mobile-web-app-title",
      content: import.meta.env.VITE_PUBLIC_TITLE,
    },
  ];
}

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Griffy&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Spectral:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap",
  },
  { rel: "manifest", href: "/manifest.json" },
  {
    rel: "apple-touch-icon",
    sizes: "120x120",
    href: "/icons/apple-touch-icon_120.png",
  },
  {
    rel: "apple-touch-icon",
    sizes: "180x180",
    href: "/icons/apple-touch-icon_180.png",
  },
  //{ rel: "apple-touch-startup-image", href: "/splash/" },
];

const controller = new AbortController();
const signal = controller.signal;
const App = ({ children }) => {
  const dispatch = useDispatch();
  const { screenWidth } = useSelector(getState);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("https://api.ipify.org?format=json");
        const data = await res.json();
        if (data.ip)
          //@ts-expect-error
          dispatch(postIp.initiate({ ip: data.ip }));
      } catch (error) {
        console.log("🚀 ~ error:", error);
      }
    })();

    const updateScreenWidth = () => {
      const newScreenWidth = window.innerWidth - 16;
      if (newScreenWidth !== screenWidth) {
        dispatch(setState({ screenWidth: newScreenWidth }));
      }
    };
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

  return children;
};

export const loader = async (props) => {
  return { userAgent: props.request.headers.get("user-agent") };
};

export default function Root(props) {
  const {
    loaderData: { userAgent },
  } = props;
  const [{ isMobile }] = useDeviceSelectors(userAgent);

  useEffect(() => {
    if (process.env.NODE_ENV === "production")
      splash("/icons/icon-512x512.png", "#000000");
  }, []);

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
      <App>
        <Outlet />
      </App>
    </Provider>
  );
}
