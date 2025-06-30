import { css } from "@emotion/react";
import {
  ArrowRightIcon,
  ArrowUpIcon,
  ChatBubbleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusCircledIcon,
  ReaderIcon,
  Share1Icon,
} from "@radix-ui/react-icons";
import { Badge, Box, Button, IconButton } from "@radix-ui/themes";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useNavigation } from "react-router";
import {
  BackButton,
  Comment,
  DeleteIcon,
  EditIcon,
  ExternalIcon,
  Flex,
  LocaleSwitch,
  PageSwitch,
  RTEditor,
  UserIcon,
  iconProps,
} from "~/components";
import { getState, setState } from "~/store";
import {
  localize,
  toCss,
  toUsername,
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
    isEditing = false,
    isLoading = false,
    onOpenClick,
    onEditClick,
    onEditPageClick,
    onShareClick,
    onDeleteClick,
    onSubmitCommentClick,
    onDeleteCommentClick,
  } = props;
  const { isMobile, locale } = useSelector(getState);

  const desc =
    (locale === "en" ? note.desc_en : note.desc) ||
    `<i>${
      locale === "en"
        ? note.desc
          ? "Quote is in french only, click the French flag icon above to read it"
          : "Empty quote"
        : "Aucun texte"
    }</i>`;
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

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
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

  const NoteHeaderLeft = (props) => {
    const openLabel = localize("Ouvrir le lecteur", "Open the reader");

    return (
      <Flex
        direction={isMobile ? "column" : "row"}
        gap={isMobile ? "0" : "3"}
        {...props}
      >
        <LocaleSwitch
          setLocale={(locale) => {
            navigate(
              locale === "fr"
                ? location.pathname.replace("book", "livre")
                : location.pathname.replace("livre", "book"),
            );
          }}
        />
        <PageSwitch
          variant="soft"
          isPageEdit={isPageEdit}
          setIsPageEdit={setIsPageEdit}
          page={page}
          setPage={setPage}
          note={note}
          onClick={onEditPageClick}
        />

        <Button
          type="button"
          variant="soft"
          className="with-icon"
          onClick={onOpenClick}
        >
          <ReaderIcon
            {...iconProps({
              title: openLabel,
              style: { border: 0, padding: "unset" },
            })}
          />
          {openLabel}
        </Button>

        {note.index !== 0 && (
          <Button variant="soft" type="button">
            <ChevronLeftIcon />
            {localize("Précédent", "Previous")}
          </Button>
        )}

        {note.index !== notes.length - 1 && (
          <Button variant="soft" type="button">
            {localize("Suivant", "Next")}
            <ChevronRightIcon />
          </Button>
        )}
      </Flex>
    );
  };

  const NoteHeaderRight = (props) => {
    return (
      <Box {...props}>
        {!isLoading && (
          <Flex gap="3">
            <Share1Icon
              color="var(--color-blue-500)"
              {...iconProps({
                title: localize("Partager la citation", "Share the quote"),
                onClick: onShareClick,
              })}
            />
            <EditIcon
              {...iconProps({
                title: localize("Modifier la citation", "Edit the quote"),
                onClick: onEditClick,
              })}
            />
            <DeleteIcon
              {...iconProps({
                title: localize("Supprimer la citation", "Delete the quote"),
                onClick: onDeleteClick,
              })}
            />
          </Flex>
        )}
        {isLoading && (
          <div className="spinner">
            <span>Chargement...</span>
          </div>
        )}
      </Box>
    );
  };

  const onUserBadgeClick = () =>
    alert(
      localize(
        "Si vous souhaitez envoyer un message à cet utilisateur, demandez son e-mail à " +
          import.meta.env.VITE_PUBLIC_EMAIL,
        "If you want to message this user, ask their email to " +
          import.meta.env.VITE_PUBLIC_EMAIL,
      ),
    );

  return (
    <section>
      {/* note header */}
      <header>
        {isEditing && (
          <Flex gap="3">
            {note.isNew
              ? localize("Nouvelle citation", "New quote")
              : localize("Modifiez cette citation", "Edit this quote")}
            <LocaleSwitch
              setLocale={(locale) => dispatch(setState({ locale }))}
            />
          </Flex>
        )}

        {!isEditing && (
          <>
            {/* note header */}
            {isMobile && (
              <Flex
                direction="column"
                css={css`
                  button {
                    margin-bottom: 12px;
                  }
                `}
              >
                <NoteHeaderLeft />
                <NoteHeaderRight />
              </Flex>
            )}

            {!isMobile && (
              <Flex justify="between">
                <NoteHeaderLeft />

                <Flex>{/* CENTER */}</Flex>

                <NoteHeaderRight />
              </Flex>
            )}
          </>
        )}
      </header>

      {/* note desc */}
      <main
        key={"note-" + note.id}
        css={css`
          padding: ${isMobile ? "0px" : "6px"};
          ${isEditing ? "min-height: 250px;" : ""}
          ${!isEditing ? "overflow-y: scroll" : ""}
        `}
      >
        {isEditing && editor(locale)}
        {!isEditing && (
          <>
            <Badge variant="surface" onClick={onUserBadgeClick}>
              <UserIcon />
              {toUsername(note.note_email) || localize("Anonyme", "Anonymous")}
            </Badge>
            <div
              dangerouslySetInnerHTML={{
                __html: desc,
              }}
            />
          </>
        )}
      </main>

      {/* comments */}
      {!note.isNew && (
        <footer>
          {!note.isEditing && (
            <Flex
              onClick={async () => {
                setIsShowComments(!isShowComments);
                if (!isShowComments) {
                  setTimeout(() => {
                    executeScroll();
                  }, 100);
                }
              }}
            >
              {!isAddComment && (
                <>
                  <Button
                    variant="soft"
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
                    <PlusCircledIcon />
                    {localize("Ajouter un commentaire", "Add a comment")}
                  </Button>
                </>
              )}

              {Array.isArray(note.comments) && note.comments.length > 0 && (
                <Button>
                  <ChatBubbleIcon />
                  {note.comments.length}
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
              )}
            </Flex>
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
              {note.comments?.map((c, i) => {
                return (
                  <Comment
                    css={toCss({
                      borderBottom:
                        i !== (note.comments?.length || 0) - 1
                          ? "1px solid white"
                          : "",
                    })}
                    comment={c}
                    onDeleteClick={() => onDeleteCommentClick(c)}
                  />
                );
              })}
            </div>
          )}
          <div ref={elementToScrollRef} />
        </footer>
      )}
    </section>
  );
};
