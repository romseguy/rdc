import { css } from "@emotion/react";
import { Box, Button, Select, Separator } from "@radix-ui/themes";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import {
  deleteComment,
  deleteNote,
  editNote,
  postComments,
  postNotes,
} from "~/api";
import {
  AddNoteButton,
  BackButton,
  BookTitle,
  Flex,
  Note,
  useToast,
} from "~/components";
import { getState, setState } from "~/store";
import { ENoteOrder, localize, toCss, type BookT, type NoteT } from "~/utils";

export const Livre = (props) => {
  const { loaderData } = props;
  const {
    auth,
    isMobile,
    lib = loaderData.lib,
    locale,
  } = useSelector(getState);
  const defaultLocale = import.meta.env.VITE_PUBLIC_LOCALE;
  const user = auth?.user;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const showToast = useToast();

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
        els[c]?.push(n);
      }
      ++i;
    }
    return els;
  }, [book, order, locale]);

  //#region effects
  async function onEditSubmit(note) {
    try {
      let id;
      setIsNoteLoading({
        ...isNoteLoading,
        [note.id]: true,
      });

      if (!note.id) {
        const { data, error } = await dispatch(
          //@ts-expect-error
          postNotes.initiate({
            note: {
              book_id: book.id,
              [`desc${locale === "en" ? "_en" : ""}`]:
                note[locale === "en" ? "desc_en" : "desc"],
            },
          }),
        );
        //@ts-expect-error
        if (data.error || error)
          //@ts-expect-error
          data.error || error;
        //@ts-expect-error
        id = data.id;
      } else {
        const { data, error } = await dispatch(
          //@ts-expect-error
          editNote.initiate({
            note: {
              id: note.id,
              book_id: book.id,
              [`desc${locale === "en" ? "_en" : ""}`]:
                note[locale === "en" ? "desc_en" : "desc"],
            },
          }),
        );
        //@ts-expect-error
        if (data.error || error)
          //@ts-expect-error
          throw data.error || error;
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
    } catch (error) {
      showToast(error, true);
      setIsNoteLoading({
        ...isNoteLoading,
        [note.id]: false,
      });
    }
  }
  async function onDeleteClick(note) {
    try {
      const ok = confirm("Êtes-vous sûr de vouloir supprimer cette citation ?");
      if (ok) {
        setIsNoteLoading({
          ...isNoteLoading,
          [note.id]: true,
        });
        const { data, error } = await dispatch(
          //@ts-expect-error
          deleteNote.initiate({
            url: "/note?id=" + note.id,
          }),
        );

        //@ts-expect-error
        if (data.error || error)
          //@ts-expect-error
          throw data.error || error;

        setBook({
          ...book,
          notes: book.notes?.filter((n) => n.id !== note.id),
        });
        setIsNoteLoading({
          ...isNoteLoading,
          [note.id]: false,
        });
      }
    } catch (error) {
      showToast(error, true);
      setIsNoteLoading({
        ...isNoteLoading,
        [note.id]: false,
      });
    }
  }
  async function onEditPageClick(note: NoteT) {
    try {
      const { data, error } = await dispatch(
        //@ts-expect-error
        editNote.initiate({
          note,
        }),
      );
      //@ts-expect-error
      if (data.error || error)
        //@ts-expect-error
        data.error || error;

      setBook({
        ...book,
        notes: book.notes?.map((n) => {
          if (n.id === note.id) return note;
          return n;
        }),
      });
    } catch (error) {
      showToast(error, true);
    }
  }
  async function onSubmitCommentClick(note, comment) {
    try {
      const { data, error } = await dispatch(
        //@ts-expect-error
        postComments.initiate({
          comment: {
            ...comment,
            note_id: note.id,
          },
        }),
      );

      //@ts-expect-error
      if (data.error || error)
        //@ts-expect-error
        throw data.error || error;

      // if (data.error) {
      //   if (process.env.NODE_ENV === "development") {
      //     let r = rand();
      //     while (
      //       !!note.comments?.find(
      //         ({ id }) => id === r.toString(),
      //       )
      //     ) {
      //       r = rand();
      //     }
      //     data = {
      //       ...comment,
      //       id: r.toString(),
      //       comment_email: user.email,
      //       created_at: new Date().toISOString(),
      //     };
      //   } else {
      //     showToast(data.message);
      //     return;
      //   }
      // }

      setBook({
        ...book,
        notes: book.notes?.map((n) => {
          if (n.id === note.id) {
            return {
              ...n,
              //@ts-expect-error
              comments: (n.comments || []).concat([data]),
            };
          }
          return n;
        }),
      });
    } catch (error) {
      showToast(error, true);
      setIsNoteLoading({
        ...isNoteLoading,
        [note.id]: false,
      });
    }
  }
  async function onDeleteCommentClick(note, comment) {
    try {
      const ok = confirm("Êtes-vous sûr de vouloir supprimer ce commentaire ?");

      if (ok) {
        setIsCommentLoading({
          ...isCommentLoading,
          [comment.id]: true,
        });
        const { data, error } = await dispatch(
          //@ts-expect-error
          deleteComment.initiate({
            url: "/comment?id=" + comment.id,
          }),
        );

        //@ts-expect-error
        if (data.error || error)
          //@ts-expect-error
          throw data.error || error;

        // if (data.error) {
        //   setIsCommentLoading({
        //     ...isCommentLoading,
        //     [comment.id]: false,
        //   });

        //   if (process.env.NODE_ENV === "development") {
        //   } else {
        //     showToast(data.message);
        //     return;
        //   }
        // }

        setBook({
          ...book,
          notes: (book.notes || []).map((n) => {
            if (n.id === note.id) {
              return {
                ...n,
                comments: (n.comments || []).filter((c) => c.id !== comment.id),
              };
            }
            return n;
          }),
        });
      }
    } catch (error) {
      showToast(error, true);
      setIsCommentLoading({
        ...isCommentLoading,
        [comment.id]: false,
      });
    }
  }
  //#endregion

  const SelectOrder =
    book.notes && book.notes.length > 0 ? (
      <Select.Root
        defaultValue={ENoteOrder.ID}
        onValueChange={(value) => setOrder(value as unknown as ENoteOrder)}
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
    ) : null;

  return (
    <div id="book-page">
      {/* book header */}
      {!hasEditing && (
        <div id="book-header">
          <Flex justify="center" pl={isMobile ? "0" : "4"}>
            <h1>
              <BookTitle lib={lib} book={book} />
            </h1>
          </Flex>
        </div>
      )}

      <div
        css={css`
          ${isMobile ? "margin: 0 12px;" : ""}
        `}
      >
        <main>
          {/* order & add note button */}
          {!hasEditing && (
            <>
              {isMobile && (
                <Flex
                  direction="column"
                  css={css`
                    button {
                      margin: 12px 0;
                    }
                    button:last-of-type {
                      margin-top: 0;
                    }
                  `}
                >
                  <AddNoteButton book={book} setBook={setBook} />
                  {SelectOrder}
                </Flex>
              )}

              {!isMobile && (
                <Flex direction="column">
                  <AddNoteButton book={book} setBook={setBook} my="3" />
                  {SelectOrder}
                </Flex>
              )}
            </>
          )}

          {/* editable notes */}
          {notesGrid.map((row, index) => {
            return (
              <div key={"row-" + index}>
                {row
                  .filter((note) => note.isEditing)
                  .map((note) => {
                    return (
                      <div key={"note-" + note.id}>
                        <Note notes={book.notes || []} note={note} isEditing />

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

                          <Button onClick={() => onEditSubmit(note)}>
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
                          isLoading={isNoteLoading[note.id]}
                          onOpenClick={() => {
                            navigate(
                              `/${locale === "en" ? "q" : "c"}/${note.id}`,
                            );
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
                          onShareClick={() => {
                            dispatch(
                              setState({
                                modal: {
                                  id: "share-modal",
                                  isOpen: true,
                                  book,
                                  note,
                                },
                              }),
                            );
                          }}
                          onEditPageClick={(page) =>
                            onEditPageClick({ ...note, page })
                          }
                          onDeleteClick={() => onDeleteClick(note)}
                          onSubmitCommentClick={(comment) =>
                            onSubmitCommentClick(note, comment)
                          }
                          onDeleteCommentClick={(comment) =>
                            onDeleteCommentClick(note, comment)
                          }
                        />
                      );
                    })}
                </div>
              );
            })}

          {/* add note button */}
          {!hasEditing &&
            Array.isArray(book.notes) &&
            book.notes.length > 1 && (
              <div style={{ textAlign: "center" }}>
                <AddNoteButton book={book} setBook={setBook} />
              </div>
            )}
        </main>
      </div>
    </div>
  );
};
