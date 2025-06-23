import { isbot } from "isbot";
import { lazy } from "react";
import { getCollections } from "~/api";
import Sitemap from "~/components/Sitemap";
import { Home } from "~/routes/Home";
import { store } from "~/store";
import {
  collections as offlineCollections,
  seed,
  type Lib,
  type RootData,
} from "~/utils";
const Page = lazy(() => import("~/routes/Page"));

export const loader = async (props) => {
  let data: RootData = {
    collections: {},
    libs: seed as Lib[],
    userAgent: props.request.headers.get("user-agent"),
  };

  try {
    const { data: collections, error } = await store().dispatch(
      getCollections.initiate(""),
    );

    if (collections.error || error) {
      data.collections = { ...offlineCollections, libraries: data.libs };
      data.libs = data.libs.map((lib, i) => {
        const id = Number(i + 1).toString();
        return {
          ...lib,
          id,
          books: lib.books?.map((book, j) => {
            const bookId = `${id}${j + 1}`;
            return {
              ...book,
              id: bookId,
              index: j,
              src: undefined,
              notes: book.notes?.map((note, k) => ({
                ...note,
                id: Number(k + 1).toString(),
                book_id: bookId,
              })),
            };
          }),
        };
      });
    } else {
      data.collections = collections;
      data.libs = collections.libraries.map((lib) => {
        return {
          ...lib,
          books: collections.books
            .filter((book) => book.library_id === lib.id)
            .map((book) => {
              return {
                ...book,
                notes: collections.notes
                  ?.filter((note) => note.book_id === book.id)
                  .map((note) => {
                    return {
                      ...note,
                      comments: collections.comments.filter(
                        (comment) => comment.note_id === note.id,
                      ),
                    };
                  }),
              };
            }),
        };
      });
    }

    data.lib = data.libs[0];
    return data;
  } catch (error: any) {
    return data;
  }
};
export default function IndexRoute(props) {
  if (isbot()) return <Sitemap {...props} />;

  return <Page element={Home} {...props} />;
}
