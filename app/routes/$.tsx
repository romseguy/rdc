import { isbot } from "isbot";
import { useLocation, useRoutes } from "react-router";
import Sitemap from "~/components/Sitemap";
import { Page } from "~/routes/Page";
import { Livre } from "~/routes/Livre";
import { Note } from "~/routes/Note";

import { loader as rootLoader } from "./_index";
import type { Route } from "./+types/$";
import type { Book, Note as NoteT, RootData } from "~/utils";

export const loader = async (props: Route.LoaderArgs) => {
  const data: RootData & { book?: Book; note?: NoteT } = await rootLoader(
    props,
  );
  const id = props.params["*"] || "";

  if (id.includes("livre")) {
    const bookId = id.substring(6);
    for (const lib of data.libs) {
      for (const b of lib.books || []) {
        if (b.id === bookId) {
          data.book = b;
        }
      }
    }
    if (!data.book)
      throw new Response("", {
        status: 404,
        statusText: "Le livre n'a pas été trouvé",
      });
  } else if (id.includes("note")) {
    const noteId = id.substring(5);
    for (const lib of data.libs) {
      for (const b of lib.books || []) {
        for (const n of b.notes || []) {
          if (n.id === noteId) {
            data.note = n;
            data.book = lib.books?.find((book) => book.id === n.book_id);
          }
        }
      }
    }
    if (!data.note)
      throw new Response("", {
        status: 404,
        statusText: "La citation n'a pas été trouvée",
      });
  }

  if (data.book) {
    const lib = data.libs.find((lib) => lib.id === data.book!.library_id);
    if (lib) data.lib = lib;
  } else if (!data.note)
    throw new Response("", {
      status: 404,
      statusText: "La page n'a pas été trouvée",
    });

  return data;
};

export default function CatchAllRoute(props) {
  if (isbot()) return <Sitemap {...props} />;

  return useRoutes([
    {
      path: "livre/:id",
      element: <Page element={Livre} {...props} />,
    },
    {
      path: "note/:id",
      element: <Page element={Note} simple {...props} />,
    },
  ]);
}
