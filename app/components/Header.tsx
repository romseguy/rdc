import { css } from "@emotion/react";
import { DoubleArrowRightIcon } from "@radix-ui/react-icons";
import { Select } from "@radix-ui/themes";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { Flex } from "~/components";
import { getState, setState } from "~/store";
import { localize } from "~/utils";
import { BookTitle } from "./BookTitle";

export const Header = (props) => {
  const { loaderData } = props;
  const { isMobile, lib = loaderData.lib } = useSelector(getState);
  const navigate = useNavigate();

  return (
    <Flex direction="column" gap="3" {...(isMobile ? { align: "start" } : {})}>
      <Flex width="100%" pl="1">
        <DoubleArrowRightIcon />
        <h3>
          {localize("Bibliothèque", "Library")} :{" "}
          <i>{lib[localize("name")] || lib.name}</i>
        </h3>
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
              <Link to={to}>{b[localize("title")] || b.title}</Link>
            </div>
          );
        })}
      </Flex>
    </Flex>
  );
};
