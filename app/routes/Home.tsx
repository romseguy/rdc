import { useState } from "react";
import { type Lib } from "~/utils";

export function Home({ ...props }) {
  const lib = props.lib || props.loaderData.lib;

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
