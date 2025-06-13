import type { Route } from "./+types/home";
import { Page, loader } from "./Page";

export { loader };

import { Note } from "./Note";
export default function NoteRoute({ ...props }) {
  return <Page element={Note} {...props} />;
}
