import { css } from "@emotion/react";
import { Badge, Button, Switch, TextArea } from "@radix-ui/themes";
import { MailTo, MailToBody, MailToTrigger } from "@slalombuild/react-mailto";
import { decode } from "html-entities";
import { lazy, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteComment, postComments } from "~/api";
import {
  BackButton,
  Comment,
  DonateButton,
  EmailIcon,
  Flex,
  Input,
  useToast,
} from "~/components";
import { getState, setState } from "~/store";
import {
  linkButton,
  localize,
  toCss,
  toCssString,
  type Book,
  type NoteT,
} from "~/utils";
const Login = lazy(() => import("~/components/Login"));
const sanitize = (str) => decode(str.replace(/(<([^>]+)>)/gi, ""));

export type ModalProps = {
  id: string;
  isOpen: boolean;
  book?: Book | null;
  note?: NoteT | null;
  email?: string | null;
};

export const Modal = (props) => {
  const { i18n } = props;
  const { collections, isMobile, modal } = useSelector(getState);
  const comments = collections.comments.filter(
    ({ is_feedback }) => is_feedback,
  );
  const { id, book, note } = modal;
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const dispatch = useDispatch();
  const showToast = useToast();
  const toggleModal = useToggleModal();

  if (id === "share-modal" && book && note)
    return (
      <div id="modal">
        <div id={id}>
          <Flex
            direction="column"
            justify="center"
            gap="3"
            css={css`
              a {
                ${linkButton()}
              }
            `}
          >
            <h1>
              {localize("Partager la citation", "Share the quote")}{" "}
              {note.page ? "p." + note.page : ""}
            </h1>

            <MailTo
              to=""
              subject={`Citation ${note.page ? "p." + note.page : ""} du ${
                book.title
                  ? ""
                  : note.index === 0
                  ? "premier"
                  : typeof note.index === "number"
                  ? Number(note.index + 1) + "ème"
                  : ""
              }${
                book.title
                  ? " livre : " + book.title
                  : " livre de la bibliothèque : " + props.loaderData.lib.name
              } `}
              obfuscate
            >
              <MailToTrigger>
                {localize("Envoyer par mail", "Send by email")}
              </MailToTrigger>
              <MailToBody>
                - Citation du livre {""} :
                <br />
                <br />
                {sanitize(note.desc)}
              </MailToBody>
            </MailTo>

            <Button
              size="4"
              onClick={() => {
                navigator.clipboard.writeText(
                  import.meta.env.VITE_PUBLIC_URL + "/q/" + note!.id,
                );
                showToast(
                  localize(
                    "Le lien a été copié dans votre presse-papiers",
                    "The link has been copied to your clipboard",
                  ),
                );
              }}
            >
              {localize("Copier le lien", "Copy link to clipboard")}
            </Button>

            <BackButton size="3" onClick={() => toggleModal(id)} />
          </Flex>
        </div>
      </div>
    );

  if (id === "notif-modal")
    return (
      <div id="modal">
        <div id={id}>
          <Flex direction="column" justify="center" gap="3">
            <Flex>
              <BackButton onClick={() => toggleModal(id)} />
              <DonateButton />
            </Flex>

            <h1>Notifications</h1>

            <Flex
              direction={isMobile ? "column" : "row"}
              css={css`
                position: relative;
              `}
            >
              {!modal.email ? (
                <>
                  <Flex
                    css={css`
                      position: absolute;
                      top: 0;
                      left: 0;
                      width: 2.5em;
                      height: 2.5em;
                      font-size: 18px;
                      color: black;
                      svg {
                        flex-shrink: 0;
                        padding: 0 12px;
                      }
                    `}
                  >
                    <EmailIcon />
                  </Flex>
                  <Input
                    autoFocus
                    name="email"
                    type="email"
                    readOnly={!!modal.email}
                    value={email || modal.email || ""}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                </>
              ) : (
                <>
                  {localize(
                    "Seront envoyées à votre adresse e-mail",
                    "Will be send to your email address",
                  )}{" "}
                  : <Badge>{modal.email}</Badge>
                </>
              )}
            </Flex>

            <h2>{localize("Quand ?", "When?")}</h2>

            <Flex>
              <label>{localize("Quotidienne", "Daily")}</label>
              <Switch
                checked={false}
                onCheckedChange={(checked) => {
                  if (checked) {
                    alert(
                      localize(
                        "Si vous trouvez cette fonctionnalité intéressante, merci d'envoyer un mail à " +
                          import.meta.env.VITE_PUBLIC_EMAIL +
                          " pour m'en parler.",
                        "If you are intested in this improvement, please send an email to " +
                          import.meta.env.VITE_PUBLIC_EMAIL +
                          " to let me know.",
                      ),
                    );
                  }
                }}
              />
            </Flex>

            <Flex>
              <label>{localize("Hebdomadaire", "Weekly")}</label>
              <Switch
                checked={false}
                onCheckedChange={(checked) => {
                  if (checked) {
                    alert(
                      localize(
                        "Si vous trouvez cette fonctionnalité intéressante, merci d'envoyer un mail à " +
                          import.meta.env.VITE_PUBLIC_EMAIL +
                          " pour m'en parler.",
                        "If you are intested in this improvement, please send an email to " +
                          import.meta.env.VITE_PUBLIC_EMAIL +
                          " to let me know.",
                      ),
                    );
                  }
                }}
              />
            </Flex>
          </Flex>
        </div>
      </div>
    );

  if (id === "login-modal")
    return (
      <div id="modal">
        <div id={id}>
          <Login showToast={showToast} toggleModal={toggleModal} i18n={i18n} />
        </div>
      </div>
    );

  if (id === "heart-modal")
    return (
      <div id="modal">
        <div id={id}>
          <Flex direction="column" justify="center" gap="3" p="3">
            <Flex>
              <BackButton onClick={() => toggleModal(id)} />
              <DonateButton />
            </Flex>

            <Flex>
              <h1>
                {localize(
                  "Écrivez un message pour suggérer des améliorations",
                  "Write a message to suggest improvements",
                )}
              </h1>
            </Flex>

            <TextArea
              autoFocus
              cols={80}
              placeholder={localize("Écrivez ici", "Write here")}
              onChange={(e) => setMessage(e.target.value)}
            />

            <Flex
              css={css`
                a {
                  ${linkButton(
                    toCssString({
                      padding: "5px 12px 6px 12px",
                      borderRadius: "max(var(--radius-2),var(--radius-full))",
                      fontWeight: "normal",
                      fontSize: "14px",
                    }),
                  )}
                }
              `}
            >
              <Button
                onClick={async () => {
                  try {
                    const { data, error } = await dispatch<any>(
                      postComments.initiate({
                        comment: { html: message, is_feedback: true },
                      }),
                    );
                    if (error) throw error;

                    dispatch(
                      setState({
                        collections: {
                          ...collections,
                          comments: collections.comments.concat([data]),
                        },
                      }),
                    );
                  } catch (error: any) {
                    showToast(error.data, true);
                  }
                }}
              >
                {localize("Envoyer", "Send")}
              </Button>

              <MailTo
                to={import.meta.env.VITE_PUBLIC_EMAIL}
                subject={localize("Amélioration", "Improvement")}
                obfuscate
              >
                <MailToTrigger>
                  {localize("Envoyer par e-mail", "Send by email")}
                </MailToTrigger>
                <MailToBody>{sanitize(message)}</MailToBody>
              </MailTo>
            </Flex>

            <Flex direction="column" width="100%" justify="center">
              {comments.map((comment) => (
                <Comment
                  key={"comment-" + comment.id}
                  width="100%"
                  comment={comment}
                  onDeleteClick={async (comment) => {
                    try {
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

                      dispatch(
                        setState({
                          collections: {
                            ...collections,
                            comments: collections.comments.filter(
                              ({ id }) => id !== comment.id,
                            ),
                          },
                        }),
                      );
                    } catch (error) {
                      showToast(error, true);
                    }
                  }}
                />
              ))}
            </Flex>
          </Flex>
        </div>
      </div>
    );

  return null;
};

export const useToggleModal = () => {
  const dispatch = useDispatch();
  const { modal } = useSelector(getState);
  return (id = "login-modal", props = {}) =>
    dispatch(
      setState({
        modal: {
          id,
          isOpen: !modal.isOpen,
          ...props,
        },
      }),
    );
};
