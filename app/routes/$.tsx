import "@radix-ui/themes/styles.css";
import { isbot } from "isbot";
import { useRoutes } from "react-router";
import Sitemap from "~/components/Sitemap";
import { Page } from "~/routes/Page";
import { Livre } from "~/routes/Livre";
import { Note } from "~/routes/Note";

import { loader as rootLoader } from "./_index";
import type { Route } from "./+types/$";
export const loader = async (props: Route.LoaderArgs) => {
  const data = await rootLoader(props);
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
    if (data.book) data.is404 = false;
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
    if (data.book && data.note) data.is404 = false;
  }

  data.lib =
    data.libs.find((lib) => lib.id === data.book?.library_id) || data.libs[0];
  return data;
};
export default function CatchAllRoute(props) {
  const loaderData = props.loaderData || {};
  const { is404 } = loaderData;
  if (is404) return "404";
  if (isbot()) return <Sitemap {...props} />;

  return useRoutes([
    {
      path: "livre/:id",
      element: <Page element={Livre} loaderData={loaderData} {...props} />,
    },
    { path: "note/:id", element: <Note loaderData={loaderData} {...props} /> },
  ]);
}
