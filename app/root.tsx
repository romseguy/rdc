import { useScript } from "@charlietango/hooks/use-script";
import { css } from "@emotion/react";
import {
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
  useNavigation,
} from "react-router";
import { App } from "./app";
import "./root.scss";
import { Route } from "./routes/+types/$";

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
        import.meta.env.LOCALE === "fr"
          ? "Partagez des citations qui participent à l'avènement d'une nouvelle conscience"
          : "Share quotes for the advent of a new evolution",
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

export const loader = async (props) => {
  return { userAgent: props.request.headers.get("user-agent") };
};

export default function Root(props) {
  return <App {...props} />;
}
