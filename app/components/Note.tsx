import { css } from "@emotion/react";
import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Share1Icon,
  ThickArrowUpIcon,
} from "@radix-ui/react-icons";
import { Badge, Box, Button, ChevronDownIcon } from "@radix-ui/themes";
import { useState } from "react";
import {
  RTEditor,
  EditIcon,
  ExternalIcon,
  DeleteIcon,
  LocaleSwitch,
  PageSwitch,
  iconProps,
  Flex,
  BackButton,
  UserIcon,
} from "~/components";
import {
  toUsername,
  fullDateString,
  toCss,
  useScroll,
  type NoteT,
  type User,
  localize,
  timeAgo,
} from "~/utils";

interface NoteP {
  notes: NoteT[];
  note: NoteT;
  user?: User | null;
  isLoading?: boolean;
  isEditing?: boolean;
  locale: string;
  setLocale: (string) => void;
  localize: (fr: string, en: string) => string;
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
    (locale === "en" ? note.desc_en : note.desc) ||
    `<i>${locale === "en" ? "Empty quote" : "Aucun texte"}</i>`;
  // locale === "en"
  //   ? note.desc_en
  //     ? note.desc_en
  //     : note.desc
  //     ? "<p>You can translate the text below :</p><p>&nbsp;</p>" + note.desc
  //     : "No english translation"
  //   : note.desc;

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

  const NoteHeaderLeft = (props) => {
    const openLabel = localize("Ouvrir le lecteur", "Open the reader");

    return (
      <Flex
        direction={isMobile ? "column" : "row"}
        gap={isMobile ? "1" : "3"}
        mt={isMobile ? "2" : "0"}
        {...props}
      >
        <Flex>
          <PageSwitch
            isPageEdit={isPageEdit}
            setIsPageEdit={setIsPageEdit}
            page={page}
            setPage={setPage}
            note={note}
            onClick={onEditPageClick}
          />

          {note.index !== 0 && (
            <Button>
              <ChevronLeftIcon />
              {localize("Précédente", "Previous")}
            </Button>
          )}

          {note.index !== notes.length - 1 && (
            <Button>
              {localize("Suivant", "Next")}
              <ChevronRightIcon />
            </Button>
          )}
        </Flex>

        <Button className="with-icon" variant="surface" onClick={onOpenClick}>
          {openLabel}
          <ExternalIcon
            {...iconProps({
              title: openLabel,
            })}
          />
        </Button>
      </Flex>
    );
  };

  const NoteHeaderRight = (props) => {
    return (
      <Box {...props}>
        {isLoading && (
          <div className="spinner">
            <span>Chargement...</span>
          </div>
        )}
        {!isLoading && (
          <Flex gap="3">
            <Share1Icon
              color="var(--accent-9)"
              {...iconProps({
                title: localize("Partager la citation", "Share the quote"),
                isMobile,
                onClick: onShareClick,
              })}
            />
            <EditIcon
              onClick={() => onEditClick()}
              {...iconProps({
                title: localize("Modifier la citation", "Edit the quote"),
                isMobile,
                onClick: onEditClick,
              })}
            />
            <DeleteIcon
              {...iconProps({
                title: localize("Supprimer la citation", "Delete the quote"),
                isMobile,
                onClick: onDeleteClick,
              })}
            />
          </Flex>
        )}
      </Box>
    );
  };

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
              {note.isNew
                ? localize("Nouvelle citation", "New quote")
                : localize("Modifiez cette citation", "Edit this quote")}
              <LocaleSwitch locale={locale} setLocale={setLocale} />
            </div>
          )}

          {!isEditing && (
            <>
              {/* note header */}
              {isMobile && (
                <Flex direction="column" gap="0">
                  <NoteHeaderLeft />
                  <NoteHeaderRight mt="2" />
                </Flex>
              )}

              {!isMobile && (
                <Flex justify="between">
                  <NoteHeaderLeft />

                  <Flex>
                    <LocaleSwitch locale={locale} setLocale={setLocale} />
                    <Badge>
                      <UserIcon />
                      {toUsername(note.note_email) ||
                        localize("Anonyme", "Anonymous")}
                    </Badge>
                  </Flex>

                  <NoteHeaderRight />
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
                {Array.isArray(note.comments) && note.comments.length > 0 ? (
                  <Flex>
                    <Button>
                      {note.comments.length +
                        " " +
                        localize("commentaire", "comment")}
                      {note.comments.length > 1 && "s"}

                      {isShowComments ? (
                        <ArrowUpIcon
                          {...iconProps({
                            title: localize(
                              "Ouvrir la zone des commentaires",
                              "Open comments area",
                            ),
                          })}
                        />
                      ) : (
                        <ArrowRightIcon
                          {...iconProps({
                            title: localize(
                              "Fermer la zone des commentaires",
                              "Close comments area",
                            ),
                          })}
                        />
                      )}
                    </Button>
                  </Flex>
                ) : (
                  localize("Pas de commentaires", "No comments")
                )}
              </div>

              {!isAddComment && (
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isAddComment) {
                      setIsAddComment(true);
                      //setIsShowComments(false);
                      setTimeout(() => {
                        executeScroll();
                      }, 200);
                    }
                  }}
                >
                  {localize("Ajouter un commentaire", "Add a comment")}
                </Button>
              )}
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
                <BackButton
                  label="Annuler"
                  onClick={() => {
                    setIsAddComment(false);
                  }}
                >
                  Annuler
                </BackButton>

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
                    <Flex>
                      <Badge size="3">
                        <UserIcon />
                        {toUsername(c.comment_email)}
                      </Badge>
                      : {c.html}
                    </Flex>

                    <Flex
                      gap="1"
                      style={{
                        cursor: "pointer",
                      }}
                    >
                      {/* comment date */}
                      <div css={toCss({ whiteSpace: "nowrap" })}>
                        <Badge title={fullDateString(c.created_at)}>
                          {timeAgo({ date: c.created_at })}
                        </Badge>
                      </div>

                      {/* delete comment */}
                      {c.comment_email === user?.email && (
                        <DeleteIcon
                          onClick={() => {
                            onDeleteCommentClick(c);
                          }}
                        />
                      )}
                    </Flex>
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
