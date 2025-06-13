import type { Route } from "./+types/home";
import { Page, loader } from "./Page";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Pour une nouvelle conscience | recueildecitations.fr" },
    {
      name: "description",
      content:
        "Partagez des citations de livres qui participent à l'avènement d'une nouvelle conscience",
    },
  ];
}

export { loader };

import { Home } from "./Home";
export default function HomeRoute({ ...props }) {
  // console.log("🚀 ~ HomeRoute ~ props:", props);
  return <Page element={Home} {...props} />;
}
