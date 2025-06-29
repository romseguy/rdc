import { ChatBubbleIcon } from "@radix-ui/react-icons";
import { Book1Icon, BookIcon, Flex } from "~/components";
import { localize } from "~/utils";

export const BookTitle = ({ lib, book }) => {
  return (
    <>
      {book.title && (
        <Flex>
          {book.is_conf ? (
            <>
              <ChatBubbleIcon width={30} height={30} />
              {localize("Conférence", "Talk show")}
              <span> : </span>
            </>
          ) : (
            <>
              <Book1Icon />
              {/* {localize("Livre", "Book")} */}
            </>
          )}

          {book.title && <i>{book[localize("title")] || book.title}</i>}
        </Flex>
      )}

      {!book.title && (
        <Flex>
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
          {localize("de la bibliothèque", "in the library")} :<span> </span>
          <i>{lib[localize("name")] || lib.name}</i>
        </Flex>
      )}
    </>
  );
};
