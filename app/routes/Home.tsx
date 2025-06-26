import { css } from "@emotion/react";
import { Link } from "react-router";
import { Flex } from "~/components";
import { toCssString } from "~/utils";

export function Home(props) {
  const { loaderData, isMobile } = props;

  return (
    <div
      id="home-page"
      css={css`
        ${toCssString(isMobile ? { padding: "12px" } : { padding: "48px" })}
        h1 {
          text-align: center;
        }
      `}
    >
      <h1>Home</h1>
      <Flex direction="column">
        <Link to="stuff">stuff</Link>
        <Link to="stuff/someId">someStuff</Link>
      </Flex>
    </div>
  );
}
