import type { ThemeOwnProps } from "@radix-ui/themes/components/theme.props";
import { isbot } from "isbot";
import {
  getSelectorsByUserAgent,
  useDeviceSelectors,
} from "react-device-detect";
import { Provider } from "react-redux";
import { api, getCollections } from "~/api";
import { Sitemap } from "~/components";
import { Home } from "~/routes/Home";
import { createStore } from "~/store";
import {
  length,
  collections as offlineCollections,
  type Lib,
  type RootData,
  type Seed,
} from "~/utils";
import type { Route } from "../+types/root";
import Page from "./Page";

const cookies = (request) => {
  let cookies = {};

  if (request.headers && request.headers.get("cookie"))
    request.headers
      .get("cookie")
      .split(";")
      .forEach(function (cookie) {
        const parts = cookie.match(/(.*?)=(.*)$/);
        cookies[parts[1].trim()] = (parts[2] || "").trim();
      });

  return cookies;
};

export const loader = async (props: Route.LoaderArgs) => {
  const cookie = cookies(props.request)["color-mode"];
  const appearance = cookie || "dark";
  const userAgent = props.request.headers.get("user-agent") || "";

  let data: RootData = {
    collections: offlineCollections,
    appearance: appearance as ThemeOwnProps["appearance"],
    libs: [],
    userAgent,
  };

  const { isMobile } = getSelectorsByUserAgent(userAgent);
  const { store } = createStore({ app: { appearance, isMobile } }, true, false);
  const { isSuccess, data: collections } = await store.dispatch(
    getCollections.initiate(""),
  );
  await Promise.all(store.dispatch(api.util.getRunningQueriesThunk()));

  if (isSuccess && length(collections.libraries) > 0) {
    data.collections = collections;
    data.libs = collections.libraries.map((lib) => {
      return {
        ...lib,
        books: collections.books
          .filter((book) => book.library_id === lib.id)
          .map((book) => {
            return {
              ...book,
              notes: collections.notes
                ?.filter((note) => note.book_id === book.id)
                .map((note) => {
                  return {
                    ...note,
                    comments: collections.comments.filter(
                      (comment) => comment.note_id === note.id,
                    ),
                  };
                }),
            };
          }),
      };
    });
  } else {
    data.libs = data.collections.libraries.map((lib, i) => {
      const id = Number(i + 1).toString();
      return {
        ...lib,
        id,
        books: lib.books?.map((book, j) => {
          const bookId = `${id}${j + 1}`;
          return {
            ...book,
            id: bookId,
            index: j,
            src: undefined,
            notes: book.notes?.map((note, k) => ({
              ...note,
              id: Number(k + 1).toString(),
              book_id: bookId,
              comments: note.comments?.filter(
                (comment) => comment.note_id === note.id,
              ),
            })),
          };
        }),
      };
    });
  }

  data.lib = data.libs[0] as Seed | Lib;

  return data;
};

export default function IndexRoute(props) {
  const {
    loaderData: { collections, libs, lib, appearance, userAgent },
  } = props;
  const [{ isMobile }] = useDeviceSelectors(userAgent);
  const { store } = createStore(
    {
      app: {
        collections,
        libs,
        lib,

        appearance,
        isMobile,
      },
    },
    false,
    true,
  );

  const App = isbot() ? (
    <Sitemap {...props} />
  ) : (
    <Page element={Home} {...props} />
  );

  return <Provider store={store}>{App}</Provider>;
}
