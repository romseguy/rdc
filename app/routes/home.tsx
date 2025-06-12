import type { Route } from "./+types/home";
import "~/screens/App.scss";
import { App } from "~/screens/App";

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

export default function Home() {
  return <App />;
}
