import { css } from "@emotion/react";
import { Button } from "@radix-ui/themes";
import { MailTo, MailToBody, MailToTrigger } from "@slalombuild/react-mailto";
import { decode } from "html-entities";
import { Flex } from "~/components";
import { Login } from "~/components/Login";

export const Modal = (props) => {
  const { modalState, setModalState, showToast } = props;
  const close = () => setModalState({ isOpen: false });
  const { isOpen, book, note } = modalState;

  if (!isOpen) return null;

  if (note)
    return (
      <div id="modal">
        <div id="share-modal">
          <Flex
            direction="column"
            justify="center"
            gap="3"
            css={css`
              a {
                color: white;
                background: var(--accent-9);
                font-size: var(--font-size-4);
                &:hover {
                  background: var(--accent-10);
                }
              }
              a {
                border-radius: var(--radius-4);
                padding: 12px;
                text-decoration: none;
                text-align: center;
              }
            `}
          >
            <h1>Partager la citation {note.page ? "p." + note.page : ""}</h1>

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
              <MailToTrigger>Envoyer un mail</MailToTrigger>
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
                  import.meta.env.VITE_PUBLIC_URL + "/note/" + note!.id,
                );
                showToast("Le lien a été copié dans votre presse-papiers");
              }}
            >
              Copier le lien
            </Button>

            <Button size="4" className="cancel-btn" onClick={close}>
              Retour
            </Button>
          </Flex>
        </div>
      </div>
    );

  if (!note)
    return (
      <div id="modal">
        <div id="login-modal">
          <Login showToast={showToast} close={close} />
        </div>
      </div>
    );

  return null;
};
