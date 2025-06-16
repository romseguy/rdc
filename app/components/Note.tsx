import { useState } from "react";
import { isMobile } from "react-device-detect";
import {
  RTEditor,
  EditIcon,
  ExternalIcon,
  ShareIcon,
  DeleteIcon,
  LocaleSwitch,
  PageSwitch,
  iconProps,
} from "~/components";
import {
  toUsername,
  fullDateString,
  toCss,
  useScroll,
  type NoteT,
  type User,
} from "~/utils";

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
  toggleModal,
  locale,
  setLocale,
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
  isEditing?: boolean;
  toggleModal?: (note: NoteT) => void;
  locale: string;
  setLocale: (string) => void;
}) => {
  const desc =
    locale === "en"
      ? note.desc_en
        ? note.desc_en
        : note.desc
        ? "<p>You can translate the text below :</p><p>&nbsp;</p>" + note.desc
        : "No english translation"
      : note.desc;

  const [isPageEdit, setIsPageEdit] = useState(false);
  const [page, setPage] = useState<number | undefined>(note.page);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [comment, setComment] = useState<{ html: string }>();
  const [isShowComments, setIsShowComments] = useState(false);
  const [executeScroll, elementToScrollRef] = useScroll<HTMLDivElement>();
  const [isAddComment, setIsAddComment] = useState(false);

  const editor = (locale: string) => {
    return (
      <RTEditor
        defaultValue={desc}
        onChange={({ html }) => {
          note[`desc${locale === "en" ? "_en" : ""}`] = html;
        }}
      />
    );
  };

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
          {!isMobile && (
            <button
              className="with-icon"
              style={{ padding: "3px 3px 3px 6px" }}
              onClick={onOpenClick}
            >
              Ouvrir le lecteur
              <ExternalIcon
                {...iconProps({
                  title: "Ouvrir le lecteur",
                })}
              />
            </button>
          )}

          {isMobile && (
            <ExternalIcon
              {...iconProps({
                title: "Ouvrir le lecteur",
                onClick: onOpenClick,
              })}
            />
          )}
          <ShareIcon
            {...iconProps({
              title: "Partager la citation",
              onClick: () => toggleModal && toggleModal(note),
            })}
          />
          <EditIcon
            onClick={() => onEditClick()}
            {...iconProps({
              title: "Modifier la citation",
              onClick: onEditClick,
            })}
          />
          <DeleteIcon
            {...iconProps({
              title: "Supprimer la citation",
              onClick: onDeleteClick,
            })}
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
            <LocaleSwitch locale={locale} setLocale={setLocale} />
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
                <PageSwitch
                  isPageEdit={isPageEdit}
                  setIsPageEdit={setIsPageEdit}
                  page={page}
                  setPage={setPage}
                  note={note}
                  onClick={onEditPageClick}
                />

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

                  <PageSwitch
                    isPageEdit={isPageEdit}
                    setIsPageEdit={setIsPageEdit}
                    page={page}
                    setPage={setPage}
                    note={note}
                    onClick={onEditPageClick}
                  />

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
          maxHeight: "250px",
          lineHeight: "2",
          //maxHeight: window.innerHeight - 250 + "px",
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
              __html: desc,
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
                  className="cancel-btn"
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
