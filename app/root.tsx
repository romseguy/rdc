import "./root.scss";
import type { Route } from "./+types/root";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigation,
} from "react-router";
import { useEffect } from "react";
import { css } from "@emotion/react";
import { useScript } from "@charlietango/hooks/use-script";
import { iosPWASplash } from "./utils";

export { ErrorBoundary } from "~/components/ErrorBoundary";

export function Layout({ children }: { children: React.ReactNode }) {
  const status = useScript("https://unpkg.com/pwacompat", {
    attributes: { async: "true", crossOrigin: "anonymous" },
  });
  // console.log("🚀 ~ pwacompat ~ status:", status);
  // const status2 = useScript(
  //   "https://unpkg.com/ios-pwa-splash@1.0.0/cdn.min.js",
  //   {
  //     attributes: { async: "true", crossOrigin: "anonymous" },
  //   },
  // );
  // useEffect(() => {
  // //   console.log("🚀 ~ ios-pwa-splash ~ status:", status2);
  //   if (status2 === "ready")
  //     window.iosPWASplash("/icons/icon-512x512.png", "#000000");
  // }, [status2]);
  const navigation = useNavigation();
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

export default function Root() {
  useEffect(() => {
    if (process.env.NODE_ENV === "production")
      (async () => {
        iosPWASplash("/icons/icon-512x512.png", "#000000");
        const countryIS = "https://api.ipify.org?format=json";

        try {
          const res = await fetch(countryIS);
          const data = res.json();
          //await api.post("/", { ip: data.ip });
        } catch (error) {
          // console.log("🚀 ~ ipLocation ~ error:", error);
        }
      })();
  }, []);

  return <Outlet />;
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

// {navigation.state === "idle" && (
//   <span
//     data-radix-focus-guard
//     tabIndex={0}
//     aria-hidden="true"
//     data-aria-hidden="true"
//     style={{
//       position: "fixed",
//       opacity: 0,
//       pointerEvents: "none",
//       outline: "none",
//     }}
//   />
// )}
