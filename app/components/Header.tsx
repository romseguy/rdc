import { css } from "@emotion/react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { Book1Icon, Flex, LibTitle } from "~/components";
import { getState } from "~/store";
import { localize } from "~/utils";
import { BookTitle } from "./BookTitle";

export const Header = (props) => {
  const { loaderData } = props;
  const { lib = loaderData.lib } = useSelector(getState);
  const navigate = useNavigate();

  return (
    <Flex
      direction="column"
      gap="3"
      {...(loaderData.isMobile ? { align: "start" } : {})}
    >
      <Flex width="100%" pl="1">
        <LibTitle lib={lib} />
      </Flex>

      {loaderData.book && (
        <Flex width="100%" pl="1">
          <BookTitle lib={lib} book={loaderData.book} />
        </Flex>
      )}

      {/* books list */}
      <Flex gap="0" width="100%" overflowX="scroll">
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
    </Flex>
  );
};
