import {
  combineReducers,
  configureStore,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { api } from "~/api";

const reducer = (i) => {
  const app = (state = i, action: PayloadAction<any>) => {
    //console.log(action.type);
    if (action.type === "app/setState") {
      const newState = {
        ...state,
        ...action.payload,
      };
      console.log(action, newState);
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
  if (!store || i.noCache) store = makeStore(i);

  return { store };
};
export const getState = (state) => {
  return state.app;
};
export const setState = (payload) => ({ type: "app/setState", payload });
export type AppStore = ReturnType<typeof configureStore<any>>;
