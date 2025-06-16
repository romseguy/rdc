import "./root.scss";
import type { Route } from "./+types/root";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import { useEffect } from "react";

export { ErrorBoundary } from "~/components/ErrorBoundary";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

//

export default function Root({ ...props }) {
  useEffect(() => {
    (async () => {
      const countryIS = "https://api.ipify.org?format=json";

      try {
        const res = await fetch(countryIS);
        const data = res.json();
        //await api.post("/", { ip: data.ip });
      } catch (error) {
        console.log("🚀 ~ ipLocation ~ error:", error);
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
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Pour une nouvelle conscience | recueildecitations.fr" },
    {
      name: "description",
      content:
        "Partagez des citations de livres qui participent à l'avènement d'une nouvelle conscience",
    },
  ];
}
