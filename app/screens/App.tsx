import "~/screens/App.scss";
import { useDebouncedCallback } from "@charlietango/hooks/use-debounced-callback";
import { useStorage } from "@charlietango/hooks/use-storage";
import { MailTo, MailToBody, MailToTrigger } from "@slalombuild/react-mailto";
import { useEffect, useMemo, useState } from "react";
import {
  client,
  prefix,
  toCss,
  ToastsContainer,
  AddNoteButton,
  BackButton,
  type Lib,
  type User,
  type Book,
  type Note as NoteT,
  type Seed,
  ENoteOrder,
} from "~/utils";
import { css } from "@emotion/react";
import { Note } from "~/screens/Note";
import { Header } from "~/screens/Header";

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

const getRouter = () => ({
  getCurrentLocation: () => ({ url: "/" }),
  navigate: () => {},
  navigateByName: () => {},
});

export function App() {
  //#region modal
  const [modalState, setModalState] = useState<{
    note?: NoteT;
    isOpen: boolean;
  }>({ isOpen: false });
  const toggleModal = (note) => {
    setModalState({ note, isOpen: !modalState.isOpen });
  };
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
  const url = getRouter().getCurrentLocation().url;
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
  const hasEditing = useMemo(() => {
    if (!book || !book.notes) return false;
    return book?.notes?.filter((n) => n.isEditing).length > 0;
  }, [book]);
  const [order, setOrder] = useState<ENoteOrder>();
  const notesGrid = useMemo(() => {
    if (!book || !book.notes) return [[]];
    const rows: NoteT[] = [...book.notes].sort((a, b) => {
      if (order === ENoteOrder.ID) return a.id < b.id ? -1 : 1;
      if (order === ENoteOrder.PAGE && a.page && b.page) {
        return a.page < b.page ? -1 : 1;
      }
      return a.id < b.id ? -1 : 1;
    });
    let c = -1;
    let i = 0;
    let els: NoteT[][] = [];
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
  }, [book, order]);
  const [note, setNote] = useState<null | NoteT>(null);
  //#endregion

  //#region callbacks
  //const { showBoundary } = useErrorBoundary();
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
          const noteId = url.substring(5, url.length);
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
  const onEditPageClick = async (n: NoteT) => {
    const { data } = await client.put(prefix + "/note", {
      note: n,
    });
    if (data.error) {
      showToast(data.message, true);
      return;
    }

    setBook({
      ...book,
      notes: book?.notes?.map((note) => {
        if (note.id === n.id) return n;
        return note;
      }),
    });
  };
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
  useEffect(() => {
    if (note) getRouter().navigateByName("note", { id: note.id });
  }, [note]);
  //#endregion

  return (
    <>
      <ToastsContainer toasts={toasts} onToastFinished={onToastFinished} />

      {modalState.isOpen && modalState.note && (
        <div
          css={css`
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            width: 100%;
          `}
        >
          <div
            css={css`
              display: flex;
              flex-direction: column;
              gap: 12px;
              background: rgba(255, 255, 255, 0.2);
              padding: 12px;
              a,
              button {
                color: black;
                background: #9ae6b4;
                font-weight: bold;
                &:hover {
                  background: #68d391;
                }
              }
              a {
                padding: 12px;
                text-decoration: none;
              }
              button {
                border: 0;
              }
              button[type^="button"] {
                background: #feb2b2;
                &:hover {
                  background: #fc8181;
                }
              }
            `}
          >
            <MailTo
              subject={"Citation du livre : " + "" + ""}
              //cc={["cc1@example.com", "cc2@example.com"]}
              //bcc={["bcc@example.com"]}
              //obfuscate
            >
              <MailToTrigger>Envoyer un mail</MailToTrigger>
              <MailToBody>
                - Citation du livre {""} :
                <br />
                <br />
                {modalState.note.desc
                  .replace(/<\/?[^>]+(>|$)/g, "")
                  .replace(/&#(\d+);/g, function (match, dec) {
                    return String.fromCharCode(dec);
                  })}
              </MailToBody>
            </MailTo>

            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  import.meta.env.VITE_PUBLIC_URL +
                    "/note/" +
                    modalState.note!.id,
                );
                showToast("Le lien a été copié dans votre presse-papiers");
              }}
            >
              Copier le lien
            </button>

            <button type="button" onClick={toggleModal}>
              {" "}
              Annuler
            </button>
          </div>
        </div>
      )}
      {!modalState.isOpen && (
        <div
          css={toCss({
            visibility: isLoading.global ? "hidden" : "visible",
          })}
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

          <main style={{ maxWidth: "50em", margin: "0 auto" }}>
            {/* libs */}
            {!book && (
              <>
                <h1>
                  Bibliothèque : <i>{lib?.name}</i>
                </h1>
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
                <header
                  style={{
                    display: "flex",
                    alignItems: "center",
                    //justifyContent: "center",
                  }}
                >
                  <BackButton
                    onClick={() => {
                      setBook(null);
                    }}
                  />

                  {book.title && (
                    <h1>
                      Livre : <i>{book.title}</i>
                    </h1>
                  )}

                  {!book.title && (
                    <h1>
                      Livre {book.id} de la bibliothèque : <i>{lib.name}</i>
                    </h1>
                  )}
                </header>

                <section>
                  {!hasEditing && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        textAlign: "center",
                        marginBottom: "12px",
                      }}
                    >
                      <AddNoteButton book={book} setBook={setBook} />

                      {/* order */}
                      {book.notes?.length > 0 && (
                        <select
                          onChange={(e) =>
                            setOrder(e.target.value as unknown as ENoteOrder)
                          }
                        >
                          <option value={ENoteOrder.ID}>Plus récent</option>
                          <option value={ENoteOrder.PAGE}>Page</option>
                        </select>
                      )}
                    </div>
                  )}

                  {!book.notes?.length && <>Aucune citations.</>}

                  {/* editable notes */}
                  {notesGrid.map((row, index) => {
                    return (
                      <div key={"row-" + index}>
                        {row
                          .filter((note) => note.isEditing)
                          .map((note) => {
                            return (
                              <div key={"note-" + note.id}>
                                <Note
                                  note={note}
                                  user={user}
                                  isEditing
                                  locale={locale}
                                  setLocale={setLocale}
                                />

                                <div
                                  css={toCss({
                                    display: "flex",
                                    justifyContent: "space-between",
                                    background: "rgba(255,255,255,0.1)",
                                    marginBottom: "12px",
                                    padding: "6px",
                                  })}
                                >
                                  {!isLoading[note.id] && (
                                    <button
                                      type="button"
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
                                  )}

                                  <button
                                    onClick={async function onEditSubmit() {
                                      let id;
                                      setIsLoading({
                                        ...isLoading,
                                        [note.id]: true,
                                      });

                                      let data;
                                      if (note.isNew) {
                                        let key = "desc";
                                        if (locale === "en") key += "_en";
                                        const res = await client.post(
                                          prefix + "/notes",
                                          {
                                            note: {
                                              ...note,
                                              [key]:
                                                note[
                                                  `desc${
                                                    locale === "en" ? "_en" : ""
                                                  }`
                                                ],
                                              book_id: book.id,
                                            },
                                          },
                                        );
                                        data = res.data;
                                        id = data.id;
                                      } else {
                                        const res = await client.put(
                                          prefix + "/note",
                                          {
                                            note: {
                                              ...note,
                                              [`desc${
                                                locale === "en" ? "_en" : ""
                                              }`]:
                                                note[
                                                  `desc${
                                                    locale === "en" ? "_en" : ""
                                                  }`
                                                ],
                                            },
                                          },
                                        );
                                        data = res.data;
                                      }

                                      if (data.error) {
                                        showToast(data.message, true);
                                        setIsLoading({
                                          ...isLoading,
                                          [note.id]: false,
                                        });
                                        return;
                                      }

                                      setBook({
                                        ...book,
                                        notes: book?.notes?.map((n) => {
                                          if (n.id === note.id)
                                            return {
                                              ...note,
                                              id: id || note.id,
                                              isNew: false,
                                              isEditing: false,
                                            };
                                          return n;
                                        }),
                                      });
                                      setIsLoading({
                                        ...isLoading,
                                        [note.id]: false,
                                      });
                                    }}
                                  >
                                    {isLoading[note.id]
                                      ? "Veuillez patienter..."
                                      : "Valider"}
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    );
                  })}

                  {/* readonly notes */}
                  {notesGrid.map((row, index) => {
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
                          .map((note) => {
                            return (
                              <Note
                                key={"note-" + note.id}
                                note={note}
                                user={user}
                                isLoading={isLoading[note.id]}
                                toggleModal={toggleModal}
                                showToast={showToast}
                                locale={locale}
                                setLocale={setLocale}
                                onOpenClick={() => {
                                  setNote(note);
                                }}
                                onEditClick={() => {
                                  setIsLoading({
                                    ...isLoading,
                                    [note.id]: true,
                                  });
                                  setBook({
                                    ...book,
                                    notes: book?.notes?.map((n) => {
                                      if (n.id === note.id)
                                        return { ...n, isEditing: true };
                                      return n;
                                    }),
                                  });
                                  setIsLoading({
                                    ...isLoading,
                                    [note.id]: false,
                                  });
                                }}
                                onEditPageClick={(page) =>
                                  onEditPageClick({ ...note, page })
                                }
                                onDeleteClick={async () => {
                                  const ok = confirm(
                                    "Êtes-vous sûr de vouloir supprimer cette citation ?",
                                  );
                                  if (ok) {
                                    setIsLoading({
                                      ...isLoading,
                                      [note.id]: true,
                                    });
                                    const { data } = await client.delete(
                                      prefix + "/note?id=" + note.id,
                                    );
                                    if (data.error) {
                                      setIsLoading({
                                        ...isLoading,
                                        [note.id]: false,
                                      });
                                      showToast(data.message, true);
                                      return;
                                    }
                                    setBook({
                                      ...book,
                                      notes: book?.notes?.filter(
                                        (n) => n.id !== note.id,
                                      ),
                                    });
                                    setIsLoading({
                                      ...isLoading,
                                      [note.id]: false,
                                    });
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

                  {!hasEditing &&
                    Array.isArray(book.notes) &&
                    book.notes.length > 0 && (
                      <div style={{ textAlign: "center", marginTop: "12px" }}>
                        <AddNoteButton book={book} setBook={setBook} />
                      </div>
                    )}
                </section>
              </>
            )}
          </main>
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
                setNote(null);
                getRouter().navigate("/");
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
