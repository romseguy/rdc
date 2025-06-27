import { isbot } from "isbot";
import { useRoutes } from "react-router";
import { Sitemap } from "~/components";
import { Livre } from "~/routes/Livre";
import { Note } from "~/routes/Note";
import { type BookT, type Note as NoteT, type RootData } from "~/utils";
import { loader as rootLoader } from "./_index";
import Page from "./Page";

export const loader = async (props) => {
  const [, entity, id] = new URL(props.request.url).pathname.split("/");

  if (
    !entity ||
    entity === ".well-known" ||
    typeof id === "undefined" ||
    !["livre", "book", "c", "q"].includes(entity)
  )
    throw new Response("", {
      status: 404,
      statusText: "La page n'a pas été trouvée",
    });

  const data: RootData & { book?: BookT; note?: NoteT } = await rootLoader(
    props,
  );

  if (["livre", "book"].includes(entity)) {
    for (const lib of data.libs) {
      let index = 0;
      for (const b of lib.books || []) {
        if (b.id === id) {
          data.lib = lib;
          data.book = { ...b, index };
        }
        index++;
      }
    }
    if (!data.book)
      throw new Response("", {
        status: 404,
        statusText: "Le livre n'a pas été trouvé",
      });
  } else if (["c", "q"].includes(entity)) {
    for (const lib of data.libs) {
      let index = 0;
      for (const b of lib.books || []) {
        for (const n of b.notes || []) {
          if (n.id === id) {
            data.lib = lib;
            data.book = { ...b, index };
            data.note = n;
          }
        }
        index++;
      }
    }
    if (!data.note)
      throw new Response("", {
        status: 404,
        statusText: "La citation n'a pas été trouvée",
      });
  }

  return data;
};

export default function CatchAllRoute(props) {
  if (isbot()) return <Sitemap {...props} />;

  return useRoutes([
    {
      path: "livre/:id",
      element: <Page element={Livre} locale="fr" {...props} />,
    },
    {
      path: "book/:id",
      element: <Page element={Livre} locale="en" {...props} />,
    },
    {
      path: "c/:id",
      element: <Page element={Note} locale="fr" simple {...props} />,
    },
    {
      path: "q/:id",
      element: <Page element={Note} locale="en" simple {...props} />,
    },
  ]);
}
