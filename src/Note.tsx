import { fullDateString, toCss, useScroll } from "./utils";
import { useState } from "react";
import { toUsername } from "./utils";
import { RTEditor } from "./RTEditor";
import { Note as NoteT, User } from "./types";
import { isMobile } from "react-device-detect";
import {
  EditIcon,
  ExternalIcon,
  ShareIcon,
  DeleteIcon,
  LocaleSwitch,
} from "./Controls";

export const Note = ({
  note,
  user,
  onOpenClick,
  onEditClick,
  onEditPageClick,
  onDeleteClick,
  onSubmitCommentClick,
  onDeleteCommentClick,
  isEditing = false,
  isLoading = false,
  showToast,
  toggleModal,
}: {
  note: NoteT;
  user?: User | null;
  onOpenClick?: any;
  onEditClick?: any;
  onEditPageClick?: any;
  onDeleteClick?: any;
  onSubmitCommentClick?: any;
  onDeleteCommentClick?: any;
  isLoading?: boolean;
  isEditing: boolean;
  showToast: any;
}) => {
  const [isPageEdit, setIsPageEdit] = useState(false);
  const [page, setPage] = useState<number>(note.page);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [locale, setLocale] = useState("fr");
  const [comment, setComment] = useState();
  const [isShowComments, setIsShowComments] = useState(false);
  const [executeScroll, elementToScrollRef] = useScroll<HTMLDivElement>();
  const [isAddComment, setIsAddComment] = useState(false);

  const editor = (loc) => {
    //console.log(loc === "en" ? note.desc_en : note.desc);
    return (
      <RTEditor
        defaultValue={loc === "en" ? note.desc_en : note.desc}
        placeholder="Saisissez le texte de la citation"
        onChange={({ html }) => {
          if (loc === "en") note.desc_en = html;
          else note.desc = html;
        }}
      />
    );
  };

  const iconProps = (title: string, override?: Record<string, string>) => ({
    "aria-label": title,
    style: {
      cursor: "pointer",
      ...(isMobile
        ? {
            height: "1em",
            width: "1em",
            padding: "6px",
            border: "1px solid white",
          }
        : { height: "2em", width: "2em" }),
      ...override,
    },
  });

  const NoteHeaderRight = (props) => (
    <div {...props}>
      {isLoading && (
        <div className="spinner">
          <span>Chargement...</span>
        </div>
      )}
      {!isLoading && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <ExternalIcon
            onClick={() => onOpenClick()}
            {...iconProps("Ouvrir la citation")}
          />
          <ShareIcon
            onClick={() => {
              toggleModal(note);
            }}
            {...iconProps("Partager la citation")}
          />
          <EditIcon
            onClick={() => onEditClick()}
            {...iconProps("Modifier la citation")}
          />
          <DeleteIcon
            onClick={() => onDeleteClick()}
            {...iconProps("Supprimer la citation")}
          />
        </div>
      )}
    </div>
  );

  return (
    <div
      css={toCss({
        fontSize: "smaller",
        //paddingBottom: "12px",
        //display: "flex",
        //flexDirection: "column",
      })}
    >
      {/* note header */}
      <div
        css={toCss({
          padding: isMobile ? "0 0 6px 0" : "6px",
          background: "purple",
        })}
      >
        {isEditing && (
          <div
            css={toCss({
              display: "flex",
              alignItems: "center",
              gap: "6px",
            })}
          >
            {note.isNew ? "Nouvelle citation" : "Modifiez cette citation"}
            {!!setLocale && (
              <>
                <LocaleSwitch locale={locale} setLocale={setLocale} />
              </>
            )}
          </div>
        )}

        {!isEditing && (
          <>
            {/* note header */}
            {isMobile && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <LocaleSwitch locale={locale} setLocale={setLocale} />
                  <div>Cité par {toUsername(note.note_email)}</div>
                </div>

                <NoteHeaderRight />
              </div>
            )}

            {!isMobile && (
              <div
                css={toCss({
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                })}
              >
                <div
                  css={toCss({
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  })}
                >
                  <LocaleSwitch locale={locale} setLocale={setLocale} />
                  <div>
                    {!isPageEdit ? (
                      <button
                        className="with-icon"
                        onClick={() => setIsPageEdit(true)}
                      >
                        p.{note.page}
                        <EditIcon
                          {...iconProps("Modifier la page", {
                            height: "1em",
                            width: "1em",
                          })}
                        />
                      </button>
                    ) : (
                      <div
                        css={toCss({
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        })}
                      >
                        <input
                          type="number"
                          defaultValue={page}
                          onChange={(e) => {
                            const p = Number(e.target.value);
                            if (p < 10000) setPage(p);
                          }}
                        />
                        <button
                          onClick={() => {
                            setIsPageEdit(false);
                            onEditPageClick(page);
                          }}
                        >
                          ok
                        </button>
                      </div>
                    )}
                  </div>

                  <div>Cité par {toUsername(note.note_email)}</div>
                </div>

                <NoteHeaderRight
                  css={toCss({
                    display: "flex",
                    gap: "12px",
                  })}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* note desc */}
      <div
        key={"note-" + note.id}
        css={toCss({
          padding: isMobile ? "0px" : "6px",
          background: "rgba(255,255,255,0.1)",
          maxHeight: window.innerHeight - 250 + "px",
          //height: "100%",
          //height: "100px",
          overflowY: isEditing ? "hidden" : "scroll",
          //overflowX: "hidden",
          //width: "200px",
          //textOverflow: "ellipsis",
        })}
      >
        {isEditing && editor(locale)}
        {!isEditing && (
          <div
            dangerouslySetInnerHTML={{
              __html: locale === "en" ? note.desc_en : note.desc,
            }}
          />
        )}
      </div>

      {/* comments */}
      {!note.isNew && (
        <div
          css={toCss({
            background: "rgba(255, 255, 255, 0.1)",
            marginBottom: "12px",
          })}
        >
          {!note.isEditing && (
            <div
              css={toCss({
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "6px",
                background: "purple",
                cursor: "pointer",
              })}
              onClick={async () => {
                setIsShowComments(!isShowComments);
                if (!isShowComments) {
                  setTimeout(() => {
                    executeScroll();
                  }, 100);
                }
              }}
            >
              <div>
                {Array.isArray(note.comments) && note.comments.length > 0
                  ? `Lire les ${note.comments.length} commentaires ${
                      isShowComments ? "V" : ">"
                    }`
                  : "0 commentaires"}
              </div>

              <div>
                <button
                  css={toCss({})}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isAddComment) {
                      setIsAddComment(true);
                      setIsShowComments(false);
                      setTimeout(() => {
                        executeScroll();
                      }, 200);
                    }
                  }}
                >
                  Ajouter un commentaire
                </button>
              </div>
            </div>
          )}

          {isAddComment && (
            <div>
              <textarea
                autoFocus
                css={toCss({ width: "98%", height: "150px" })}
                placeholder="Écrivez ici votre commentaire"
                onChange={(e) => setComment({ html: e.target.value })}
              />
              <div
                css={toCss({
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                  padding: "6px",
                })}
              >
                <button
                  type="button"
                  onClick={() => {
                    setIsAddComment(false);
                  }}
                >
                  Annuler
                </button>

                <button
                  onClick={() => {
                    setIsAddComment(false);
                    setIsShowComments(true);
                    onSubmitCommentClick(comment);
                  }}
                >
                  Valider
                </button>
              </div>
            </div>
          )}

          {!note.isNew && isShowComments && (
            <div css={toCss({ background: "rgba(255, 255, 255, 0.2)" })}>
              {note.comments?.map((c) => {
                return (
                  <div
                    key={"comment-" + c.id}
                    css={toCss({
                      display: "flex",
                      justifyContent: "space-between",
                      borderBottom: "1px solid white",
                      padding: "12px",
                    })}
                  >
                    {/* comment */}
                    <div>
                      {toUsername(c.comment_email)} : {c.html}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "3px",
                        cursor: "pointer",
                      }}
                    >
                      {/* comment date */}
                      <div css={toCss({ whiteSpace: "nowrap" })}>
                        {fullDateString(c.created_at)}
                      </div>

                      {/* delete comment */}
                      {c.comment_email === user?.email && (
                        <DeleteIcon
                          onClick={() => {
                            onDeleteCommentClick(c);
                          }}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div ref={elementToScrollRef} />
        </div>
      )}
    </div>
  );
};
