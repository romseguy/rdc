import { css } from "@emotion/react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { Book1Icon, Flex, LibTitle } from "~/components";
import { getState } from "~/store";
import { localize } from "~/utils";
import { BookTitle } from "./BookTitle";
import { Box, IconButton } from "@radix-ui/themes";
import { DoubleArrowRightIcon, PlusCircledIcon } from "@radix-ui/react-icons";

export const PageHeader = (props) => {
  const { loaderData } = props;
  const { isMobile, lib = loaderData.lib } = useSelector(getState);
  const navigate = useNavigate();

  return (
    <div id="page-header">
      {!isMobile && (
        <Box ml="1">
          <h1 className="text-lg">
            <Flex>
              <DoubleArrowRightIcon />
              {localize("Votre sélection", "Your selection")} :
            </Flex>
          </h1>
          <Flex>
            <LibTitle lib={lib} />
          </Flex>
        </Box>
      )}

      {!isMobile && loaderData.book && (
        <Flex ml="2" mb="3">
          <BookTitle lib={lib} book={loaderData.book} />
        </Flex>
      )}

      {/* books list */}
      <Flex gap="0" overflowX="scroll">
        {lib.books?.map((b, index) => {
          const to = "/" + localize("livre", "book") + "/" + b.id;
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
              onClick={() => {
                navigate(to);
              }}
            >
              <Flex direction="column">
                <Book1Icon width={b.src ? "20em" : "50em"} />
                <Link to={to}>{b[localize("title")] || b.title}</Link>
              </Flex>
            </div>
          );
        })}
      </Flex>
    </div>
  );
};
