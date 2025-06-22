import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query";
import { RootSlice } from "~/store";

const endpoints = (build) => ({
  root: build.query({
    query: () => ({ url: "/" }),
  }),
});

const config = () => {
  const baseQuery = fetchBaseQuery({
    mode: "no-cors",
    baseUrl: import.meta.env.VITE_PUBLIC_API || "http://localhost:3001/api",
    prepareHeaders: (headers, api) => {
      const { getState } = api as any;
      const root: RootSlice = getState().root;
      const { authToken } = root;
      if (authToken) {
        headers.set("at", authToken.access_token);
        headers.set("rt", authToken.refresh_token);
      }
      return headers;
    },
  });

  return {
    baseQuery,
  };
};

export const api = createApi({
  ...config(),
  endpoints,
});
