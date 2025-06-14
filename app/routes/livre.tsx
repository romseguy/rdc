import type { Route } from "./+types/home";
import { Page, loader as PageLoader } from "./Page";

export async function loader({ ...props }) {
  //console.log("🚀 ~ /livre loader :", props);
  let loaderData = await PageLoader(props);

  const bookId = props.params.id;

  for (const lib of loaderData.libs) {
    for (const b of lib.books || []) {
      if (b.id === bookId) {
        console.log("🚀 ~ loader ~ found book:", b);
        loaderData.book = b;
      }
    }
  }

  loaderData.lib =
    loaderData.libs.find((lib) => lib.id === loaderData.book.library_id) ||
    loaderData.lib;

  return loaderData;
}

import { Livre } from "./Livre";
export default function LivreRoute({ ...props }) {
  return <Page element={Livre} {...props} />;
}
