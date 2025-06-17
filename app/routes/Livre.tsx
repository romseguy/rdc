import { decode } from "html-entities";
import locale from "date-fns/locale/af";
import { useEffect, useMemo, useState } from "react";
import { MailTo, MailToBody, MailToTrigger } from "@slalombuild/react-mailto";
import {
  client,
  toCss,
  type Lib,
  type BookT,
  type NoteT,
  ENoteOrder,
} from "~/utils";
import { css } from "@emotion/react";
import { AddNoteButton, BackButton, Note, Header } from "~/components";
import { useNavigate } from "react-router";

export const Livre = ({ ...props }) => {
  // console.log("🚀 ~ Livre ~ props:", props);

  const { user, showToast, appearance } = props;

  const navigate = useNavigate();

  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  const [locale, setLocale] = useState("fr");
  const [book, setBook] = useState<BookT>(props.loaderData.book);
  useEffect(() => {
    if (props.loaderData.book) {
      if (book) setBook(props.loaderData.book);
      else showToast("Le livre n'a pas été trouvé.");
    }
  }, [props.loaderData]);
  const hasEditing = useMemo(() => {
    if (!book || !book.notes) return false;
    return book.notes?.filter((n) => n.isEditing).length > 0;
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
      notes: book.notes?.map((note) => {
        if (note.id === n.id) return n;
        return note;
      }),
    });
  };
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
      {book === undefined && <>Le livre n'a pas été trouvé.</>}
      {book && (
        <>
          {!modalState.isOpen && (
            <>
              {!hasEditing && (
                <header
                  style={{
                    display: "flex",
                    alignItems: "center",
                    //justifyContent: "center",
                  }}
                >
                  {/* <BackButton
                    onClick={() => {
                      navigate("/");
                      //setBook(null);
                    }}
                  /> */}

                  {book.title && (
                    <h1>
                      {book.is_conf ? "Conférence" : "Livre"} :{" "}
                      <i>{book.title}</i>
                    </h1>
                  )}

                  {!book.title && (
                    <h1>
                      Livre {book.id} de la bibliothèque :{" "}
                      <i>{props.loaderData.lib.name}</i>
                    </h1>
                  )}
                </header>
              )}

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
                    {/* order */}
                    {book.notes && book.notes.length > 0 && (
                      <select
                        onChange={(e) =>
                          setOrder(e.target.value as unknown as ENoteOrder)
                        }
                      >
                        <option value={ENoteOrder.ID}>Plus récent</option>
                        <option value={ENoteOrder.PAGE}>Page</option>
                      </select>
                    )}

                    <AddNoteButton book={book} setBook={setBook} />
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
                                  <Button
                                    className="cancel-btn"
                                    onClick={() => {
                                      setBook({
                                        ...book,
                                        notes: book.notes
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
                                  </Button>
                                )}

                                <Button
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
                                      const res = await client.post("/notes", {
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
                                      });
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
                                      notes: book.notes?.map((n) => {
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
                                </Button>
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
                        .map((note, index) => {
                          return (
                            <Note
                              key={"note-" + note.id}
                              note={{ ...note, index }}
                              user={user}
                              isLoading={isLoading[note.id]}
                              toggleModal={toggleModal}
                              locale={locale}
                              setLocale={setLocale}
                              appearance={appearance}
                              onOpenClick={() => {
                                navigate("/note/" + note.id);
                                //setNote(note);
                              }}
                              onEditClick={() => {
                                setIsLoading({
                                  ...isLoading,
                                  [note.id]: true,
                                });
                                setBook({
                                  ...book,
                                  notes: book.notes?.map((n) => {
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
                                    notes: book.notes?.filter(
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
                                  notes: book.notes?.map((n) => {
                                    if (n.id === note.id) {
                                      return {
                                        ...n,
                                        comments: (n.comments || []).concat([
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
                                    "/comment?id=" + comment.id,
                                  );
                                  if (data.error) {
                                    showToast(data.message);
                                    return;
                                  }

                                  setBook({
                                    ...book,
                                    notes: book.notes?.map((n) => {
                                      if (n.id === note.id) {
                                        return {
                                          ...n,
                                          comments: (n.comments || []).filter(
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
                  book.notes.length > 1 && (
                    <div style={{ textAlign: "center", marginTop: "12px" }}>
                      <AddNoteButton book={book} setBook={setBook} />
                    </div>
                  )}
              </section>
            </>
          )}

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
                    border-radius: 4px;
                    padding: 12px;
                    text-decoration: none;
                    text-align: center;
                  }
                  button {
                    justify-content: center;
                    border: 0;
                  }
                `}
              >
                <h1>
                  Partager la citation{" "}
                  {modalState.note.page ? "p." + modalState.note.page : ""}
                </h1>

                <MailTo
                  to=""
                  subject={`Citation ${
                    modalState.note.page ? "p." + modalState.note.page : ""
                  } du ${
                    book.title
                      ? ""
                      : modalState.note.index === 0
                      ? "premier"
                      : typeof modalState.note.index === "number"
                      ? Number(modalState.note.index + 1) + "ème"
                      : ""
                  }${
                    book.title
                      ? " livre : " + book.title
                      : " livre de la bibliothèque : " +
                        props.loaderData.lib.name
                  } `}
                  //cc={["cc1@example.com", "cc2@example.com"]}
                  //bcc={["bcc@example.com"]}
                  //obfuscate
                >
                  <MailToTrigger>Envoyer un mail</MailToTrigger>
                  <MailToBody>
                    - Citation du livre {""} :
                    <br />
                    <br />
                    {decode(modalState.note.desc.replace(/(<([^>]+)>)/gi, ""))}
                  </MailToBody>
                </MailTo>

                <Button
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
                </Button>

                <Button className="cancel-btn" onClick={toggleModal}>
                  Annuler
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};
