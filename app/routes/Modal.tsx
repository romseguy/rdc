import { css } from "@emotion/react";
import { Badge, Button, Switch } from "@radix-ui/themes";
import { MailTo, MailToBody, MailToTrigger } from "@slalombuild/react-mailto";
import { decode } from "html-entities";
import { useEffect, useState } from "react";
import { BackButton, EmailIcon, Flex } from "~/components";
import { Login } from "~/components/Login";
import { Input } from "~/components/ui/input";

export const Modal = (props) => {
  const { modalState, setModalState, showToast, i18n, localize } = props;
  const close = () => setModalState({ isOpen: false });
  const { id, book, note } = modalState;
  const [email, setEmail] = useState<string>("");

  // useEffect(() => {
  //   if (id === "login-modal") setEmail(initialValue);
  // }, []);

  if (id === "share-modal")
    return (
      <div id="modal">
        <div id={id}>
          <Flex
            direction="column"
            justify="center"
            gap="3"
            css={css`
              a {
                color: white;
                background: var(--accent-9);
                font-size: var(--font-size-4);
                font-weight: var(--font-weight-medium);
                border-radius: var(--radius-4);
                padding: 12px;
                text-decoration: none;
                text-align: center;
                &:hover {
                  background: var(--accent-10);
                }
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

            <BackButton size="3" onClick={close} />
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
              {!modalState.email ? (
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
                    readOnly={!!modalState.email}
                    value={email || modalState.email}
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
                  : <Badge>{modalState.email}</Badge>
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

            <BackButton onClick={close} />
          </Flex>
        </div>
      </div>
    );

  if (id === "login-modal")
    return (
      <div id="modal">
        <div id={id}>
          <Login showToast={showToast} close={close} i18n={i18n} />
        </div>
      </div>
    );

  return null;
};
