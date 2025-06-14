import { useStorage } from "@charlietango/hooks/use-storage";
import React, { useEffect, useState } from "react";
import { Header } from "~/components";
import { ToastsContainer } from "~/components/Toast";
import { client, seed } from "~/utils";
import type { Book, Lib, Note, User } from "~/utils/types";

export async function loader({ ...props }) {
  // //console.log("🚀 ~ PageLoader :", props);
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
    }

    return out;
  } catch (error: any) {
    // // console.log("🚀 ~ loader ~ error:", error);
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

  const [lib, _setLib] = useState<Lib>();
  const setLib = (libName: string) => {
    const l = loaderData.libs?.find((li) => li.name === libName);
    if (l) _setLib(l);
  };
  // const [book, setBook] = useState<null | Book>();
  const childProps = {
    ...{ loaderData },
    ...{
      lib,
      setLib,
      // auth
      accessToken,
      setAccessToken,
      refreshToken,
      setRefreshToken,
      user,
      setUser,
      // toast
      showToast,
    },
  };

  return (
    <>
      <ToastsContainer toasts={toasts} onToastFinished={onToastFinished} />

      <div id="page">
        <header>
          <Header
            // lib={lib}
            // setLib={setLib}
            //libs={loaderData.libs}
            // book={book}
            // setBook={setBook}
            // user={user}
            // setUser={setUser}
            // setAccessToken={setAccessToken}
            // setRefreshToken={setRefreshToken}
            // showToast={showToast}
            {...childProps}
          />
        </header>

        <main style={{ maxWidth: "50em", margin: "0 auto" }}>
          {React.createElement(element, childProps)}
        </main>
      </div>
    </>
  );
};

{
  /* {React.Children.map(children, (child) =>
        React.cloneElement(child, { showToast }),
      )} */
}
