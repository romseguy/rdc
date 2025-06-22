import {
  configureStore,
  buildCreateSlice,
  asyncThunkCreator,
  Middleware,
  Action,
  PayloadAction,
} from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { api as rootApi } from "~/api";

export const createSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});

export interface RootSlice {
  authToken: { access_token: string; refresh_token: string };
  isMobile: boolean;
  locale: "fr" | "en";
  screenWidth: number;
}

const rootSlice = createSlice({
  name: "root",
  initialState: {} as RootSlice,
  reducers: (create) => ({
    setState: create.reducer<Partial<RootSlice>>((state, action) => {
      const key = Object.keys(action.payload)[0];
      return { ...state, [key]: action.payload[key] };
    }),
  }),
  selectors: { getState: (state) => state },
});
export const { getState } = rootSlice.selectors;
export const { setState } = rootSlice.actions;

const reducer = {
  root: rootSlice.reducer,
  api: rootApi.reducer,
};
const m: Middleware = (api) => (next) => {
  return (action: PayloadAction<Partial<RootSlice>, any>) => {
    if (action.type !== "__rtkq/unfocused") {
      let state = { ...api.getState().root };
      if (action.type === "root/setState" && action.payload) {
        const key = Object.keys(action.payload)[0];
        state[key] = action.payload[key];
        console.log("🚀 ~", action, state);
      } else console.log("🚀 ~", action, api.getState());
    }
    return next(action);
  };
};
export const makeStore = (preloadedState) => {
  const store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware({ serializableCheck: false }).concat([
        rootApi.middleware,
        m,
      ]);
    },
    preloadedState,
  });

  let initialized = false;
  setupListeners(
    store.dispatch,
    (dispatch, { onFocus, onFocusLost, onOnline, onOffline }) => {
      const handleFocus = () => dispatch(onFocus());
      const handleFocusLost = () => dispatch(onFocusLost());
      const handleOnline = () => dispatch(onOnline());
      const handleOffline = () => dispatch(onOffline());
      const handleVisibilityChange = () => {
        if (window.document.visibilityState === "visible") {
          handleFocus();
        } else {
          handleFocusLost();
        }
      };

      if (!initialized) {
        if (typeof window !== "undefined" && window.addEventListener) {
          // Handle focus events
          window.addEventListener(
            "visibilitychange",
            handleVisibilityChange,
            false,
          );
          window.addEventListener("focus", handleFocus, false);

          // Handle connection events
          window.addEventListener("online", handleOnline, false);
          window.addEventListener("offline", handleOffline, false);
          initialized = true;
        }
      }
      const unsubscribe = () => {
        window.removeEventListener("focus", handleFocus);
        window.removeEventListener("visibilitychange", handleVisibilityChange);
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
        initialized = false;
      };
      return unsubscribe;
    },
  );
  return store;
};
export const store = (preloadedState) => makeStore(preloadedState);
export type AppStore = ReturnType<typeof store>;
export type AppDispatch = AppStore["dispatch"];
