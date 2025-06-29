import { Link } from "@radix-ui/themes";
import { useSelector } from "react-redux";
import { Flex, LibTitle } from "~/components";
import { getState } from "~/store";
import { localize } from "~/utils";

export function Home(props) {
  const { loaderData } = props;
  const { lib = loaderData.lib, isMobile } = useSelector(getState);
  return (
    <div
      id="home-page"
      css={isMobile ? { padding: "12px" } : { padding: "48px" }}
    >
      {/* <Flex
        {...(isMobile
          ? {
              direction: "column",
            }
          : { ml: "6" })}
      >
        <LibTitle lib={lib} />
      </Flex> */}
      <ul>
        <li>
          <b>{localize("Auteur", "Author")} : </b>
          <Link href={lib.author_url || "#"} target="_blank">
            {lib?.author || localize("Anonyme", "Anonymous")}
          </Link>
        </li>
      </ul>
    </div>
  );
}
