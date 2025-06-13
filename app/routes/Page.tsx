import { useStorage } from "@charlietango/hooks/use-storage";
import React, { useEffect, useState } from "react";
import { ToastsContainer } from "~/components/Toast";
import { client, seed } from "~/utils";
import type { Book, Lib, Note, User } from "~/utils/types";

export async function loader({ ...props }) {
  // //console.log("🚀 ~ loader ~ props:", props);

  const noteId = props.params.id;
  // console.log("🚀 ~ loader ~ noteId:", noteId);

  let libs = seed.map((lib, i) => ({ ...lib, id: "" + i } as Lib));
  let out: { libs: Lib[]; lib: Lib; book?: Book; note?: Note } = {
    libs,
    lib: libs[0],
  };

  try {
    const { data } = await client.get();
    if (data.error) {
      libs = libs.map(({ books, ...lib }) => ({
        ...lib,
        books: books?.map(({ ...book }) => ({ ...book, src: undefined })),
      }));

      // TODO
      // if (noteId) {
      //   const note = libs.find((lib) =>
      //     lib.books?.find((book) =>
      //       book.notes?.find((note) => note.id === noteId),
      //     ),
      //   );
      //   const book = libs.find((lib) =>
      //     lib.books?.find((book) => book.id === note.book_id),
      //   );
      //   out = {
      //     ...out,
      //     book,
      //     note,
      //   };
      // }
    } else {
      // //console.log("🚀 ~ loader ~ data:", data.books[0]);
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
                  .filter((note) => note.book_id === book.id)
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
      out.lib = out.libs[0];

      if (noteId) {
        const note = data.notes.find(({ id }) => id === noteId);
        let book = data.books.find(({ id }) => id === note.book_id);
        out.lib = data.libraries.find((lib) => lib.id === book.library_id);
        book = {
          ...book,
          notes: data.notes.filter(({ book_id }) => book_id === book.id),
        };

        out = {
          ...out,
          book,
          note,
        };
      }
    }

    return out;
  } catch (error: any) {
    // console.log("🚀 ~ loader ~ error:", error);
    return out;
  }
  /*
    *{
      if (
        error.message === "FORCE" ||
        error.code === "ENOTFOUND" ||
        error.message.includes("ENOTFOUND") ||
        error.message.includes("Network")
      ) {
        showToast("Vous êtes hors-ligne");
        const seeds = seed.map(({ books, ...fields }, i) => ({
          ...fields,
          id: i + 1,
          books: books?.map(({ src, notes, ...bookFields }, j) => {
            return {
              ...bookFields,
              id: j + 1,
              notes: notes?.map(({ ...noteFields }, k) => {
                return {
                  ...noteFields,
                  id: k + 1,
                };
              }),
            };
          }),
        }));
        setLibs(seeds as Lib[]);
        _setLib(seeds[0] as Lib);
      } else {
        //showToast(error.message, true);
        setLibs(seed as Lib[]);
        _setLib(seed[0] as Lib);
      }
    }/
  }*/
}

export const Page = ({ ...props }) => {
  // console.log("🚀 ~ Page ~ props:", props);
  const { element, params, loaderData } = props;

  //#region auth
  const [accessToken, setAccessToken] = useStorage("accessToken", {
    type: "local",
  });
  const [refreshToken, setRefreshToken] = useStorage("refreshToken", {
    type: "local",
  });
  const [user, setUser] = useState<null | User>();
  useEffect(() => {
    (async () => {
      if (accessToken && refreshToken) {
        client.defaults.headers.common = { at: accessToken, rt: refreshToken };
        const { data: user } = await client.get("/login");
        setUser(user);
      }
    })();
  }, [accessToken, refreshToken]);
  //#endregion
  //#region toast
  const [toasts, setToasts] = useState([]);
  const showToast = (message: string, isError = false) => {
    const toast = {
      id: toasts.length,
      message: message,
      delay: 2500,
      isError,
    };
    setToasts([...toasts, toast].reverse());
  };
  const onToastFinished = (id) => {
    setToasts(toasts.filter((toast) => toast.id !== id));
  };
  //#endregion

  return (
    <>
      <ToastsContainer toasts={toasts} onToastFinished={onToastFinished} />

      <div id="page">
        {React.createElement(element, {
          ...{ loaderData },
          ...{
            showToast,
            accessToken,
            setAccessToken,
            refreshToken,
            setRefreshToken,
            user,
            setUser,
          },
        })}
      </div>
    </>
  );
};

{
  /* {React.Children.map(children, (child) =>
        React.cloneElement(child, { showToast }),
      )} */
}
