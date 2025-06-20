import { DoubleArrowRightIcon } from "@radix-ui/react-icons";
import { Flex } from "~/components";
import { localize } from "~/utils";

export function Home(props) {
  const {
    loaderData: { libs },
    isMobile,
  } = props;
  const lib = props.lib || props.loaderData.lib;
  return (
    <div
      id="home-page"
      css={isMobile ? { padding: "12px" } : { padding: "48px" }}
    >
      <Flex>
        <DoubleArrowRightIcon />
        <h1>
          {localize("Bibliothèque", "Library")} : <i>{lib[localize("name")]}</i>
        </h1>
      </Flex>
      <ul>
        <li>
          {localize("Auteur", "Author")} :{" "}
          <a href={lib.author_url || "#"} target="_blank">
            {lib?.author || localize("Anonyme", "Anonymous")}
          </a>
        </li>
      </ul>
    </div>
  );
}
