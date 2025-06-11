import { isMobile } from "react-device-detect";
import "./App.scss";
import { client, prefix } from "./client";
import { toCss } from "./utils";

export const Header = ({
  lib,
  setLib,
  libs,
  book,
  setBook,
  user,
  setUser,
  setAccessToken,
  setRefreshToken,
  showToast,
}) => {
  return (
    <div
      css={toCss({
        display: "flex",
        flexDirection: "column",
        width: "100%",
      })}
    >
      <div
        css={toCss({
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: "center",
          gap: "6px",
          marginBottom: isMobile ? "12px" : "0px",
        })}
      >
        <button
          css={toCss({
            display: "flex",
            alignItems: "center",
            gap: "6px",
          })}
          onClick={async (e) => {
            e.stopPropagation();

            if (user) {
              const ok = confirm("Êtes-vous sûr de vouloir vous déconnecter?");
              if (ok) {
                setAccessToken();
                setRefreshToken();
                setUser(undefined);
              }
            } else {
              const email = prompt("Saisissez votre adresse e-mail");
              const password = prompt("Saisissez votre mot de passe");

              if (email && password) {
                const { data } = await client.post(prefix + "/login", {
                  email,
                  password,
                });

                if (data.error) {
                  showToast(data.message, true);
                } else {
                  setAccessToken(data.session.access_token);
                  setRefreshToken(data.session.refresh_token);
                }
              }
            }
          }}
        >
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 448 512"
            height="1em"
            width="1em"
          >
            <path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"></path>
          </svg>
          {user ? <div css={toCss({})}>{user.email}</div> : "Connexion"}
        </button>

        <div>Bibliothèque :</div>

        <select
          defaultValue={lib?.name}
          onChange={(e) => {
            setLib(e.target.value);
          }}
        >
          {libs?.map((l) => (
            <option key={"lib-" + l.id}>{l.name}</option>
          ))}
        </select>
      </div>

      <div css={toCss({ display: "flex", overflowX: "scroll" })}>
        {lib?.books.map((b, index) => {
          //if (b.id !== book?.id) return null;

          if (b.src)
            return (
              <img
                key={"book-" + index}
                src={b.src}
                css={toCss({ cursor: "pointer" })}
                onClick={() => {
                  if (b.id !== index) {
                    setBook(lib.books[index]);
                  }
                }}
              />
            );

          return (
            <div
              key={"book-" + index}
              css={toCss({
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                border: "1px solid white",
                height: "225px",
                width: "140px",
                cursor: "pointer",
              })}
              onClick={() => {
                if (b.id !== index) {
                  setBook(lib.books[index]);
                }
              }}
            >
              {b.title}
            </div>
          );
        })}
      </div>
    </div>
  );
};
