import { css } from "@emotion/react";
import { fullDateString, toCss } from "./utils";
import { MailTo, MailToTrigger, MailToBody } from "@slalombuild/react-mailto";
import { useState } from "react";
import { toUsername } from "./utils";

export const Note = ({
  note,
  onOpenClick,
  onEditClick,
  onDeleteClick,
  onSubmitCommentClick,
  onDeleteCommentClick,
  isEditing,
}) => {
  const [text, setText] = useState({ note_id: note.id });
  const [isShow, setIsShow] = useState(false);
  const [isAdd, setIsAdd] = useState(false);

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
            <div>Cité par {toUsername(note.email)}</div>
            <div>Cité par {toUsername(note.email)}</div>

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
        {!isEditing && <div dangerouslySetInnerHTML={{ __html: note.desc }} />}
        {!isEditing && <div dangerouslySetInnerHTML={{ __html: note.desc }} />}
      </div>

      {!note.isNew && (
        <div css={toCss({})}>
          <div
            css={toCss({
              display: "flex",
              justifyContent: "space-between",
              padding: "6px",
              background: "purple",
              cursor: "pointer",
            })}
            onClick={() => setIsShow(!isShow)}
          >
            <div>
              {Array.isArray(note.comments)
                ? "Lire les " + note.comments.length
                : "0"}{" "}
              commentaires {isShow ? "V" : ">"}
            </div>

            <div>
              <a
                href="#"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isAdd) setIsAdd(true);
                }}
              >
                Ajouter un commentaire
              </a>
            </div>
          </div>

          {isAdd && (
            <div css={toCss({ padding: "12px 12px 0px 0px" })}>
              <textarea
                css={toCss({ width: "100%", height: "150px" })}
                placeholder="Écrivez ici votre commentaire"
                onChange={(e) => setText({ ...text, html: e.target.value })}
              />
              <div
                css={toCss({
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                })}
              >
                <button
                  css={toCss({ background: "red" })}
                  onClick={() => {
                    setIsAdd(false);
                  }}
                >
                  Annuler
                </button>

                <button
                  css={toCss({ background: "green" })}
                  onClick={() => {
                    setIsAdd(false);
                    setIsShow(true);
                    onSubmitCommentClick(text);
                  }}
                >
                  Valider
                </button>
              </div>
            </div>
          )}

          {isShow && (
            <div css={toCss({ background: "rgba(255, 255, 255, 0.2)" })}>
              {note.comments.map((c) => {
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
                    <div>
                      {toUsername(c.email)} : {c.html}
                    </div>
                    <div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "3px",
                          cursor: "pointer",
                        }}
                        css={css`
                          svg {
                            fill: red;
                          }
                          svg:hover {
                            stroke: red;
                            fill: white;
                          }
                        `}
                      >
                        <div css={toCss({ whiteSpace: "nowrap" })}>
                          {fullDateString(c.created_at)}
                        </div>
                        <div>
                          <svg
                            viewBox="0 0 24 24"
                            height="1em"
                            width="1em"
                            xmlns="http://www.w3.org/2000/svg"
                            onClick={() => {
                              onDeleteCommentClick(c);
                            }}
                          >
                            <path d="M19.452 7.5H4.547a.5.5 0 00-.5.545l1.287 14.136A2 2 0 007.326 24h9.347a2 2 0 001.992-1.819L19.95 8.045a.5.5 0 00-.129-.382.5.5 0 00-.369-.163zm-9.2 13a.75.75 0 01-1.5 0v-9a.75.75 0 011.5 0zm5 0a.75.75 0 01-1.5 0v-9a.75.75 0 011.5 0zM22 4h-4.75a.25.25 0 01-.25-.25V2.5A2.5 2.5 0 0014.5 0h-5A2.5 2.5 0 007 2.5v1.25a.25.25 0 01-.25.25H2a1 1 0 000 2h20a1 1 0 000-2zM9 3.75V2.5a.5.5 0 01.5-.5h5a.5.5 0 01.5.5v1.25a.25.25 0 01-.25.25h-5.5A.25.25 0 019 3.75z"></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
