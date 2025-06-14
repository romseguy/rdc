import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("livre/:id", "routes/livre.tsx"),
  route("note/:id", "routes/note.tsx"),
] satisfies RouteConfig;
