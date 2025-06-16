import { Home } from "~/routes/Home";
import { Page } from "~/routes/Page";
import { seed, type Lib, client, type RootData } from "~/utils";
import { isbot } from "isbot";
import Sitemap from "~/components/Sitemap";

export const loader = async () => {
  let data: RootData = {
    libs: seed as Lib[],
    lib: seed[0] as Lib,
    is404: true,
  };

  try {
    const { data: collections } = await client.get();

    if (collections.error) {
      data.libs = data.libs.map((lib, i) => ({
        ...lib,
        id: Number(i + 1).toString(),
        books: lib.books?.map((book, j) => ({
          ...book,
          id: Number(j + 1).toString(),
          src: undefined,
          notes: book.notes?.map((note, k) => ({
            ...note,
            id: Number(k + 1).toString(),
            book_id: book.id,
          })),
        })),
      }));
    } else {
      data.libs = collections.libraries.map((lib, i) => {
        return {
          ...lib,
          id: lib.id || i,
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
    console.log("🚀 ~ loader ~ error:", error);
    return data;
  }
};
export default function IndexRoute(props) {
  if (isbot()) return <Sitemap {...props} />;
  return <Page element={Home} {...props} />;
}
