import {
  combineReducers,
  configureStore,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { api } from "~/api";

export type AppStore = ReturnType<typeof configureStore<{ data: any }>>;

export const getState = (state) => {
  return state.app;
};

export const setState = (payload) => ({ type: "app/setState", payload });

let cachedStore;

export const store: (preloadedState?: any) => AppStore = (
  preloadedState = { modal: { isOpen: false } },
) => {
  if (!cachedStore) {
    cachedStore = configureStore({
      reducer: combineReducers({
        app: (state = preloadedState, action: PayloadAction<any>) => {
          if (action.type === "app/setState") {
            const newState = { ...state, ...action.payload };
            console.log(action, newState);
            return newState;
          }
          return state;
        },
        api: api.reducer,
      }),
      middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware({ serializableCheck: false }).concat([
          api.middleware,
        ]);
      },
      preloadedState: { app: preloadedState },
    });
  }

  return cachedStore;
};
