import {
  configureStore,
  buildCreateSlice,
  asyncThunkCreator,
  PayloadAction,
} from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { api as rootApi } from "~/api";
import { ToastProps } from "~/components";
import { Lib, ModalT, User } from "~/utils";

export const createSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});

export interface AppState {
  appearance: string;
  auth: {
    user: User;
    token: { access_token: string; refresh_token: string };
    bearer: string;
  };
  collections: Record<any, any>;
  isMobile: boolean;
  lib: Lib;
  libs: Lib[];
  locale: "fr" | "en";
  modal: ModalT;
  toast: ToastProps;
  screenWidth: number;
}

const slice = createSlice({
  name: "app",
  initialState: {} as AppState,
  reducers: (create) => ({
    setState: create.reducer<Partial<AppState>>((state, action) => {
      const key = Object.keys(action.payload)[0];
      return { ...state, [key]: action.payload[key] };
    }),
  }),
  selectors: { getState: (state) => state },
});
export const { getState } = slice.selectors;
export const { setState } = slice.actions;
const reducer = {
  app: slice.reducer,
  api: rootApi.reducer,
};
const middleware = (api) => (next) => {
  return (action: PayloadAction) => {
    if (action.type !== "__rtkq/unfocused") {
      let state = { ...api.getState().app };
      if (action.type === "app/setState" && action.payload) {
        const key = Object.keys(action.payload)[0];
        state[key] = action.payload[key];
        console.log("🚀 ~", action, state);
      } //else console.log(" ~", action, api.getState());
    }
    return next(action);
  };
};
export const makeStore = (preloadedState) => {
  const store = configureStore({
    //@ts-expect-error
    reducer,
    //@ts-expect-error
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware({ serializableCheck: false }).concat([
        rootApi.middleware,
        //middleware,
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
export const store = (preloadedState?: any) => makeStore(preloadedState);
export type AppStore = ReturnType<typeof store>;
export type AppDispatch = AppStore["dispatch"];
