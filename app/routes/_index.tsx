import { Home } from "~/routes/Home";
import { Page } from "~/routes/Page";
import { seed, type Lib, client } from "~/utils";
import { isbot } from "isbot";
import Sitemap from "~/components/Sitemap";

export const loader = async () => {
  let data = {
    libs: seed.map((lib, i) => ({ ...lib, id: "" + i } as Lib)),
    lib: seed[0] as Lib,
    is404: true,
  };

  try {
    const { data: collections } = await client.get();

    if (collections.error) {
      data.libs = data.libs.map(({ books, ...lib }) => ({
        ...lib,
        books: books?.map(({ ...book }) => ({ ...book, src: undefined })),
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
    return data;
  }
};
export default function IndexRoute(props) {
  if (isbot()) return <Sitemap {...props} />;
  return <Page element={Home} {...props} />;
}
