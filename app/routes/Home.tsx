export function Home(props) {
  const {
    loaderData: { libs },
  } = props;
  const lib = props.lib || props.loaderData.lib;
  return (
    <div id="home-page">
      <h1>
        Bibliothèque : <i>{lib?.name}</i>
      </h1>
      <ul>
        <li>
          Auteur :{" "}
          <a href={lib?.author_url || "#"} target="_blank">
            {lib?.author || "Anonyme"}
          </a>
        </li>
      </ul>
    </div>
  );
}
