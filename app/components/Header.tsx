import { css } from "@emotion/react";
import { ArrowRightIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { Select } from "@radix-ui/themes";
import { useState } from "react";
import { isMobile } from "react-device-detect";
import { useNavigate } from "react-router";
import { Flex } from "~/components";
import { Toggle } from "~/components/ui/toggle";
import { toCss } from "~/utils";

export const Header = ({ ...props }) => {
  const {
    loaderData: { libs, book },
    user,
    setUser,
    setAuthToken,
    showToast,
    appearance,
    setAppearance,
  } = props;

  const lib = props.lib || props.loaderData.lib;

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});

  const onBookClick = async (b) => {
    setIsLoading({ ...isLoading, [b.id]: true });
    await navigate("/livre/" + b.id);
    setIsLoading({ ...isLoading, [b.id]: false });
  };

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
          justifyContent: "space-between",
          gap: "6px",
          marginBottom: isMobile ? "12px" : "0px",
          padding: "5px 0 6px 0",
        })}
      >
        {/* left */}
        <Flex>
          <Flex>
            <ArrowRightIcon />
            Sélectionnez une bibliothèque
          </Flex>

          <Select.Root
            defaultValue={lib?.name}
            onValueChange={(value) => {
              props.setLib(value);
            }}
          >
            <Select.Trigger variant="classic" />
            <Select.Content>
              {libs?.map((l) => (
                <Select.Item key={"lib-" + l.id} value={l.name}>
                  {l.name}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>

          <div>ou une thématique</div>

          <Select.Root
            defaultValue="0"
            onOpenChange={(isOpen) => {
              if (isOpen)
                alert(
                  "Si vous êtes intéressé par cette fonctionnalité, vous pouvez envoyer un mail à contact@romseguy.com pour me le faire savoir.",
                );
            }}
          >
            <Select.Trigger variant="classic" />
            <Select.Content>
              <Select.Item value="0">À venir...</Select.Item>
            </Select.Content>
          </Select.Root>
        </Flex>

        {/* right */}
        <Flex>
          <button
            className="with-icon"
            onClick={async (e) => {
              e.stopPropagation();

              if (user) {
                const ok = confirm(
                  "Êtes-vous sûr de vouloir vous déconnecter?",
                );
                if (ok) {
                  setAuthToken();
                  setUser(undefined);
                }
              } else {
                props.setModalState({ ...props.modalState, isOpen: true });
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

          <Toggle
            onPressedChange={(pressed) =>
              setAppearance(pressed ? "dark" : "light")
            }
          >
            {appearance === "dark" ? <SunIcon /> : <MoonIcon />}
          </Toggle>
        </Flex>
      </div>

      <div css={toCss({ display: "flex", overflowX: "scroll" })}>
        {lib?.books.map((b, index) => {
          if (isLoading[b.id])
            return (
              <div
                key={"book-" + index}
                css={css`
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  text-align: center;
                  height: 225px;
                  min-width: 146px;
                  cursor: pointer;
                  border: ${b.id === book?.id
                    ? "1px solid yellow"
                    : "1px solid white"};
                `}
                onClick={() => onBookClick(b)}
              >
                <div className="spinner" />
              </div>
            );

          if (b.src) {
            return (
              <img
                key={"book-" + index}
                src={b.src}
                css={css`
                  cursor: pointer;
                  border: ${b.id === book?.id
                    ? "1px solid yellow"
                    : "1px solid white"};
                `}
                onClick={() => onBookClick(b)}
              />
            );
          }

          return (
            <div
              key={"book-" + index}
              css={css`
                display: flex;
                align-items: center;
                justify-content: center;
                text-align: center;
                height: 225px;
                width: 140px;
                cursor: pointer;
                border: ${b.id === book?.id
                  ? "1px solid yellow"
                  : "1px solid white"};
              `}
              onClick={() => onBookClick(b)}
            >
              {b.title}
            </div>
          );
        })}
      </div>
    </div>
  );
};
