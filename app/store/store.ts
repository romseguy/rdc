import {
  combineReducers,
  configureStore,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { persistReducer, persistStore, type Persistor } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { api } from "~/api";
// const serverStorage = {
//   getItem: async () => null,
//   setItem: async () => {},
//   removeItem: async () => {},
// };

const reducer = (i) => {
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
    // app: persistReducer(
    //   {
    //     key: "app",
    //     storage: typeof window === "undefined" ? serverStorage : storage,
    //   },
    app,
    api: api.reducer,
    // api: persistReducer(
    //   {
    //     key: "api",
    //     storage: typeof window === "undefined" ? serverStorage : storage,
    //   },
    //   api.reducer,
    // ),
  });
};
const middleware = (getDefaultMiddleware) => {
  return getDefaultMiddleware({ serializableCheck: false }).concat([
    api.middleware,
  ]);
};
const makeStore = (i) => {
  console.log("MARKING NEW STORE WITH", i);
  return configureStore({
    reducer: reducer(i),
    middleware,
    preloadedState: { app: i },
  });
};

export let store;
//let persistor;
export const createStore: (i?: any) => {
  store: AppStore;
  //persistor: Persistor;
} = (i) => {
  store = store || makeStore(i);
  //persistor = persistor || persistStore(store);
  //return { store, persistor };
  return { store };
};
export const getState = (state) => {
  return state.app;
};
export const setState = (payload) => ({ type: "app/setState", payload });
export type AppStore = ReturnType<typeof configureStore<any>>;
