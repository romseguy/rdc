import { useState } from "react";
import { type Lib } from "~/utils";

export function Home({ ...props }) {
  // console.log("🚀 ~ Home ~ props:", props);
  const { showToast } = props;

  //#region state
  const [locale, setLocale] = useState("fr");
  const [lib, setLib] = useState<null | Lib>(props.loaderData.lib);
  //#endregion

  return (
    <div id="home-page">
      <main style={{ maxWidth: "50em", margin: "0 auto" }}>
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
      </main>
    </div>
  );
}

{
  /*

  home.tsx

    export { loader } from "./Page";
    import { Home } from "./Home";
    export default function HomeRoute({ ...props }) {
      console.log("🚀 ~ HomeRoute ~ props:", props);
      return <Page element={Home} {...props} />;
    }
*/
}
