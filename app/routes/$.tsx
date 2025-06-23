import { isbot } from "isbot";
import { useRoutes } from "react-router";
import Sitemap from "~/components/Sitemap";
import { Livre } from "~/routes/Livre";
import { Note } from "~/routes/Note";
import { Page } from "~/routes/Page";
import { BookT, type Note as NoteT, type RootData } from "~/utils";
import type { Route } from "./+types/$";
import { loader as rootLoader } from "./_index";

export const loader = async (props: Route.LoaderArgs) => {
  const data: RootData & { book?: BookT; note?: NoteT } = await rootLoader(
    props,
  );

  const id = props.params["*"] || "";

  if (id.includes("livre") || id.includes("book")) {
    const bookId = id.substring(Number(id.includes("livre") ? 6 : 5));
    for (const lib of data.libs) {
      let index = 0;
      for (const b of lib.books || []) {
        if (b.id === bookId) {
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
  } else if (id.includes("q")) {
    const noteId = id.substring(2);
    for (const lib of data.libs) {
      let index = 0;
      for (const b of lib.books || []) {
        for (const n of b.notes || []) {
          if (n.id === noteId) {
            data.note = n;
            data.book = { ...b, index };
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
  } else
    throw new Response("", {
      status: 404,
      statusText: "La page n'a pas été trouvée",
    });

  if (data.book) {
    const lib = data.libs.find((lib) => lib.id === data.book!.library_id);
    if (lib) data.lib = lib;
  }

  return data;
};

export default function CatchAllRoute(props) {
  if (isbot()) return <Sitemap {...props} />;

  return useRoutes([
    { path: "livre/:id", element: <Page element={Livre} {...props} /> },
    {
      path: "book/:id",
      element: <Page element={Livre} {...props} />,
    },
    {
      path: "q/:id",
      element: <Page element={Note} simple {...props} />,
    },
  ]);
}
