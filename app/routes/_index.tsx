import { Home } from "~/routes/Home";
import { Page } from "~/routes/Page";
import {
  seed,
  type Lib,
  type Book,
  type Note as NoteT,
  client,
  type Seed,
} from "~/utils";
import type { Route } from "./+types/_index";
import { isbot } from "isbot";
import Sitemap from "~/components/Sitemap";

export const loader = async (props: Route.LoaderArgs) => {
  let out: {
    is404: boolean;
    libs: Lib[];
    lib: Lib | Seed;
    book?: Book;
    note?: NoteT;
  } = {
    libs: seed.map((lib, i) => ({ ...lib, id: "" + i } as Lib)),
    lib: seed[0],
    is404: true,
  };

  try {
    const { data } = await client.get();
    if (data.error) {
      out.libs = out.libs.map(({ books, ...lib }) => ({
        ...lib,
        books: books?.map(({ ...book }) => ({ ...book, src: undefined })),
      }));
    } else {
      out.libs = data.libraries.map((lib, i) => {
        return {
          ...lib,
          id: lib.id || i,
          books: data.books
            .filter((book) => book.library_id === lib.id)
            .map((book) => {
              return {
                ...book,
                notes: data.notes
                  ?.filter((note) => note.book_id === book.id)
                  .map((note) => {
                    return {
                      ...note,
                      comments: data.comments.filter(
                        (comment) => comment.note_id === note.id,
                      ),
                    };
                  }),
              };
            }),
        };
      });
    }

    out.lib = out.libs[0];
    return out;
  } catch (error: any) {
    return out;
  }
};
export default function IndexRoute({ ...props }) {
  if (isbot()) return <Sitemap {...props} />;
  return <Page element={Home} {...props} />;
}
