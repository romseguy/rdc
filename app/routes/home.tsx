import type { Route } from "./+types/home";
import "~/screens/App.scss";
import { App } from "~/screens/App";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return <App />;
}
