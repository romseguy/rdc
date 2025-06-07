import { css } from "@emotion/react";
import { fullDateString, toCss, useScroll } from "./utils";
import { MailTo, MailToTrigger, MailToBody } from "@slalombuild/react-mailto";
import { useMemo, useState } from "react";
import { toUsername } from "./utils";
import { RTEditor } from "./RTEditor";
import { Note as NoteT, User } from "./types";

export const Note = ({
  note,
  user,
  onOpenClick,
  onEditClick,
  onDeleteClick,
  onSubmitCommentClick,
  onDeleteCommentClick,
  isEditing = false,
}: {
  note: NoteT;
  user?: User | null;
  onOpenClick?: any;
  onEditClick?: any;
  onDeleteClick?: any;
  onSubmitCommentClick?: any;
  onDeleteCommentClick?: any;
  isEditing: boolean;
}) => {
  const [locale, setLocale] = useState("fr");
  console.log("🚀 ~ locale:", locale);
  const [comment, setComment] = useState();
  const [isShow, setIsShow] = useState(false);
  const [executeScroll, elementToScrollRef] = useScroll<HTMLDivElement>();
  const [isAdd, setIsAdd] = useState(false);
  const editor = (loc) => {
    console.log("🚀 ~ editor ~ loc:", loc);
    //console.log(loc === "en" ? note.desc_en : note.desc);
    return (
      <RTEditor
        defaultValue={loc === "en" ? note.desc_en : note.desc}
        placeholder="Saisissez le texte de la note"
        onChange={({ html }) => {
          if (loc === "en") note.desc_en = html;
          else note.desc = html;
        }}
      />
    );
  };

  const LocaleSwitch = () => {
    return (
      <div>
        {locale === "en" && (
          <svg
            width="2em"
            height="2em"
            cursor="pointer"
            viewBox="0 0 30 30.000001"
            preserveAspectRatio="xMidYMid meet"
            zoomAndPan="magnify"
            xmlns="http://www.w3.org/2000/svg"
            version="1.0"
            onClick={() => {
              setLocale("fr");
            }}
          >
            <defs>
              <clipPath id="id1">
                <path
                  d="M 2.511719 6.402344 L 27.191406 6.402344 L 27.191406 24.546875 L 2.511719 24.546875 Z M 2.511719 6.402344 "
                  clip-rule="nonzero"
                />
              </clipPath>
            </defs>
            <g clip-path="url(#id1)">
              <path
                fill="rgb(0%, 14.118958%, 49.01886%)"
                d="M 2.519531 9.234375 L 2.519531 11.984375 L 6.375 11.984375 Z M 5.714844 24.546875 L 11.425781 24.546875 L 11.425781 20.472656 Z M 18.277344 20.472656 L 18.277344 24.546875 L 23.984375 24.546875 Z M 2.519531 18.964844 L 2.519531 21.714844 L 6.378906 18.964844 Z M 23.988281 6.402344 L 18.277344 6.402344 L 18.277344 10.472656 Z M 27.183594 21.714844 L 27.183594 18.964844 L 23.324219 18.964844 Z M 27.183594 11.984375 L 27.183594 9.234375 L 23.324219 11.984375 Z M 11.425781 6.402344 L 5.714844 6.402344 L 11.425781 10.472656 Z M 11.425781 6.402344 "
                fill-opacity="1"
                fill-rule="nonzero"
              />
              <path
                fill="rgb(81.17981%, 10.5896%, 16.859436%)"
                d="M 19.742188 18.964844 L 26.394531 23.710938 C 26.71875 23.375 26.949219 22.953125 27.074219 22.488281 L 22.132812 18.964844 Z M 11.425781 18.964844 L 9.960938 18.964844 L 3.304688 23.707031 C 3.664062 24.078125 4.121094 24.34375 4.632812 24.464844 L 11.425781 19.621094 Z M 18.277344 11.984375 L 19.742188 11.984375 L 26.394531 7.238281 C 26.039062 6.867188 25.582031 6.605469 25.070312 6.480469 L 18.277344 11.324219 Z M 9.960938 11.984375 L 3.304688 7.238281 C 2.984375 7.574219 2.753906 7.992188 2.628906 8.460938 L 7.570312 11.984375 Z M 9.960938 11.984375 "
                fill-opacity="1"
                fill-rule="nonzero"
              />
              <path
                fill="rgb(93.328857%, 93.328857%, 93.328857%)"
                d="M 27.183594 17.566406 L 16.90625 17.566406 L 16.90625 24.546875 L 18.277344 24.546875 L 18.277344 20.472656 L 23.984375 24.546875 L 24.441406 24.546875 C 25.207031 24.546875 25.898438 24.222656 26.394531 23.710938 L 19.742188 18.964844 L 22.132812 18.964844 L 27.074219 22.488281 C 27.136719 22.253906 27.183594 22.011719 27.183594 21.753906 L 27.183594 21.714844 L 23.324219 18.964844 L 27.183594 18.964844 Z M 2.519531 17.566406 L 2.519531 18.964844 L 6.378906 18.964844 L 2.519531 21.714844 L 2.519531 21.753906 C 2.519531 22.515625 2.820312 23.203125 3.304688 23.707031 L 9.960938 18.964844 L 11.425781 18.964844 L 11.425781 19.621094 L 4.632812 24.464844 C 4.835938 24.515625 5.042969 24.546875 5.261719 24.546875 L 5.714844 24.546875 L 11.425781 20.472656 L 11.425781 24.546875 L 12.796875 24.546875 L 12.796875 17.566406 Z M 27.183594 9.191406 C 27.183594 8.429688 26.882812 7.742188 26.394531 7.238281 L 19.742188 11.984375 L 18.277344 11.984375 L 18.277344 11.324219 L 25.070312 6.480469 C 24.867188 6.433594 24.660156 6.402344 24.441406 6.402344 L 23.988281 6.402344 L 18.277344 10.472656 L 18.277344 6.402344 L 16.90625 6.402344 L 16.90625 13.378906 L 27.183594 13.378906 L 27.183594 11.984375 L 23.324219 11.984375 L 27.183594 9.234375 Z M 11.425781 6.402344 L 11.425781 10.472656 L 5.714844 6.402344 L 5.261719 6.402344 C 4.496094 6.402344 3.804688 6.722656 3.304688 7.238281 L 9.960938 11.984375 L 7.570312 11.984375 L 2.628906 8.460938 C 2.566406 8.695312 2.519531 8.9375 2.519531 9.191406 L 2.519531 9.234375 L 6.375 11.984375 L 2.519531 11.984375 L 2.519531 13.378906 L 12.796875 13.378906 L 12.796875 6.402344 Z M 11.425781 6.402344 "
                fill-opacity="1"
                fill-rule="nonzero"
              />
              <path
                fill="rgb(81.17981%, 10.5896%, 16.859436%)"
                d="M 16.90625 13.378906 L 16.90625 6.402344 L 12.796875 6.402344 L 12.796875 13.378906 L 2.519531 13.378906 L 2.519531 17.566406 L 12.796875 17.566406 L 12.796875 24.546875 L 16.90625 24.546875 L 16.90625 17.566406 L 27.183594 17.566406 L 27.183594 13.378906 Z M 16.90625 13.378906 "
                fill-opacity="1"
                fill-rule="nonzero"
              />
            </g>
          </svg>
        )}

        {locale === "fr" && (
          <svg
            width="2em"
            height="2em"
            cursor="pointer"
            viewBox="0 0 30 30.000001"
            preserveAspectRatio="xMidYMid meet"
            zoomAndPan="magnify"
            xmlns="http://www.w3.org/2000/svg"
            version="1.0"
            onClick={() => {
              setLocale("en");
            }}
          >
            <defs>
              <clipPath id="id1">
                <path
                  d="M 19 5.261719 L 27.582031 5.261719 L 27.582031 23.40625 L 19 23.40625 Z M 19 5.261719 "
                  clip-rule="nonzero"
                />
              </clipPath>
              <clipPath id="id2">
                <path
                  d="M 2.179688 5.261719 L 11 5.261719 L 11 23.40625 L 2.179688 23.40625 Z M 2.179688 5.261719 "
                  clip-rule="nonzero"
                />
              </clipPath>
              <clipPath id="id3">
                <path
                  d="M 10 5.261719 L 20 5.261719 L 20 23.40625 L 10 23.40625 Z M 10 5.261719 "
                  clip-rule="nonzero"
                />
              </clipPath>
            </defs>
            <g clip-path="url(#id1)">
              <path
                fill="rgb(92.939758%, 16.079712%, 22.349548%)"
                d="M 27.574219 20.617188 C 27.574219 22.15625 26.3125 23.40625 24.753906 23.40625 L 19.113281 23.40625 L 19.113281 5.261719 L 24.753906 5.261719 C 26.3125 5.261719 27.574219 6.511719 27.574219 8.054688 Z M 27.574219 20.617188 "
                fill-opacity="1"
                fill-rule="nonzero"
              />
            </g>
            <g clip-path="url(#id2)">
              <path
                fill="rgb(0%, 14.118958%, 58.428955%)"
                d="M 5.011719 5.261719 C 3.453125 5.261719 2.191406 6.511719 2.191406 8.054688 L 2.191406 20.617188 C 2.191406 22.15625 3.453125 23.40625 5.011719 23.40625 L 10.652344 23.40625 L 10.652344 5.261719 Z M 5.011719 5.261719 "
                fill-opacity="1"
                fill-rule="nonzero"
              />
            </g>
            <g clip-path="url(#id3)">
              <path
                fill="rgb(93.328857%, 93.328857%, 93.328857%)"
                d="M 10.652344 5.261719 L 19.113281 5.261719 L 19.113281 23.40625 L 10.652344 23.40625 Z M 10.652344 5.261719 "
                fill-opacity="1"
                fill-rule="nonzero"
              />
            </g>
          </svg>
        )}
      </div>
    );
  };

  return (
    <div
      css={toCss({
        fontSize: "smaller",
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
          <div
            css={toCss({
              display: "flex",
              alignItems: "center",
              gap: "6px",
            })}
          >
            {note.isNew ? "Nouvelle citation" : "Modifier cette citation"}
            {!!setLocale && (
              <>
                <LocaleSwitch />
              </>
            )}
          </div>
        )}

        {!isEditing && (
          <div
            css={toCss({
              display: "flex",
              justifyContent: "space-between",
            })}
          >
            <div
              css={toCss({ display: "flex", alignItems: "center", gap: "6px" })}
            >
              <div>Cité par {toUsername(note.note_email)}</div>
              <LocaleSwitch />
            </div>

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
                  {note.desc.replace(/<\/?[^>]+(>|$)/g, "")}
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
          maxHeight: window.innerHeight - 250 + "px",
          //height: "100%",
          //height: "100px",
          overflowY: "scroll",
          //overflowX: "hidden",
          //width: "200px",
          //textOverflow: "ellipsis",
        })}
      >
        {isEditing && editor(locale)}
        {!isEditing && (
          <div
            dangerouslySetInnerHTML={{
              __html: locale === "en" ? note.desc_en : note.desc,
            }}
          />
        )}
      </div>

      {/* comments */}
      {!note.isNew && (
        <div css={toCss({})}>
          {!note.isEditing && (
            <div
              css={toCss({
                display: "flex",
                justifyContent: "space-between",
                padding: "6px",
                background: "purple",
                cursor: "pointer",
              })}
              onClick={async () => {
                setIsShow(!isShow);
                if (!isShow) {
                  setTimeout(() => {
                    executeScroll();
                  }, 100);
                }
              }}
            >
              <div>
                {Array.isArray(note.comments) && note.comments.length > 0
                  ? `Lire les ${note.comments.length} commentaires ${
                      isShow ? "V" : ">"
                    }`
                  : "0 commentaires"}
              </div>

              <div>
                <a
                  href="#"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isAdd) {
                      setIsAdd(true);
                      setIsShow(false);
                      setTimeout(() => {
                        executeScroll();
                      }, 200);
                    }
                  }}
                >
                  Ajouter un commentaire
                </a>
              </div>
            </div>
          )}

          {isAdd && (
            <div css={toCss({ padding: "12px 12px 0px 0px" })}>
              <textarea
                autoFocus
                css={toCss({ width: "100%", height: "150px" })}
                placeholder="Écrivez ici votre commentaire"
                onChange={(e) => setComment({ html: e.target.value })}
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
                    onSubmitCommentClick(comment);
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
                      {/* comment date */}
                      <div css={toCss({ whiteSpace: "nowrap" })}>
                        {fullDateString(c.created_at)}
                      </div>

                      {/* delete comment */}
                      {c.comment_email === user?.email && (
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
