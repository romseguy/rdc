import { isbot } from "isbot";
import { getStuff } from "~/api";
import { Sitemap } from "~/components";
import { Home } from "~/routes/Home";
import { store } from "~/store";
import { type RootData } from "~/utils";
import Page from "./Page";

export const loader = async (props) => {
  let data: RootData = {
    stuff: {},
    userAgent: props.request.headers.get("user-agent"),
  };

  try {
    const { data, error } = await store().dispatch(getStuff.initiate(""));

    if (data.error || error) {
    } else {
    }

    return data;
  } catch (error: any) {
    return data;
  }
};

export default function IndexRoute(props) {
  if (isbot()) return <Sitemap {...props} />;

  return <Page element={Home} {...props} />;
}
