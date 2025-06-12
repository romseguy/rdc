import "~/screens/App.scss";
import { useDebouncedCallback } from "@charlietango/hooks/use-debounced-callback";
import { useStorage } from "@charlietango/hooks/use-storage";
import { useEffect, useState } from "react";
import {
  client,
  prefix,
  toCss,
  BackButton,
  type Lib,
  type User,
  type Book,
  type Note as NoteT,
  type Seed,
} from "~/utils";
import { useNavigate, type LoaderFunctionArgs } from "react-router";

const seed: Seed[] = [
  {
    name: "L'onde",
    author: "Laura Knight-Jadczyk",
    books: [
      {
        title: "L'onde 1",
        src: "https://image.jimcdn.com/app/cms/image/transf/dimension=141x10000:format=png/path/sd7739c2374e37db5/image/id624acc08d96ca45/version/1456401001/image.png",
        notes: [
          { page: 123, desc: "desc", desc_en: "en" },
          { page: 12, desc: "test" },
        ],
      },
      {
        title: "L'onde 2",
        src: "https://image.jimcdn.com/app/cms/image/transf/dimension=144x10000:format=png/path/sd7739c2374e37db5/image/i8178498c4ef29a55/version/1456401004/image.png",
        notes: [{ desc: "Bonjour" }],
      },
      {
        title: "L'onde 3",
        src: "https://image.jimcdn.com/app/cms/image/transf/dimension=147x10000:format=png/path/sd7739c2374e37db5/image/i36668e68d2f5597e/version/1456401007/image.png",
        notes: [{ desc: "Bonjour" }],
      },
      {
        title: "L'onde 4",
        src: "https://image.jimcdn.com/app/cms/image/transf/dimension=151x10000:format=png/path/sd7739c2374e37db5/image/i748f4eea536ae9dd/version/1456401010/image.png",
        notes: [{ desc: "Bonjour" }],
      },
      {
        title: "L'onde 5",
        src: "https://image.jimcdn.com/app/cms/image/transf/dimension=139x10000:format=png/path/sd7739c2374e37db5/image/i10fdfe9c63199de1/version/1456401041/image.png",
        notes: [{ desc: "Bonjour" }],
      },
      {
        title: "L'onde 6",
        src: "https://image.jimcdn.com/app/cms/image/transf/dimension=144x10000:format=png/path/sd7739c2374e37db5/image/if5623d4563d7c52c/version/1456401069/image.png",
        notes: [{ desc: "Bonjour" }],
      },
      {
        title: "L'onde 7",
        src: "https://image.jimcdn.com/app/cms/image/transf/dimension=148x10000:format=png/path/sd7739c2374e37db5/image/i5faf04f8fa6b2fae/version/1456401098/image.png",
        notes: [{ desc: "Bonjour" }],
      },
      {
        title: "L'onde 8",
        src: "https://image.jimcdn.com/app/cms/image/transf/dimension=152x10000:format=png/path/sd7739c2374e37db5/image/id1247c1da4dfbf55/version/1456401115/image.png",
        notes: [{ desc: "Bonjour" }],
      },
    ],
  },
  {
    name: "BDM",
    author: "Bernard de Montréal",
    books: [
      {
        title: "Psychologie évolutionnaire",
      },
    ],
  },
];

// export async function loader({ params }: LoaderFunctionArgs) {
//   return params;
//   //                    ^? { categoryId: string; productId: string }
// }

export default function Note({ params, ...props }) {
  const navigate = useNavigate();
  const getRouter = () => ({
    getCurrentLocation: () => ({ url: "note" }),
    navigate,
    navigateByName: () => {},
  });
  const noteId = params.id;

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

  //#region auth
  const [accessToken, setAccessToken] = useStorage("accessToken", {
    type: "local",
  });
  const [refreshToken, setRefreshToken] = useStorage("refreshToken", {
    type: "local",
  });
  useEffect(() => {
    (async () => {
      if (user !== null && accessToken && refreshToken) {
        client.defaults.headers.common["at"] = accessToken;
        client.defaults.headers.common["rt"] = refreshToken;
        const { data } = await client.get(prefix + "/login");
        if (data.error) {
          //showToast(data.message, true);
          setUser(null);
        } else setUser(data);
      }
    })();
  }, [accessToken, refreshToken]);
  const [user, setUser] = useState<null | User>();
  //#endregion

  //#region state
  const [locale, setLocale] = useState("fr");
  //const url = getRouter().getCurrentLocation().url;
  // const urlParams = new URLSearchParams(window.location.search);
  // const code = urlParams.get("code");
  const [isLoading, setIsLoading] = useState<
    Record<string, boolean> & { global: boolean }
  >({ global: true });
  const [libs, setLibs] = useState<Lib[]>();
  const [lib, _setLib] = useState<Lib>();
  const setLib = (libName: string) => {
    const l = libs?.find((li) => li.name === libName);
    if (l) _setLib(l);
  };
  const [book, setBook] = useState<null | Book>();
  const [note, setNote] = useState<null | NoteT>(null);
  //#endregion

  //#region callbacks
  const load = useDebouncedCallback(async function getLibs() {
    try {
      if (!libs) {
        const { data } = await client.get(prefix);
        //throw new Error("FORCE");
        if (data.error) throw new Error(data.message);

        const libraries = data.libraries.map((lib, i) => {
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
        setLibs(libraries);
        _setLib(libraries[0]);

        if (getRouter().getCurrentLocation().url.startsWith("note")) {
          //const noteId = url.substring(5, url.length);
          const note = data.notes.find(({ id }) => id === noteId);
          setNote(note);
          const book = data.books.find(({ id }) => id === note.book_id);
          setBook({
            ...book,
            notes: data.notes.filter(({ book_id }) => book_id === book.id),
          });
        }
      }
      setIsLoading({ ...isLoading, global: false });
    } catch (error: any) {
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
        showToast(error.message, true);
        setLibs(seed as Lib[]);
        _setLib(seed[0] as Lib);
      }
      setIsLoading({ ...isLoading, global: false });
    }
  }, 0);
  //#endregion

  //#region effects
  // window.onerror = (event, source, lineno, colno, error) => {
  //   showBoundary(error);
  // };
  // window.onload = () => {
  //   load();
  // };
  useEffect(() => {
    load();
  }, []);
  //#endregion

  return (
    <>
      {note === null && (
        <div className="spinner">
          <span>Veuillez patienter...</span>
        </div>
      )}
      {note !== null && (
        <>
          <div
            css={toCss({
              display: "flex",
              alignItems: "center",
              padding: "12px",
            })}
          >
            <BackButton
              style={{ marginRight: "6px" }}
              onClick={() => {
                getRouter().navigate(-1);
              }}
            />

            <h1>
              Citation du livre{" "}
              <i>
                {book?.title
                  ? ": " + book.title
                  : "" + book?.id + " de la bibliothèque " + lib?.name}
              </i>
            </h1>
          </div>

          <div
            css={toCss({ padding: "12px" })}
            dangerouslySetInnerHTML={{ __html: note.desc }}
          />
        </>
      )}
    </>
  );
}
