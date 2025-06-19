import { localize } from "~/utils";

export function Home(props) {
  const {
    loaderData: { libs },
    isMobile,
  } = props;
  const lib = props.lib || props.loaderData.lib;
  return (
    <div id="home-page" css={isMobile ? {} : { padding: "48px" }}>
      <h1>
        {localize("Bibliothèque", "Library")} : <i>{lib[localize("name")]}</i>
      </h1>
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
