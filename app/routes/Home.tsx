import { MailTo, MailToBody, MailToTrigger } from "@slalombuild/react-mailto";
import { useEffect, useMemo, useState } from "react";
import {
  client,
  toCss,
  type Lib,
  type Book,
  type Note as NoteT,
  ENoteOrder,
} from "~/utils";
import { css } from "@emotion/react";
import { AddNoteButton, BackButton, Note, Header } from "~/components";
import { useNavigate } from "react-router";

export function Home({ ...props }) {
  // console.log("🚀 ~ Home ~ props:", props);
  const {
    loaderData,
    accessToken,
    setAccessToken,
    refreshToken,
    setRefreshToken,
    showToast,
    user,
    setUser,
  } = props;
  const navigate = useNavigate();
  const getRouter = () => ({
    getCurrentLocation: () => ({ url: "/" }),
    navigate,
    navigateByName: () => {},
  });

  //#region state
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  const [locale, setLocale] = useState("fr");
  const [lib, _setLib] = useState<Lib>(loaderData.lib);
  const setLib = (libName: string) => {
    const l = loaderData.libs?.find((li) => li.name === libName);
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
  const [note, setNote] = useState<null | NoteT>(props.note);
  //#endregion

  //#region callbacks
  const onEditPageClick = async (n: NoteT) => {
    const { data } = await client.put("/note", {
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
  useEffect(() => {
    if (note) getRouter().navigate("/note/" + note.id);
  }, [note]);
  //#endregion

  //#region modal
  const [modalState, setModalState] = useState<{
    note?: NoteT;
    isOpen: boolean;
  }>({ isOpen: false });
  const toggleModal = (note) => {
    setModalState({ note, isOpen: !modalState.isOpen });
  };
  //#endregion

  return (
    <>
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
        <div>
          <header>
            <Header
              lib={lib}
              setLib={setLib}
              libs={loaderData.libs}
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
                                          "/notes",
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
                                        const res = await client.put("/note", {
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
                                        });
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
                                      "/note?id=" + note.id,
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
                                    "/comments",
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
                                      "/comment?id=" + comment.id,
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
    </>
  );
}
