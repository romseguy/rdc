import { isbot } from "isbot";
import { getCollections } from "~/api";
import { Sitemap } from "~/components";
import { Home } from "~/routes/Home";
import { store } from "~/store";
import {
  collections as offlineCollections,
  seed,
  type Lib,
  type RootData,
  type Seed,
} from "~/utils";
import type { Route } from "../+types/root";
import Page from "./Page";

export const loader = async (props: Route.LoaderArgs) => {
  let data: RootData = {
    libs: seed,
    lib: seed[0] as Seed,
  };

  try {
    const { data: collections } = await store().dispatch(
      getCollections.initiate(""),
    );
    if (!collections || collections.error) {
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

    data.lib = data.libs[0] as Seed | Lib;
    return data;
  } catch (error: any) {
    return data;
  }
};

export default function IndexRoute(props) {
  if (isbot()) return <Sitemap {...props} />;
  return <Page element={Home} {...props} />;
}
