import { Button, Select, Separator, Spinner } from "@radix-ui/themes";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useNavigation } from "react-router";
import {
  BooksIcon,
  Flex,
  LocaleSwitch,
  UserIcon,
  useToggleModal,
} from "~/components";
import { tokenKey } from "~/lib/supabase/tokenKey";
import { getState, setState } from "~/store";
import { localize, pageTitleStyle, type Lib } from "~/utils";

export const PageTitle = (props) => {
  const { loaderData } = props;
  const {
    auth,
    isMobile,
    isLoaded,
    libs = loaderData.libs,
    locale,
  } = useSelector(getState);
  const user = auth?.user;
  const [item, setItem] = useState("0");
  const libsGroupedByAuthor = useMemo(() => {
    if (!libs) {
    }
    let els: Record<string, Lib[]> = {};
    for (const row of libs) {
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
      p="3"
      {...(isMobile
        ? { direction: "column", align: "start" }
        : { justify: "between" })}
    >
      {/* {!isMobile && <Separator style={{ visibility: "hidden" }} />} */}
      <Flex {...(isMobile ? { justify: "between", width: "100%" } : {})}>
        <h1
          style={pageTitleStyle(isMobile)}
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

        {/* <Select.Root
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
        </Select.Root> */}

        <Flex>
          <BooksIcon />
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
                    } to make me know.`,
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
        </Flex>

        {item === "0" && (
          <Select.Root
            //defaultValue={lib[localize("name")] || lib.name}
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
            <Select.Content>
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
      </Flex>

      <Flex>
        {!isMobile && LoginButton}
        {!isMobile && (
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
    </Flex>
  );
};
