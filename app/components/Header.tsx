import { css } from "@emotion/react";
import {
  DoubleArrowRightIcon,
  ThickArrowRightIcon,
} from "@radix-ui/react-icons";
import { Select } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useNavigation } from "react-router";
import { Flex } from "~/components";
import { getState, setState } from "~/store";
import { localize } from "~/utils";

export const Header = (props) => {
  const { loaderData } = props;
  const { isMobile, lib = loaderData.lib, libs } = useSelector(getState);
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  const [item, setItem] = useState("0");

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const navigate = useNavigate();

  useEffect(() => {
    if (navigation.state === "idle")
      setIsLoading(
        Object.keys(isLoading).reduce(
          (ret, key) => ({ ...ret, [key]: false }),
          {},
        ),
      );
  }, [navigation.state]);
  const onBookClick = async (b) => {
    setIsLoading({ ...isLoading, [b.id]: true });
    await navigate("/" + localize("livre", "book") + "/" + b.id);
  };

  return (
    <Flex direction="column" gap="3" {...(isMobile ? { align: "start" } : {})}>
      <Flex
        {...(isMobile ? { direction: "column", align: "start", gap: "3" } : {})}
      >
        <Select.Root
          defaultValue={item}
          onOpenChange={(open) => {
            if (open)
              alert(
                localize(
                  `Si vous voulez accéder à des citations classées par catégories, merci d'envoyer un mail à ${
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
        </Select.Root>

        <Select.Root
          defaultValue={item}
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

        {item === "0" && (
          <Select.Root
            defaultValue={lib.name}
            onValueChange={(value) => {
              dispatch(
                setState({
                  lib: libs.find(({ name }) => name === value),
                }),
              );
            }}
          >
            <Select.Trigger variant="classic" />
            <Select.Content>
              {loaderData.libs.map((l) => (
                <Select.Item key={"lib-" + l.id} value={l.name}>
                  {l[localize("name")] || l.name}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        )}
      </Flex>

      <Flex width="100%" pl="1">
        <DoubleArrowRightIcon />
        <h3>
          {localize("Bibliothèque", "Library")} :{" "}
          <i>{lib[localize("name")] || lib.name}</i>
        </h3>
      </Flex>

      {/* books list */}
      <Flex gap="0" width="100%" overflowX="scroll">
        {lib.books?.map((b, index) => {
          return (
            <div
              key={"book-" + index}
              css={css`
                ${b.src && "background: url(" + b.src + ");"}
                display: flex;
                align-items: center;
                justify-content: center;
                text-align: center;
                height: 225px;
                min-width: 140px;
                width: 140px;
                cursor: pointer;
                user-select: none;
                border: ${b.id === loaderData.book?.id
                  ? "1px solid yellow"
                  : "1px solid white"};
                font-weight: bold;
              `}
              onClick={() =>
                !Object.keys(isLoading).find((key) => !!isLoading[key]) &&
                !isLoading[b.id] &&
                onBookClick(b)
              }
            >
              {isLoading[b.id] && <div className="spinner" />}
              {!isLoading[b.id] && <>{b[localize("title")] || b.title}</>}
            </div>
          );
        })}
      </Flex>
    </Flex>
  );
};
