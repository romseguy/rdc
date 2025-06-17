import { css } from "@emotion/react";
import { ArrowRightIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { Button, Select } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { useNavigate, useNavigation } from "react-router";
import { Flex } from "~/components";
import { toCss } from "~/utils";

export const Header = ({ ...props }) => {
  const lib = props.lib || props.loaderData.lib;
  const {
    loaderData: { libs, book },
    user,
    setUser,
    setAuthToken,
    showToast,
    appearance,
    setAppearance,
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
                "Si vous êtes intéressé par cette fonctionnalité, vous pouvez envoyer un mail à contact@romseguy.com pour me le faire savoir.",
              );
            }
          }}
        >
          <Select.Trigger variant="classic" />
          <Select.Content>
            <Select.Item value="0">Bibliothèques</Select.Item>
            <Select.Item value="1">Thématiques</Select.Item>
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
