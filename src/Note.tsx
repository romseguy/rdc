import { css } from "@emotion/react";
import { toCss } from "./toCss";
import { MailTo, MailToTrigger, MailToBody } from "@slalombuild/react-mailto";

export const Note = ({
  note,
  onOpenClick,
  onEditClick,
  onDeleteClick,
  isEditing,
}) => {
  return (
    <div
      css={toCss({
        paddingBottom: "12px",
        //display: "flex",
        //flexDirection: "column",
      })}
    >
      {/* note header */}
      <div
        css={toCss({
          padding: "6px",
          background: "purple",
        })}
      >
        {isEditing && (
          <>{note.isNew ? "Nouvelle citation" : "Modifier cette citation"}</>
        )}
        {!isEditing && (
          <div
            css={toCss({
              display: "flex",
              justifyContent: "space-between",
            })}
          >
            <div>Cité par {note.email.replace(/@.+/, "")}</div>

            <div
              css={toCss({
                display: "flex",
                gap: "12px",
              })}
            >
              <a href="#" onClick={() => onOpenClick()}>
                Ouvrir
              </a>
              <a href="#" onClick={() => onEditClick()}>
                Modifier
              </a>
              <a href="#" onClick={() => onDeleteClick()}>
                Supprimer
              </a>
              <MailTo
                subject={"Citation du livre : " + "" + ""}
                //cc={["cc1@example.com", "cc2@example.com"]}
                //bcc={["bcc@example.com"]}
                //obfuscate
              >
                <MailToTrigger>Partager</MailToTrigger>
                <MailToBody>
                  - Citation du livre {""} :
                  <br />
                  <br />
                  {note.desc}
                </MailToBody>
              </MailTo>
            </div>
          </div>
        )}
      </div>

      {/* note desc */}
      <div
        key={"note-" + note.id}
        css={toCss({
          padding: "6px",
          background: "rgba(255,255,255,0.1)",
          //height: "100%",
          //height: "100px",
          //overflowY: "scroll",
          //overflowX: "hidden",
          //width: "200px",
          //textOverflow: "ellipsis",
        })}
      >
        {isEditing && (
          <textarea
            defaultValue={note.desc}
            css={css`
              height: 150px;
              width: 100%;
            `}
            onChange={(e) => {
              note.desc = e.target.value;
            }}
            placeholder="Saisissez le texte de la note"
          />
        )}
        {!isEditing && <>{note.desc}</>}
      </div>
    </div>
  );
};
