import { ChatBubbleIcon } from "@radix-ui/react-icons";
import { BookIcon, Flex } from "~/components";
import { localize } from "~/utils";

export const BookTitle = ({ lib, book }) => {
  return (
    <Flex>
      {book.title && (
        <>
          {book.is_conf ? (
            <>
              <ChatBubbleIcon />
              {localize("Conférence", "Talk show")}
            </>
          ) : (
            <>
              <BookIcon />
              {localize("Livre", "Book")}
            </>
          )}
          <span> : </span>
          {book.title && <i>{book[localize("title")] || book.title}</i>}
        </>
      )}

      {!book.title && (
        <>
          {book.is_conf ? <ChatBubbleIcon /> : <BookIcon />}
          {book.index === 0
            ? localize("Premier", "First")
            : book.index === 1
            ? `${book.index + 1}${localize("ème", "nd")}`
            : book.index === 2
            ? book.index + localize("ème", "rd")
            : book.index + localize("ème", "th")}
          <span> </span>
          {book.is_conf
            ? localize("conférence", "talk show")
            : localize("livre", "book")}
          <span> </span>
          {localize("de la bibliothèque", "from the library")} :<span> </span>
          <i>{lib[localize("name")] || lib.name}</i>
        </>
      )}
    </Flex>
  );
};
