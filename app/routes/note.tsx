import type { Route } from "./+types/home";
import { loader as PageLoader } from "./Page";

export async function loader({ ...props }) {
  //console.log("🚀 ~ /note loader :", props);
  let loaderData = await PageLoader(props);

  const noteId = props.params.id;

  for (const lib of loaderData.libs) {
    for (const b of lib.books || []) {
      for (const n of b.notes || []) {
        if (n.id === noteId) {
          loaderData.note = n;
        }
      }
    }
  }

  for (const lib of loaderData.libs) {
    for (const b of lib.books || []) {
      if (b.id === loaderData.note.book_id) {
        loaderData.book = b;
      }
    }
  }

  return loaderData;
}

import { Note } from "./Note";
export default function NoteRoute({ ...props }) {
  return <Note {...props} />;
}
