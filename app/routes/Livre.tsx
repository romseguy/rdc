import { ChatBubbleIcon } from "@radix-ui/react-icons";
import { Box, Button, Select } from "@radix-ui/themes";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { AddNoteButton, BackButton, BookIcon, Flex, Note } from "~/components";
import {
  client,
  toCss,
  type BookT,
  type NoteT,
  ENoteOrder,
  localize,
  rand,
} from "~/utils";

export const Livre = (props) => {
  const {
    loaderData: { lib },
    user,
    showToast,
    locale,
    setLocale,
    isMobile,
    modalState,
    setModalState,
  } = props;
  const navigate = useNavigate();
  const [isCommentLoading, setIsCommentLoading] = useState<
    Record<string, boolean>
  >({});
  const [isNoteLoading, setIsNoteLoading] = useState<Record<string, boolean>>(
    {},
  );
  const [book, setBook] = useState<BookT>(props.loaderData.book);
  useEffect(() => {
    if (props.loaderData.book) {
      if (book.id !== props.loaderData.book.id) setBook(props.loaderData.book);
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
  }, [book, order, locale]);

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

  return (
    <div id="book-page">
      {/* book header */}
      {!hasEditing && (
        <header>
          <Flex justify="center" pl="4">
            <h1>
              <Flex>
                {book.title && (
                  <>
                    {book.is_conf ? (
                      <>
                        <ChatBubbleIcon />
                        {localize("Conférence", "Talk show")}
                      </>
                    ) : (
                      <>
                        <BookIcon />
                        {localize("Livre", "Book")}
                      </>
                    )}
                    <span> : </span>
                    {book.title && (
                      <i>{book[localize("title")] || book.title}</i>
                    )}
                  </>
                )}

                {!book.title && (
                  <>
                    {book.is_conf ? <ChatBubbleIcon /> : <BookIcon />}
                    {book.index === 0
                      ? localize("Premier", "First")
                      : book.index === 1
                      ? `${book.index + 1}${localize("ème", "nd")}`
                      : book.index === 2
                      ? book.index + localize("ème", "rd")
                      : book.index + localize("ème", "th")}
                    <span> </span>
                    {book.is_conf
                      ? localize("conférence", "talk show")
                      : localize("livre", "book")}
                    <span> </span>
                    {localize("de la bibliothèque", "from the library")} :
                    <span> </span>
                    <i>{lib[localize("name")] || lib.name}</i>
                  </>
                )}
              </Flex>
            </h1>
          </Flex>
        </header>
      )}

      <main>
        {/* order & add note button */}
        {!hasEditing && (
          <Flex justify="between" p="3">
            {book.notes && book.notes.length > 0 && (
              <Select.Root
                defaultValue={ENoteOrder.ID}
                onValueChange={(value) =>
                  setOrder(value as unknown as ENoteOrder)
                }
              >
                <Select.Trigger variant="classic" />
                <Select.Content>
                  <Select.Item value={ENoteOrder.ID}>
                    {localize(
                      "Citations plus récentes en premier",
                      "Most recent quotes first",
                    )}
                  </Select.Item>
                  <Select.Item value={ENoteOrder.PAGE}>
                    {localize("Dans l'ordre des pages", "By page order")}
                  </Select.Item>
                </Select.Content>
              </Select.Root>
            )}

            <AddNoteButton book={book} setBook={setBook} />
          </Flex>
        )}

        {!book.notes?.length && <Box pl="3">Aucune citations.</Box>}

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
                        notes={book.notes || []}
                        note={note}
                        user={user}
                        isEditing
                        locale={locale}
                        setLocale={setLocale}
                        localize={localize}
                        isMobile={isMobile}
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
                        {!isNoteLoading[note.id] && (
                          <BackButton
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
                          </BackButton>
                        )}

                        <Button
                          onClick={async function onEditSubmit() {
                            let id;
                            setIsNoteLoading({
                              ...isNoteLoading,
                              [note.id]: true,
                            });

                            let data;
                            if (note.isNew) {
                              const res = await client.post("/notes", {
                                note: {
                                  book_id: book.id,
                                  [`desc${locale === "en" ? "_en" : ""}`]:
                                    note[locale === "en" ? "desc_en" : "desc"],
                                },
                              });
                              data = res.data;
                              id = data.id;
                            } else {
                              const res = await client.put("/note", {
                                note: {
                                  id: note.id,
                                  book_id: book.id,
                                  [`desc${locale === "en" ? "_en" : ""}`]:
                                    note[locale === "en" ? "desc_en" : "desc"],
                                },
                              });
                              data = res.data;
                            }

                            if (data.error) {
                              showToast(data.message, true);
                              setIsNoteLoading({
                                ...isNoteLoading,
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
                                    note_email: user.email,
                                  };
                                return n;
                              }),
                            });
                            setIsNoteLoading({
                              ...isNoteLoading,
                              [note.id]: false,
                            });
                          }}
                        >
                          {isNoteLoading[note.id]
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
        {!hasEditing &&
          notesGrid.map((row, index) => {
            return (
              <div key={"note-" + index}>
                {row
                  .filter((note) => !note.isEditing)
                  .map((note, index) => {
                    return (
                      <Note
                        key={"note-" + index + note.id}
                        notes={book.notes || []}
                        note={{ ...note, index }}
                        user={user}
                        isLoading={isNoteLoading[note.id]}
                        locale={locale}
                        setLocale={setLocale}
                        localize={localize}
                        isMobile={isMobile}
                        onOpenClick={() => {
                          navigate("/q/" + note.id);
                          //setNote(note);
                        }}
                        onEditClick={() => {
                          setIsNoteLoading({
                            ...isNoteLoading,
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
                          setIsNoteLoading({
                            ...isNoteLoading,
                            [note.id]: false,
                          });
                        }}
                        onEditPageClick={(page) =>
                          onEditPageClick({ ...note, page })
                        }
                        onShareClick={() => {
                          setModalState({
                            id: "share-modal",
                            isOpen: true,
                            book,
                            note,
                          });
                        }}
                        onDeleteClick={async () => {
                          const ok = confirm(
                            "Êtes-vous sûr de vouloir supprimer cette citation ?",
                          );
                          if (ok) {
                            setIsNoteLoading({
                              ...isNoteLoading,
                              [note.id]: true,
                            });
                            const { data } = await client.delete(
                              "/note?id=" + note.id,
                            );
                            if (data.error) {
                              setIsNoteLoading({
                                ...isNoteLoading,
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
                            setIsNoteLoading({
                              ...isNoteLoading,
                              [note.id]: false,
                            });
                          }
                        }}
                        onSubmitCommentClick={async (comment) => {
                          let { data } = await client.post("/comments", {
                            comment: {
                              ...comment,
                              note_id: note.id,
                            },
                          });

                          if (data.error) {
                            if (process.env.NODE_ENV === "development") {
                              let r = rand();
                              while (
                                !!note.comments?.find(
                                  ({ id }) => id === r.toString(),
                                )
                              ) {
                                r = rand();
                              }
                              data = {
                                ...comment,
                                id: r.toString(),
                                comment_email: user.email,
                                created_at: new Date().toISOString(),
                              };
                            } else {
                              showToast(data.message);
                              return;
                            }
                          }

                          setBook({
                            ...book,
                            notes: book.notes?.map((n) => {
                              if (n.id === note.id) {
                                return {
                                  ...n,
                                  comments: (n.comments || []).concat([data]),
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
                            setIsCommentLoading({
                              ...isCommentLoading,
                              [comment.id]: true,
                            });
                            let { data } = await client.delete(
                              "/comment?id=" + comment.id,
                            );
                            if (data.error) {
                              setIsCommentLoading({
                                ...isCommentLoading,
                                [comment.id]: false,
                              });

                              if (process.env.NODE_ENV === "development") {
                              } else {
                                showToast(data.message);
                                return;
                              }
                            }

                            setBook({
                              ...book,
                              notes: (book.notes || []).map((n) => {
                                if (n.id === note.id) {
                                  return {
                                    ...n,
                                    comments: (n.comments || []).filter(
                                      (c) => c.id !== comment.id,
                                    ),
                                  };
                                }
                                return n;
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

        {/* add note button */}
        {!hasEditing && Array.isArray(book.notes) && book.notes.length > 1 && (
          <div style={{ textAlign: "center", marginTop: "12px" }}>
            <AddNoteButton book={book} setBook={setBook} />
          </div>
        )}
      </main>
    </div>
  );
};
