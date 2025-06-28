import { localize } from "~/utils";
import { BooksIcon } from "./shared";

export const LibTitle = (props) => {
  const { lib, smaller } = props;
  if (smaller)
    return (
      <>
        <BooksIcon />
        <h3>
          {/* {localize("Bibliothèque", "Library")} :{" "} */}
          <i>{lib[localize("name")] || lib.name}</i>
        </h3>
      </>
    );
  return (
    <>
      <BooksIcon />
      <h1>
        {/* {localize("Bibliothèque", "Library")} :{" "} */}
        <i>{lib[localize("name")] || lib.name}</i>
      </h1>
    </>
  );
};
