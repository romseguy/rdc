import { isbot } from "isbot";
import { useRoutes } from "react-router";
import { BackButton, Flex, Sitemap } from "~/components";
import type { Route } from "./+types/$";
import Page from "./Page";
import { Separator } from "@radix-ui/themes";

export const loader = async (props: Route.LoaderArgs) => {
  const id = props.params["*"] || "";
  const data = {};

  if (!id.includes("stuff")) {
    console.log("🚀 ~ loader ~ id:", id);
    throw new Response("", {
      status: 404,
      statusText: "La page n'a pas été trouvée",
    });
  }

  return data;
};

export default function CatchAllRoute(props) {
  if (isbot()) return <Sitemap {...props} />;

  return useRoutes([
    {
      path: "stuff",
      element: (
        <Page
          element={(props) => {
            console.log("🚀 ~ /stuff ~ props:", props);
            return (
              <div id="stuff-page">
                <Flex direction="column">
                  <header>
                    <BackButton />
                  </header>
                  <main>
                    <h3>{props.params["*"]}</h3>
                  </main>
                </Flex>
              </div>
            );
          }}
          {...props}
        />
      ),
    },
    {
      path: "stuff/:id",
      element: (
        <Page
          element={(props) => {
            console.log("🚀 ~ /stuff:id ~ props:", props);
            return (
              <div id="stuff-page">
                <Flex direction="column">
                  <header>
                    <BackButton />
                  </header>
                  <main>
                    <h3>{props.params["*"]}</h3>
                  </main>
                </Flex>
              </div>
            );
          }}
          locale="fr"
          {...props}
        />
      ),
    },
  ]);
}
