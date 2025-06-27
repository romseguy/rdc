import { Outlet, useLocation } from "react-router";
import { Provider } from "react-redux";
import { store as createStore } from "./store";
import { tokenKey } from "./lib/supabase/tokenKey";

let cachedStore;

export const App = (props) => {
  // let bearer: string | null = "";
  // if (typeof window !== "undefined") {
  //   if (localStorage.getItem(tokenKey)) {
  //     bearer = localStorage.getItem(tokenKey);
  //   } else if (process.env.NODE_ENV === "development") {
  //     bearer = import.meta.env.VITE_PUBLIC_AUTH_TOKEN;
  //   }
  //   if (bearer) {
  //     localStorage.setItem(tokenKey, bearer);
  //   }
  // }
  // const { user, ...token } = bearer ? JSON.parse(bearer) : {};

  // const location = useLocation();
  // const locale =
  //   location.pathname.includes("/c/") || location.pathname.includes("/livre/")
  //     ? "fr"
  //     : location.pathname.includes("/q/") ||
  //       location.pathname.includes("/book/")
  //     ? "en"
  //     : import.meta.env.VITE_PUBLIC_LOCALE;

  // if (!cachedStore) {
  //   console.log(
  //     "Creating store on ",
  //     typeof window === "undefined" ? "server" : "client",
  //   );
  //   cachedStore = createStore({
  //     app: {
  //       // auth: {
  //       //   bearer,
  //       //   token,
  //       //   user,
  //       // },
  //       //isMobile,
  //       locale: "en",
  //       modal: { isOpen: false },
  //     },
  //   });
  // } else {
  // }
  // console.log("🚀 ~ App ~ cachedStore:", cachedStore.getState());

  return <Outlet />;
  // return (
  //   <Provider store={cachedStore}>
  //     <Outlet />
  //   </Provider>
  // );
};
