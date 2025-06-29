import {
  combineReducers,
  configureStore,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { api } from "~/api";
import type { ModalProps, ToastProps } from "~/components";
import type { Collections, Lib } from "~/utils";

const reducer = (i) => {
  console.log("🚀 ~ reducer ~ i:", i);
  const app = (state = i, action: PayloadAction<any>) => {
    //console.log(action.type);
    if (action.type === "app/setState") {
      const newState = {
        ...state,
        ...action.payload,
      };
      //console.log(action, newState);
      return newState;
    }
    return state;
  };
  return combineReducers({
    app,
    api: api.reducer,
  });
};
const middleware = (getDefaultMiddleware) => {
  return getDefaultMiddleware({ serializableCheck: false }).concat([
    api.middleware,
  ]);
};
const makeStore = (i) => {
  return configureStore({
    reducer: reducer(i),
    middleware,
    preloadedState: { app: i },
  });
};

export let store;
export const createStore: (i?: any) => {
  store: AppStore;
} = (i) => {
  const noCache = (i || {}).noCache;
  if (!store || (typeof noCache === "boolean" && i.noCache))
    store = makeStore(i);

  return { store };
};
export const getState = (state) => {
  return state.app as {
    appearance: string;
    auth: any;
    collections: Collections;
    isMobile: boolean;
    isLoaded: boolean;
    locale: string;
    libs: Lib[];
    lib: Lib;
    modal: ModalProps;
    screenWidth: number;
    toast: ToastProps;
  };
};
export const setState = (payload) => ({ type: "app/setState", payload });
export type AppStore = ReturnType<typeof configureStore<any>>;
