import { useDebouncedCallback } from "@charlietango/hooks/use-debounced-callback";
import { useStorage } from "@charlietango/hooks/use-storage";
import { MailTo, MailToBody, MailToTrigger } from "@slalombuild/react-mailto";
import { StrictMode, useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import SplitPane from "react-split-pane";
import { Switch, Route, getRouter } from "navigo-react";
import "./App.scss";
import { client, prefix } from "./client";
import { toCss } from "./utils";
import {
  ErrorBoundary,
  FallbackProps,
  useErrorBoundary,
} from "react-error-boundary";
import { css } from "@emotion/react";
import { Note } from "./Note";
import { ToastsContainer } from "./Toast";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
type User = { email: string };
type Note = { desc: string };
type Book = {
  id: string;
  title?: string;
  notes?: Note[];
  src?: string;
};
type Lib = {
  id: string;
  name: string;
  books: PartialBy<Book, "id">[];
};

const seed: Partial<Lib>[] = [
  {
    name: "L'onde",
    books: [
      {
        title: "L'onde 1",
        src: "https://image.jimcdn.com/app/cms/image/transf/dimension=141x10000:format=png/path/sd7739c2374e37db5/image/id624acc08d96ca45/version/1456401001/image.png",
        notes: [{ id: "1", desc: "desc" }],
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
    books: [
      {
        title: "Psychologie évolutionnaire",
      },
    ],
  },
];

function App() {
  const { showBoundary } = useErrorBoundary();
  //#region auth
  const [accessToken, setAccessToken] = useStorage("accessToken", {
    type: "local",
  });
  useEffect(() => {
    client.defaults.headers.common["at"] = accessToken;
    client.defaults.headers.common["rt"] = refreshToken;
  }, [accessToken]);
  const [refreshToken, setRefreshToken] = useStorage("refreshToken", {
    type: "local",
  });
  const [user, setUser] = useState<null | User>();
  //#endregion

  //#region state
  // const urlParams = new URLSearchParams(window.location.search);
  // const code = urlParams.get("code");
  const [isLoading, setIsLoading] = useState(true);
  const [libs, setLibs] = useState<Lib[]>();
  console.log("🚀 ~ libs:", libs);
  const [lib, _setLib] = useState<Lib>();
  const setLib = (libName: string) => {
    const l = libs?.find((li) => li.name === libName);
    if (l) _setLib(l);
  };
  const [bookIndex, setBookIndex] = useState<null | number>(null);
  const [book, setBook] = useState<null | Book | PartialBy<Book, "id">>();
  const notes: Note[][] = useMemo(() => {
    if (!book || !book.notes) return [[]];
    const rows: Note[] = [...book.notes].sort((a, b) => {
      return a.id > b.id ? -1 : 1;
    });
    let c = -1;
    let i = 0;
    let els = [];
    for (const row of rows) {
      const n = { ...row, index: i };
      if (i % 3 === 0) {
        els.push([n]);
        ++c;
      } else {
        els[c].push(n);
      }
      ++i;
    }
    return els;
  }, [book]);
  const url = getRouter().getCurrentLocation().url;
  const [currentNoteIndex, setCurrentNoteIndex] = useState<null | number>(
    url.startsWith("note") ? url.substring(5, url.length) : null,
  );
  //#endregion

  //#region callbacks
  const getLibsOnce = useDebouncedCallback(async function getLibs() {
    try {
      if (!libs) {
        const { data } = await client.get(prefix);
        const libraries = data.libraries.map((lib) => {
          return {
            ...lib,
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
      }
      setIsLoading(false);
    } catch (error: any) {
      if (error.toString().includes("Network")) {
        setLibs(seed as Lib[]);
        _setLib(seed[0] as Lib);
        setIsLoading(false);
      }
    }
  }, 0);
  const getNote = useDebouncedCallback(async function getNote(id) {
    try {
      const { data: note } = await client.get(prefix + "/note?id=" + id);
      const book = lib?.books.find((b) => {
        return b.id === note.book_id;
      });
      // we found the book belonging to the note!
      setBook(book);
    } catch (error: any) {
      if (error.toString().includes("Network")) {
      }
    }
  }, 0);
  const login = useDebouncedCallback(async function login() {
    const task = async () => {
      if (accessToken) {
        const { data } = await client.get(
          prefix + "/login?at=" + accessToken + "&rt=" + refreshToken,
        );
        setUser(data);
      }
    };
    //setInterval(task, 1000 * 30);
    task();
  }, 0);
  //#endregion

  //#region effects
  window.onerror = (event, source, lineno, colno, error) => {
    showBoundary(error);
    //setError(error);
  };
  useEffect(() => {
    getLibsOnce();
  }, []);
  useEffect(() => {
    login();
  }, [accessToken, refreshToken]);
  useEffect(() => {
    if (currentNoteIndex === null) {
      getRouter().navigate("/");
      return;
    }

    if (!getRouter().getCurrentLocation().url.startsWith("/note")) {
      getRouter().navigateByName("note", { id: currentNoteIndex });
    }

    if (lib) {
      getNote(currentNoteIndex);
    }
  }, [currentNoteIndex, lib]);
  //#endregion

  //if (isLoading) return "Chargement...";
  // if (!libs) throw new Error("Aucune bibliothèques");
  // if (!lib) throw new Error("Aucune bibliothèque sélectionnée");

  const Back = ({ onClick }) => (
    <button css={toCss({ margin: "12px" })} onClick={onClick}>
      {"<"} Retour
    </button>
  );

  const [toasts, setToasts] = useState([]);

  const showToast = (message) => {
    const toast = {
      id: toasts.length,
      message: message,
      delay: 2500,
    };
    setToasts([...toasts, toast].reverse());
  };

  const onToastFinished = (id) => {
    setToasts(toasts.filter((toast) => toast.id !== id));
  };

  return (
    <>
      <ToastsContainer toasts={toasts} onToastFinished={onToastFinished} />

      <Switch>
        <Route path="/note/:id" name="note">
          {currentNoteIndex !== null && (
            <div className="Resizer ">
              <SplitPane
                split="horizontal"
                defaultSize={window.innerHeight / 2}
                paneStyle={{ overflowY: "scroll", padding: "12px" }}
              >
                {/* note */}
                <div>
                  <div css={toCss({ display: "flex", alignItems: "center" })}>
                    <Back
                      onClick={() => {
                        setCurrentNoteIndex(null);
                        getRouter().navigate("/");
                      }}
                    />
                    Citation du livre : {book?.id}
                  </div>
                  <br />
                  {/*@ts-expect-error*/}
                  {book?.notes?.find(({ id }) => id === currentNoteIndex).desc}
                  <br />
                </div>

                {/* comments */}
                <div>
                  <div
                    css={toCss({
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    })}
                  >
                    <h1>Vos réflexions</h1>
                    <button>Ajouter</button>
                  </div>
                  <p>Test</p>
                  <p>Test</p>
                  <p>Test</p>
                  <p>Test</p>
                  <p>Test</p>
                  <p>Test</p>
                  <p>Test</p>
                  <p>Test</p>
                  <p>Test</p>
                  <p>Test</p>
                  <p>Test</p>
                  <p>Test</p>
                  <p>Test</p>
                  <p>Test</p>
                  <p>Test</p>
                  <p>Test</p>
                  <p>Test</p>
                  <p>Test</p>
                  <p>Test</p>
                  <p>Test</p>
                  <p>Test</p>
                  <p>Test</p>
                  <p>Test</p>
                  <p>Test</p>
                  <p>Test</p>
                  <p>Test</p>
                  <p>Test</p>
                  <p>Test</p>
                  <p>Test</p>
                  <p>Test</p>
                  <p>Test</p>
                  <p>Test</p>
                  <p>Test</p>
                  <p>Test</p>
                  <p>Test</p>
                  <p>Test</p>
                  <p>Test</p>
                </div>
              </SplitPane>
            </div>
          )}
        </Route>

        <Route path="/">
          <div className="Resizer ">
            <SplitPane
              css={toCss({ position: "unset !important" })}
              split="horizontal"
              defaultSize={bookIndex === -1 || book ? 60 : 300}
              maxSize={250}
              //primary="second"
              pane1Style={{
                //height: "unset",
                // display: "flex",
                // alignItems: "center",
                // whiteSpace: "nowrap",
                overflowX: bookIndex === -1 || book ? "hidden" : "scroll",
                paddingTop: !book ? "12px" : 0,
              }}
              pane2Style={
                {
                  // padding: "12px",
                  //margin: "0 " + window.innerHeight / 3 + "px",
                  //overflowY: "scroll",
                  //overflowX: "scroll",
                  //maxHeight: window.innerHeight - 270 + "px"
                }
              }
            >
              <header>
                <div
                  css={toCss({
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  })}
                >
                  {/* COVERS : no book selected */}
                  {!book && bookIndex !== -1 && (
                    <>
                      {/* <button
                      css={toCss({})}
                      onClick={() => {
                        setBookIndex(-1);
                        setBook(null);
                      }}
                    >
                      Tous es livres
                    </button> */}
                      {!book && (
                        <div
                          css={toCss({
                            display: "flex",
                            flexDirection: "column",
                            gap: "12px",
                            paddingLeft: "12px",
                          })}
                        >
                          <div
                            css={toCss({
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                            })}
                          >
                            <button
                              css={toCss({
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                              })}
                              onClick={async (e) => {
                                e.stopPropagation();

                                if (user) {
                                  const ok = confirm(
                                    "Êtes-vous sûr de vouloir vous déconnecter?",
                                  );
                                  if (ok) {
                                    setAccessToken();
                                    setRefreshToken();
                                    setUser(null);
                                  }
                                } else {
                                  const email = prompt(
                                    "Saisissez votre adresse e-mail",
                                  );
                                  const password = prompt(
                                    "Saisissez votre mot de passe",
                                  );

                                  if (email && password) {
                                    const {
                                      data: { session, user },
                                    } = await client.post(prefix + "/login", {
                                      email,
                                      password,
                                    });

                                    setAccessToken(session.access_token);
                                    setRefreshToken(session.refresh_token);
                                  }
                                }
                              }}
                            >
                              <svg
                                stroke="currentColor"
                                fill="currentColor"
                                strokeWidth="0"
                                viewBox="0 0 448 512"
                                height="1em"
                                width="1em"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"></path>
                              </svg>
                              {user ? (
                                <div css={toCss({})}>{user.email}</div>
                              ) : (
                                "Connexion"
                              )}
                            </button>
                            <div
                              css={toCss({
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                              })}
                            >
                              Bibliothèque :
                              <select>
                                <option>{lib?.name}</option>
                              </select>
                            </div>
                          </div>
                          <div css={toCss({ display: "flex" })}>
                            {lib?.books.map((book, index) => {
                              if (bookIndex !== null && index !== bookIndex)
                                return null;
                              if (book.src)
                                return (
                                  <img
                                    key={"book-" + index}
                                    src={book.src}
                                    css={toCss({ cursor: "pointer" })}
                                    onClick={() => {
                                      if (bookIndex !== index) {
                                        setBookIndex(index);
                                        setBook(lib.books[index]);
                                      }
                                    }}
                                  />
                                );

                              return (
                                <div
                                  key={"book-" + index}
                                  css={toCss({
                                    display: "flex",
                                    alignItems: "center",
                                    border: "1px solid white",
                                    height: "150px",
                                    padding: "24px",
                                    cursor: "pointer",
                                  })}
                                  onClick={() => {
                                    if (bookIndex !== index) {
                                      setBookIndex(index);
                                      setBook(lib.books[index]);
                                    }
                                  }}
                                >
                                  {book.title}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* HEADER : all books selected */}
                  {bookIndex === -1 && (
                    <div>
                      <Back
                        onClick={() => {
                          setBookIndex(null);
                        }}
                      />
                      Tous les livres de la bibliothèque <i>{lib.name}</i>
                    </div>
                  )}

                  {/* HEADER : book selected */}
                  {book && (
                    <div css={toCss({ display: "flex", alignItems: "center" })}>
                      <Back
                        onClick={() => {
                          setBook(null);
                          setBookIndex(null);
                        }}
                      />
                      {book.title && (
                        <div>
                          Livre : <i>{book.title}</i>
                        </div>
                      )}

                      {!book.title && (
                        <div>
                          Livre {book.id} de la bibliothèque : <i>{lib.name}</i>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </header>

              <main>
                {/* libs */}
                {!book && bookIndex !== -1 && <></>}

                {/* book */}
                {(book || bookIndex === -1) && (
                  <SplitPane
                    css={toCss({ position: "relative" })}
                    split="horizontal"
                    defaultSize={window.innerHeight - 125}
                    maxSize={window.innerHeight - 60}
                    //primary="second"
                    pane1Style={{
                      //height: "unset",
                      //whiteSpace: "nowrap",
                      overflowY: "scroll",
                      overflowX: "hidden",
                    }}
                    pane2Style={
                      {
                        //margin: "0 " + window.innerHeight / 3 + "px",
                        //overflowY: "scroll",
                        //overflowX: "scroll",
                        //maxHeight: window.innerHeight - 270 + "px"
                      }
                    }
                  >
                    <div css={toCss({ width: "100%", padding: "24px" })}>
                      {bookIndex === -1 && (
                        <h1>
                          Notes de la bibliothèque <i>{lib.name}</i>
                        </h1>
                      )}
                      {/* {book && (
                      <div
                        css={toCss({
                          textAlign: "center",
                          marginBottom: "12px",
                        })}
                      >
                        <h1>
                          Citations du livre : <i>{book.title}</i>
                        </h1>
                      </div>
                    )} */}

                      {/* editable notes */}
                      {notes.map((row, index) => {
                        return (
                          <div key={"row-" + index}>
                            {row
                              .filter((note) => note.isEditing)
                              .map((note) => {
                                return (
                                  <div key={"note-" + index}>
                                    <Note note={note} isEditing />

                                    <div
                                      css={toCss({
                                        display: "flex",
                                        justifyContent: "space-between",
                                        marginBottom: "12px",
                                      })}
                                    >
                                      <button
                                        css={toCss({ background: "red" })}
                                        onClick={() => {
                                          setBook({
                                            ...book,
                                            notes: book?.notes
                                              ?.filter((n) => {
                                                if (!note.isNew) return true;
                                                return n.id !== note.id;
                                              })
                                              .map((n) => ({
                                                ...n,
                                                isEditing: false,
                                              })),
                                          });
                                        }}
                                      >
                                        Annuler
                                      </button>

                                      <button
                                        css={toCss({ background: "green" })}
                                        onClick={async () => {
                                          setBook({
                                            ...book,
                                            notes: book?.notes?.map((n) => {
                                              if (n.id === note.id)
                                                return {
                                                  ...note,
                                                  isNew: false,
                                                  isEditing: false,
                                                };
                                              return n;
                                            }),
                                          });

                                          try {
                                            let data;
                                            if (note.isNew) {
                                              const res = await client.post(
                                                prefix + "/notes",
                                                {
                                                  note: {
                                                    ...note,
                                                    book_id: book.id,
                                                  },
                                                },
                                              );
                                              data = res.data;
                                            } else {
                                              const res = await client.put(
                                                prefix + "/note",
                                                {
                                                  note,
                                                },
                                              );
                                              data = res.data;
                                            }

                                            if (data.error) {
                                              throw new Error(data.message);
                                            }
                                          } catch (error) {
                                            // console.log(
                                            // "🚀 ~ onClick={ ~ error:",
                                            // error,
                                            // );
                                          }
                                        }}
                                      >
                                        Valider
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        );
                      })}

                      {/* readonly notes */}
                      {notes.map((row, index) => {
                        return (
                          <div
                            key={"note-" + index}
                            style={
                              {
                                //display: "flex"
                              }
                            }
                          >
                            {row
                              .filter((note) => !note.isEditing)
                              .map((note, index) => {
                                return (
                                  <Note
                                    key={"note-" + index}
                                    note={note}
                                    onOpenClick={() => {
                                      setCurrentNoteIndex(index);
                                    }}
                                    onEditClick={() => {
                                      setBook({
                                        ...book,
                                        notes: book?.notes?.map((n) => {
                                          if (n.id === note.id)
                                            return { ...n, isEditing: true };
                                          return n;
                                        }),
                                      });
                                    }}
                                    onDeleteClick={async () => {
                                      const ok = confirm(
                                        "Êtes-vous sûr de vouloir supprimer cette citation ?",
                                      );
                                      if (ok) {
                                        setBook({
                                          ...book,
                                          notes: book?.notes?.filter(
                                            (n) => n.id !== note.id,
                                          ),
                                        });
                                        await client.delete(
                                          prefix + "/note?id=" + note.id,
                                        );
                                      }
                                    }}
                                    onSubmitCommentClick={async (comment) => {
                                      const { data } = await client.post(
                                        prefix + "/comments",
                                        {
                                          comment,
                                        },
                                      );
                                      if (data.error) {
                                        showToast(data.message);
                                        return;
                                      }

                                      setBook({
                                        ...book,
                                        notes: book?.notes?.map((n) => {
                                          if (n.id === note.id) {
                                            return {
                                              ...n,
                                              comments: n.comments.concat([
                                                data,
                                              ]),
                                            };
                                          }
                                          return n;
                                        }),
                                      });
                                    }}
                                    onDeleteCommentClick={async (comment) => {
                                      const ok = confirm(
                                        "Êtes-vous sûr de vouloir supprimer ce commentaire ?",
                                      );

                                      if (ok) {
                                        const { data } = await client.delete(
                                          prefix + "/comment?id=" + comment.id,
                                        );
                                        if (data.error) {
                                          showToast(data.message);
                                          return;
                                        }

                                        setBook({
                                          ...book,
                                          notes: book?.notes?.map((n) => {
                                            if (n.id === note.id) {
                                              return {
                                                ...n,
                                                comments: n.comments.filter(
                                                  (c) => c.id !== comment.id,
                                                ),
                                              };
                                            }
                                          }),
                                        });
                                      }
                                    }}
                                  />
                                );
                              })}
                          </div>
                        );
                      })}
                    </div>

                    {/* add note */}
                    <div>
                      <button
                        css={toCss({ margin: "12px 0 0 12px" })}
                        disabled={!!book?.notes?.find(({ isNew }) => isNew)}
                        onClick={() => {
                          const id = book?.notes.length + 1;
                          setBook({
                            ...book,
                            notes: book.notes.concat([
                              {
                                id: id.toString(),
                                isEditing: true,
                                isNew: true,
                              },
                            ]),
                          });
                        }}
                      >
                        Ajouter une citation
                      </button>
                    </div>
                  </SplitPane>
                )}
              </main>
            </SplitPane>
          </div>
        </Route>
      </Switch>
    </>
  );
}

const Fallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <div
      css={css`
        padding: 0 12px;
      `}
    >
      <h1>Erreur !</h1>
      <p>
        <i>
          <b>
            <span style={{ color: "red" }}>{error.message}</span>
          </b>
        </i>
      </p>
      <p>
        <MailTo
          to={import.meta.env.VITE_PUBLIC_EMAIL}
          subject="Rapport d'erreur"
          //cc={["cc1@example.com", "cc2@example.com"]}
          //bcc={["bcc@example.com"]}
          obfuscate
        >
          <MailToTrigger>
            Envoyer un message pour m'aider à améliorer le site
          </MailToTrigger>
          <MailToBody>
            - Décrivez ci-dessous ce qui vous a fait rencontrer une erreur :
            <br />
            <br />
            J'ai cliqué sur la couverture d'un livre
            <br />
            <br />
            - Contenu de l'erreur :
            <br />
            <br />
            {error.message}
          </MailToBody>
        </MailTo>
      </p>
      <button
        onClick={() => {
          resetErrorBoundary();
        }}
      >
        {"<"} Retour
      </button>
    </div>
  );
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary fallbackRender={Fallback}>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);

{
  /*
import Responsive from "react-grid-layout";
const MyFirstGrid = ({ children }) => {
  // layout is an array of objects, see the demo for more complete usage
  const layout = [
    { i: "note-0", x: 0, y: 0, w: 1, h: 1, static: true },
    { i: "note-1", x: 1, y: 0, w: 1, h: 1, minW: 1, maxW: 3 },
    { i: "note-2", x: 2, y: 0, w: 1, h: 1 },
    { i: "note-3", x: 0, y: 1, w: 1, h: 1, static: false },
    { i: "note-4", x: 1, y: 1, w: 1, h: 1, minW: 1, maxW: 1 },
    { i: "note-5", x: 2, y: 1, w: 1, h: 1 },
    { i: "note-6", x: 2, y: 1, w: 1, h: 1 }
  ];
  const cols = Math.round(window.innerWidth / 150);
  const onC = useCallback(() => console.log("???"), []);
  return (
    <Responsive
      layout={layout}
      cols={3}
      //rowHeight={30}
      width={window.innerWidth / 2 - 50}
    >
      {children.map((child) => (
        <div
          key={"note-" + child.index}
          css={toCss({
            background: "red",
            overflowY: "hidden"
          }}
        >
          <div onClick={onC}>{child.desc}</div>
        </div>
      ))}
    </Responsive>
  );
};
  */
}

{
  /* {[
              {
                index: 0,
                desc: "very long very long very long very long very long very long very long very long very long very long very long very long very long very long very long very long very long very long very long very long very long very long very long very long very long very long very long very long very long very long very long very long very long very long",
              },
              { index: 1, desc: "baaaaaaaaaaaaaaaaaaaaaa" },
              { index: 2, desc: "c" },
              { index: 3, desc: "b" },
              { index: 4, desc: "c" },
              { index: 5, desc: "b" },
              { index: 6, desc: "c" },
            ].map((note, index) => {
              const Note = (
                <div
                  key={"note-" + index}
                  css={toCss({
                    background: "red",
                    //height: "100px",
                    minHeight: `${window.innerHeight - 370}px`,
                    minWidth: "200px",
                    overflow: "hidden",
                    marginLeft: "10px",
                  }}
                  onClick={() => {
                    console.log(index);
                    //onClick(index);
                  }}
                >
                  <Note note={note} index={index} />
                  {note.desc}
                </div>
              );
              return (
                <>
                  {index % 2 === 0 ? (
                    <div
                      css={toCss({
                        display: "flex",
                        //minHeight: "150px",
                        //minWidth: "150px"
                        //margin: "0 auto"
                      }}
                    >
                      {Note}
                    </div>
                  ) : (
                    <div>{Note}</div>
                  )}
                </>
              );
            })} */
}
