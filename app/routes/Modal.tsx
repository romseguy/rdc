import { css } from "@emotion/react";
import { Badge, Button, Switch, TextArea } from "@radix-ui/themes";
import { MailTo, MailToBody, MailToTrigger } from "@slalombuild/react-mailto";
import { decode } from "html-entities";
import { lazy, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteComment, postComments } from "~/api";
import { BackButton, EmailIcon, Flex, useToast } from "~/components";
import { Comment } from "~/components/Comment";
//import { Login } from "~/components/Login";
import { Input } from "~/components/ui/input";
import { linkButton } from "~/lib/css";
import { getState, setState } from "~/store";
import { localize, toCss, toCssString } from "~/utils";
const Login = lazy(() => import("~/components/Login"));

export const Modal = (props) => {
  const { i18n } = props;
  const { collections, modal } = useSelector(getState);
  const comments = collections?.comments.filter(({ note_id }) => !note_id);
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
              //cc={["cc1@example.com", "cc2@example.com"]}
              //bcc={["bcc@example.com"]}
              //obfuscate
            >
              <MailToTrigger>
                {localize("Envoyer par mail", "Send by email")}
              </MailToTrigger>
              <MailToBody>
                - Citation du livre {""} :
                <br />
                <br />
                {decode(note.desc.replace(/(<([^>]+)>)/gi, ""))}
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
            <h1>{localize("Vos", "Your")} notifications</h1>
            <Flex
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

            <h2>{localize("Fréquence", "Frequency")}</h2>
            <Flex>
              <label>{localize("Quotidienne", "Daily")}</label>
              <Switch
                checked={false}
                onCheckedChange={(checked) => {
                  if (checked) {
                    alert(
                      localize(
                        "Si vous souhaitez bénéficier de cette fonctionnalité, merci d'envoyer un mail à contact@romseguy.com pour me le faire savoir",
                        "If you want this functionality, please send an email to contact@romseguy.com to let me know",
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
                        "Si vous souhaitez bénéficier de cette fonctionnalité, merci d'envoyer un mail à contact@romseguy.com pour me le faire savoir",
                        "If you want this functionality, please send an email to contact@romseguy.com to let me know",
                      ),
                    );
                  }
                }}
              />
            </Flex>

            <BackButton onClick={() => toggleModal(id)} />
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
            <Flex direction="column" gap="3">
              <Flex>
                <BackButton onClick={() => toggleModal(id)} />
                <a
                  target="_blank"
                  href="https://romseguy.com"
                  css={css(
                    linkButton(
                      toCssString({
                        padding: "6px 12px",
                        borderRadius: "var(--radius-2)",
                        fontWeight: "normal",
                        fontSize: "14px",
                      }),
                    ),
                  )}
                >
                  Faire un don
                </a>
              </Flex>
              <h1>
                Participez à la discussion ci-dessous pour suggérer des
                améliorations
              </h1>
            </Flex>
            <TextArea
              autoFocus
              cols={80}
              placeholder={localize("Écrivez ici", "Write here")}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button
              onClick={async () => {
                try {
                  const { data, error } = await dispatch(
                    //@ts-expect-error
                    postComments.initiate({ comment: { html: message } }),
                  );
                  //@ts-expect-error
                  if (data.error || error)
                    //@ts-expect-error
                    throw new Error(data.error || error);

                  dispatch(
                    setState({
                      collections: {
                        ...collections,
                        comments: collections.comments.concat([data]),
                      },
                    }),
                  );
                } catch (error) {
                  showToast(error, true);
                }
              }}
            >
              {localize("Envoyer", "Send")}
            </Button>
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
