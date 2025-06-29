import { localize } from "~/utils";
import { BooksIcon, Flex } from "./shared";
import { Button } from "@radix-ui/themes";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { css } from "@emotion/react";

export const LibTitle = (props) => {
  const { lib } = props;
  return (
    <>
      <Flex>
        <BooksIcon height="3em" width="3em" fill="currentColor" />

        <h1>
          <i>{lib[localize("name")] || lib.name}</i>
        </h1>
      </Flex>

      <Button
        ml="1"
        variant="surface"
        onClick={() =>
          alert(
            localize(
              "Pour ajouter un livre, envoyez un e-mail à " +
                import.meta.env.VITE_PUBLIC_EMAIL +
                "",
              "To add a book, send an email to" +
                import.meta.env.VITE_PUBLIC_EMAIL +
                "",
            ),
          )
        }
      >
        <PlusCircledIcon />
        Ajouter un livre
      </Button>
    </>
  );
};
