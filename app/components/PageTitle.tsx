import { css } from "@emotion/react";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { Box, Button, IconButton, Select, Spinner } from "@radix-ui/themes";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import {
  BooksIcon,
  Flex,
  LocaleSwitch,
  UserIcon,
  useToggleModal,
} from "~/components";
import { tokenKey } from "~/lib/supabase/tokenKey";
import { getState, setState } from "~/store";
import { localize, type Lib } from "~/utils";

export const PageTitle = (props) => {
  const { loaderData } = props;
  const {
    auth,
    isMobile,
    isLoaded,
    lib = loaderData.lib as Lib,
    libs = loaderData.libs as Lib[],
    locale,
  } = useSelector(getState);
  const user = auth?.user;
  const [item, setItem] = useState("0");
  const libsGroupedByAuthor = useMemo(() => {
    if (!libs) {
    }
    const rows = [...libs].sort((a, b) => (a.author > b.author ? 1 : -1));
    let els: Record<string, Lib[]> = {};
    for (const row of rows) {
      els[row.author] = (els[row.author] || []).concat([row]);
    }
    return els;
  }, [libs]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toggleModal = useToggleModal();

  const LoginButton = (
    <>
      {isLoaded && (
        <Button
          className="with-icon"
          type="button"
          onClick={async (e) => {
            e.stopPropagation();

            if (user) {
              const ok = confirm("Êtes-vous sûr de vouloir vous déconnecter?");
              if (ok) {
                dispatch(setState({ auth: undefined }));
                localStorage.removeItem(tokenKey);
              }
            } else {
              toggleModal();
            }
          }}
        >
          <UserIcon />
          {user ? <div>{user.email}</div> : localize("Connexion", "Login")}
        </Button>
      )}
      {!isLoaded && <Spinner />}
    </>
  );

  return (
    <Flex
      id="page-title"
      className="bg-purple-900/75"
      p="3"
      {...(isMobile
        ? { direction: "column", align: "start" }
        : { justify: "between" })}
    >
      <Flex {...(isMobile ? { justify: "between", width: "100%" } : {})}>
        <h1
          onClick={() => {
            navigate("/");
          }}
        >
          {localize("Recueil de citations", "Know my quotes")}
        </h1>
        {isMobile && (
          <LocaleSwitch
            width={"2em"}
            height={"2em"}
            onClick={(e) => {
              e.stopPropagation();
              window.location.replace(
                locale === "en"
                  ? "https://recueildecitations.fr"
                  : "https://knowmyquotes.com",
              );
            }}
          />
        )}
      </Flex>

      <Flex
        align="start"
        {...(isMobile ? { direction: "column", gap: "3" } : {})}
      >
        {isMobile && LoginButton}

        <Flex {...(isMobile ? { direction: "column", align: "start" } : {})}>
          {!isMobile && <BooksIcon height="3em" width="3em" fill="white" />}

          <Select.Root
            value={item}
            onValueChange={(value) => {
              //setItem(value);
              if (value === "1") {
                alert(
                  localize(
                    `Si vous voulez accéder à des citations classées par thématiques, merci d'envoyer un mail à ${
                      import.meta.env.VITE_PUBLIC_EMAIL
                    } pour me le faire savoir.`,
                    `If you are interested in having quotes grouped by topics, please send an email to ${
                      import.meta.env.VITE_PUBLIC_EMAIL
                    } to let me know.`,
                  ),
                );
              }
            }}
          >
            <Select.Trigger variant="classic" />
            <Select.Content>
              <Select.Item value="0">
                {localize("Bibliothèques", "Libraries")}
              </Select.Item>
              <Select.Item value="1">
                {localize("Thématiques", "Topics")}
              </Select.Item>
            </Select.Content>
          </Select.Root>

          <Flex>
            {item === "0" && (
              <Select.Root
                defaultValue={lib[localize("name")] || lib.name}
                onValueChange={(value) => {
                  const newLib = libs.find(
                    (lib) => (lib[localize("name")] || lib.name) === value,
                  );
                  dispatch(
                    setState({
                      lib: newLib,
                    }),
                  );
                  navigate("/");
                }}
              >
                <Select.Trigger
                  placeholder={localize(
                    "Choisir une bibliothèque",
                    "Pick a library",
                  )}
                  variant="classic"
                />
                <Select.Content
                  css={css`
                    *  {
                      margin: 0;
                      padding: 3px;
                    }
                  `}
                >
                  {Object.keys(libsGroupedByAuthor).map((author, i) => (
                    <Select.Group key={"author" + i}>
                      <Select.Label>{author}</Select.Label>
                      {(libsGroupedByAuthor[author] || []).map((l) => (
                        <Select.Item
                          key={"lib-" + l.id}
                          value={l[localize("name")] || l.name}
                        >
                          {l[localize("name")] || l.name}
                        </Select.Item>
                      ))}
                    </Select.Group>
                  ))}
                </Select.Content>
              </Select.Root>
            )}
            <IconButton
              onClick={() => {
                alert(
                  localize(
                    "Pour ajouter une bibliothèque, envoyez un e-mail à " +
                      import.meta.env.VITE_PUBLIC_EMAIL +
                      "",
                    "To add a library, send an email to" +
                      import.meta.env.VITE_PUBLIC_EMAIL +
                      "",
                  ),
                );
              }}
              variant="surface"
            >
              <PlusCircledIcon />
            </IconButton>
          </Flex>
        </Flex>
      </Flex>

      {!isMobile && (
        <Flex>
          {LoginButton}
          <LocaleSwitch
            width={"2em"}
            height={"2em"}
            onClick={(e) => {
              e.stopPropagation();
              window.location.replace(
                locale === "en"
                  ? "https://recueildecitations.fr"
                  : "https://knowmyquotes.com",
              );
            }}
          />
        </Flex>
      )}
    </Flex>
  );
};

{
  /* <Select.Root
          defaultValue={item}
          onOpenChange={(open) => {
            if (open)
              alert(
                localize(
                  `Si vous voulez avoir les bibliothèques classées par catégories, merci d'envoyer un mail à ${
                    import.meta.env.VITE_PUBLIC_EMAIL
                  } pour me le faire savoir.`,
                  `If you are interested in having quotes grouped by categories, please send an email to ${
                    import.meta.env.VITE_PUBLIC_EMAIL
                  } to make me know.`,
                ),
              );
          }}
        >
          <Select.Trigger variant="classic" />
          <Select.Content>
            <Select.Item value="0">
              {localize("Catégories", "Categories")}
            </Select.Item>
          </Select.Content>
        </Select.Root> */
}
