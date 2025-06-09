import { useDebouncedCallback } from "@charlietango/hooks/use-debounced-callback";
import { useStorage } from "@charlietango/hooks/use-storage";
import { MailTo, MailToBody, MailToTrigger } from "@slalombuild/react-mailto";
import { StrictMode, useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { isMobile } from "react-device-detect";
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
import { Lib, User, Book, PartialBy, Note as NoteT } from "./types";
import { Header } from "./Header";

const seed: Partial<Lib>[] = [
  {
    id: "1",
    name: "L'onde",
    author: "Laura Knight-Jadczyk",
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
    id: "2",
    name: "BDM",
    author: "Bernard de Montréal",
    books: [
      {
        title: "Psychologie évolutionnaire",
      },
    ],
  },
];

function App() {
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
          showToast(data.message, true);
          setUser(null);
        } else setUser(data);
      }
    })();
  }, [accessToken, refreshToken]);
  const [user, setUser] = useState<null | User>();
  //#endregion

  //#region state
  const url = getRouter().getCurrentLocation().url;
  // const urlParams = new URLSearchParams(window.location.search);
  // const code = urlParams.get("code");
  const [isLoading, setIsLoading] = useState(true);
  const [libs, setLibs] = useState<Lib[]>();
  const [lib, _setLib] = useState<Lib>();
  const setLib = (libName: string) => {
    const l = libs?.find((li) => li.name === libName);
    if (l) _setLib(l);
  };
  const [book, setBook] = useState<null | Book | PartialBy<Book, "id">>();
  const notes: NoteT[][] = useMemo(() => {
    if (!book || !book.notes) return [[]];
    const rows: NoteT[] = [...book.notes].sort((a, b) => {
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
  const [note, setNote] = useState<null | NoteT>(null);
  //#endregion

  //#region callbacks
  const { showBoundary } = useErrorBoundary();
  const load = useDebouncedCallback(async function getLibs() {
    try {
      if (!libs) {
        const { data } = await client.get(prefix);
        if (data.error) throw new Error(data.message);

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

        if (getRouter().getCurrentLocation().url.startsWith("note")) {
          const noteId = url.substring(5, url.length);
          setNote(data.notes.find(({ id }) => id === noteId));
        }
      }
      setIsLoading(false);
    } catch (error: any) {
      console.log("🚀 ~ load ~ error:", error);
      if (
        error.code === "ENOTFOUND" ||
        error.message.includes("ENOTFOUND") ||
        error.message.includes("Network")
      ) {
        showToast("Vous êtes hors-ligne");
        const seeds = seed.map(({ books, ...fields }) => ({
          ...fields,
          books: books?.map(({ src, ...bookFields }) => bookFields),
        }));
        console.log("🚀 ~ load ~ seeds:", seeds);
        setLibs(seeds as Lib[]);
        _setLib(seeds[0] as Lib);
      } else {
        showToast(error.message, true);
        setLibs(seed as Lib[]);
        _setLib(seed[0] as Lib);
      }
      setIsLoading(false);
    }
  }, 0);
  //#endregion

  //#region effects
  window.onerror = (event, source, lineno, colno, error) => {
    showBoundary(error);
  };
  window.onload = () => {
    load();
  };
  useEffect(() => {
    if (note) getRouter().navigateByName("note", { id: note.id });
  }, [note]);
  //#endregion

  //#region components
  const Back = ({ onClick }) => (
    <button css={toCss({ margin: "12px" })} onClick={onClick}>
      {"<"} Retour
    </button>
  );

  const AddNoteButton = () => {
    return (
      <div>
        <button
          css={toCss({ margin: "12px 12px 12px 12px" })}
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
    );
  };
  //#endregion

  return (
    <>
      <ToastsContainer toasts={toasts} onToastFinished={onToastFinished} />

      <Switch>
        <Route path="/">
          <div
            className="Resizer"
            css={toCss({ visibility: isLoading ? "hidden" : "visible" })}
          >
            <header>
              <Header
                lib={lib}
                setLib={setLib}
                libs={libs}
                book={book}
                setBook={setBook}
                user={user}
                setUser={setUser}
                setAccessToken={setAccessToken}
                setRefreshToken={setRefreshToken}
                showToast={showToast}
              />
            </header>

            <main>
              {/* libs */}
              {!book && (
                <>
                  <ul>
                    <li>
                      Auteur :{" "}
                      <a href={lib?.author_url || "#"} target="_blank">
                        {lib?.author || "Anonyme"}
                      </a>
                    </li>
                  </ul>
                </>
              )}

              {/* book */}
              {book && (
                <>
                  <div css={toCss({})}>
                    <div css={toCss({ display: "flex", alignItems: "center" })}>
                      <Back
                        onClick={() => {
                          setBook(null);
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
                    {/* <h1>
                      Notes de la bibliothèque <i>{lib.name}</i>
                    </h1> */}
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
                    <AddNoteButton />
                    {/* editable notes */}
                    {notes.map((row, index) => {
                      return (
                        <div key={"row-" + index}>
                          {row
                            .filter((note) => note.isEditing)
                            .map((note) => {
                              return (
                                <div key={"note-" + index}>
                                  <Note note={note} user={user} isEditing />

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
                                            throw data.error;
                                          }

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
                                        } catch (error) {
                                          showToast(error.message, true);
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
                                  user={user}
                                  showToast={showToast}
                                  onOpenClick={() => {
                                    setNote(note);
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
                                        ...comment,
                                        note_id: note.id,
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
                                            comments: n.comments.concat([data]),
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
                    {Array.isArray(book.notes) && book.notes.length > 0 && (
                      <AddNoteButton />
                    )}
                  </div>
                </>
              )}
            </main>
          </div>
        </Route>

        <Route path="/note/:id" name="note">
          {note !== null && (
            <div className="Resizer ">
              {/* <SplitPane
                split="horizontal"
                defaultSize={window.innerHeight / 2}
                paneStyle={{ overflowY: "scroll", padding: "12px" }}
              > */}
              {/* note */}
              <div>
                <div css={toCss({ display: "flex", alignItems: "center" })}>
                  <Back
                    onClick={() => {
                      setNote(null);
                      getRouter().navigate("/");
                    }}
                  />
                  <div>
                    Citation du livre{" "}
                    <i>
                      {book?.title
                        ? ": " + book.title
                        : "" + book?.id + " de la bibliothèque " + lib?.name}
                    </i>
                  </div>
                </div>

                <div
                  css={toCss({ padding: "12px" })}
                  dangerouslySetInnerHTML={{ __html: note.desc }}
                />
              </div>

              {/* ? */}
              <div></div>
              {/* </SplitPane> */}
            </div>
          )}
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
