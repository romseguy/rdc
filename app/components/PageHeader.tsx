import { css } from "@emotion/react";
import { Box } from "@radix-ui/themes";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { Book1Icon, bookTitle, Flex, LibTitle } from "~/components";
import { getState } from "~/store";
import { localize } from "~/utils";

export const PageHeader = (props) => {
  const { isMobile, book, lib } = useSelector(getState);
  const navigate = useNavigate();

  return (
    <div id="page-header">
      {!isMobile && (
        <Box ml="1">
          <Flex>
            <LibTitle lib={lib} />
          </Flex>
        </Box>
      )}

      {/* books list */}
      <Flex gap="0" overflowX="scroll">
        {lib.books?.map((b, index) => {
          const to = "/" + localize("livre", "book") + "/" + b.id;
          return (
            <div
              key={"book-" + index}
              className="book"
              css={css`
                ${b.src && "background: url(" + b.src + ");"}
                border: ${b.id === book?.id
                  ? "1px solid yellow"
                  : "1px solid white"};
              `}
              onClick={() => {
                navigate(to);
              }}
            >
              {!b.src && (
                <Flex direction="column">
                  <Book1Icon />
                  <Link to={to}>
                    {b.title ? b[localize("title")] || b.title : bookTitle(b)}
                  </Link>
                </Flex>
              )}
            </div>
          );
        })}
      </Flex>
    </div>
  );
};
