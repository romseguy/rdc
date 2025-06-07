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
    login();
    client.defaults.headers.common["at"] = accessToken;
    client.defaults.headers.common["rt"] = refreshToken;
  }, [accessToken]);
  const [refreshToken, setRefreshToken] = useStorage("refreshToken", {
    type: "local",
  });
  const [user, setUser] = useState<null | User>();
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

  //#region state
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
  const url = getRouter().getCurrentLocation().url;
  const [currentNote, setCurrentNote] = useState<null | NoteT>(
    url.startsWith("note") ? url.substring(5, url.length) : null,
  );
  //#endregion

  //#region callbacks
  const getLibsOnce = useDebouncedCallback(async function getLibs() {
    try {
      if (!libs) {
        const { data, error } = await client.get(prefix);
        if (data.error) throw data.error;
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
      if (error.code === "ENOTFOUND" || error.message.includes("Network")) {
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
    if (currentNote === null) {
      getRouter().navigate("/");
      return;
    }

    if (!getRouter().getCurrentLocation().url.startsWith("/note")) {
      getRouter().navigateByName("note", { id: currentNote.id });
    }

    if (lib) {
      getNote(currentNote.id);
    }
  }, [currentNote, lib]);
  //#endregion

  //if (isLoading) return "Chargement...";
  // if (!libs) throw new Error("Aucune bibliothèques");
  // if (!lib) throw new Error("Aucune bibliothèque sélectionnée");

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
                                  onOpenClick={() => {
                                    setCurrentNote(note);
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
                    {Array.isArray(notes) && notes.length > 0 && (
                      <AddNoteButton />
                    )}
                  </div>
                </>
              )}
            </main>
          </div>
        </Route>

        <Route path="/note/:id" name="note">
          {currentNote !== null && (
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
                      setCurrentNote(null);
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
                  dangerouslySetInnerHTML={{ __html: currentNote.desc }}
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

{
  /*
            <SplitPane
              css={toCss({ position: "unset !important" })}
              split="horizontal"
              defaultSize={book ? 20 : 230 + 32 + 12 + 12}
              maxSize={
                book
                  ? window.innerHeight - 30
                  : window.innerHeight - (230 + 32 + 12 + 12)
              }
              primary="first"
              pane1Style={{
                //height: "unset",
                // display: "flex",
                // alignItems: "center",
                // whiteSpace: "nowrap",
                overflowX: "scroll",
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
  */
}

{
  /*
                  <SplitPane
                    css={toCss({ position: "relative" })}
                    split="horizontal"
                    defaultSize={window.innerHeight - 110}
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
    */
}
