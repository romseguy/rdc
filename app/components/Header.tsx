import { css } from "@emotion/react";
import { Select } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { useNavigate, useNavigation } from "react-router";
import { Flex } from "~/components";

export const Header = (props) => {
  const lib = props.lib || props.loaderData.lib;
  const {
    loaderData: { libs, book },
    localize,
  } = props;

  const navigation = useNavigation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
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
    await navigate("/livre/" + b.id);
  };
  const [item, setItem] = useState("0");

  return (
    <Flex direction="column">
      <Flex
        width="100%"
        // {...(isMobile
        //   ? { direction: "column" }
        //   : { justify: "between", width: "100%", p: "1", pt: "0" })}
      >
        <Select.Root
          defaultValue={item}
          value={item}
          onValueChange={(value) => {
            //setItem(value);
            if (value === "1") {
              alert(
                localize(
                  "Si vous voulez accéder à des citations classées par thématiques, merci d'envoyer un mail à {import.meta.env.VITE_PUBLIC_EMAIL} pour me le faire savoir.",
                  "If you are interested in having quotes grouped by topics, please send send an email to {import.meta.env.VITE_PUBLIC_EMAIL} to make me know.",
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
        )}
      </Flex>

      <Flex gap="0" width="100%" overflowX="scroll">
        {lib?.books.map((b, index) => (
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
              border: ${b.id === book?.id
                ? "1px solid yellow"
                : "1px solid white"};
            `}
            onClick={() =>
              !Object.keys(isLoading).find((key) => !!isLoading[key]) &&
              !isLoading[b.id] &&
              onBookClick(b)
            }
          >
            {isLoading[b.id] && <div className="spinner" />}
            {!isLoading[b.id] && b.title}
          </div>
        ))}
      </Flex>
    </Flex>
  );
};
