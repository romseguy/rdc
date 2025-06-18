import { css } from "@emotion/react";
import { Button } from "@radix-ui/themes";
import { useState } from "react";
import {
  RTEditor,
  EditIcon,
  ExternalIcon,
  ShareIcon,
  DeleteIcon,
  LocaleSwitch,
  PageSwitch,
  iconProps,
  Flex,
} from "~/components";
import {
  toUsername,
  fullDateString,
  toCss,
  useScroll,
  type NoteT,
  type User,
} from "~/utils";

interface NoteP {
  notes: NoteT[];
  note: NoteT;
  user?: User | null;
  isLoading?: boolean;
  isEditing?: boolean;
  locale: string;
  setLocale: (string) => void;
  isMobile: boolean;
  onOpenClick?: any;
  onEditClick?: any;
  onEditPageClick?: any;
  onDeleteClick?: any;
  onShareClick?: any;
  onSubmitCommentClick?: any;
  onDeleteCommentClick?: any;
}

export const Note = (props: NoteP) => {
  const {
    notes,
    note,
    user,
    isEditing = false,
    isLoading = false,
    locale,
    setLocale,
    isMobile,
    onOpenClick,
    onEditClick,
    onEditPageClick,
    onShareClick,
    onDeleteClick,
    onSubmitCommentClick,
    onDeleteCommentClick,
  } = props;
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
        isMobile={isMobile}
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
        <Flex gap="3">
          {!isMobile && (
            <Button
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
            </Button>
          )}

          {isMobile && (
            <ExternalIcon
              {...iconProps({
                title: "Ouvrir le lecteur",
                isMobile,
                onClick: onOpenClick,
              })}
            />
          )}
          <ShareIcon
            {...iconProps({
              title: "Partager la citation",
              isMobile,
              onClick: onShareClick,
            })}
          />
          <EditIcon
            onClick={() => onEditClick()}
            {...iconProps({
              title: "Modifier la citation",
              isMobile,
              onClick: onEditClick,
            })}
          />
          <DeleteIcon
            {...iconProps({
              title: "Supprimer la citation",
              isMobile,
              onClick: onDeleteClick,
            })}
          />
        </Flex>
      )}
    </div>
  );

  return (
    <section>
      {/* note header */}
      <header>
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
                <Flex justify="between">
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

                  <div>
                    {note.index !== 0 && "< Note précédente"}
                    {note.index !== notes.length - 1 && "Note suivante >"}
                  </div>

                  <NoteHeaderRight
                    css={toCss({
                      display: "flex",
                      gap: "12px",
                    })}
                  />
                </Flex>
              )}
            </>
          )}
        </div>
      </header>

      {/* note desc */}
      <main
        key={"note-" + note.id}
        css={css`
          max-height: 250px;
          line-height: 2;
          padding: ${isMobile ? "0px" : "6px"};
          ${isEditing ? "min-height: 250px;" : ""}
          ${!isEditing ? "overflow-y: scroll" : ""}
        `}
      >
        {isEditing && editor(locale)}
        {!isEditing && (
          <div
            dangerouslySetInnerHTML={{
              __html: desc,
            }}
          />
        )}
      </main>

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
                <Button
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
                </Button>
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
                <Button
                  className="cancel-btn"
                  onClick={() => {
                    setIsAddComment(false);
                  }}
                >
                  Annuler
                </Button>

                <Button
                  onClick={() => {
                    setIsAddComment(false);
                    setIsShowComments(true);
                    onSubmitCommentClick(comment);
                  }}
                >
                  Valider
                </Button>
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
    </section>
  );
};
