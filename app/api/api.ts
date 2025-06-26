import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query";
import { baseUrl } from "./baseUrl";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    mode: process.env.NODE_ENV === "development" ? "no-cors" : "cors",
    baseUrl,
    prepareHeaders: (headers, api) => {
      //@ts-expect-error
      const auth = api.getState().app.auth;
      if (auth) {
        headers.set("authorization", `Bearer ${auth.bearer}`);
      }
      headers.set("locale", import.meta.env.VITE_PUBLIC_LOCALE);
      return headers;
    },
  }),
  endpoints: (build) => ({
    getStuff: build.query<any, any>({
      query: () => ({ url: "/" }),
    }),
    postIp: build.mutation({
      query: (body) => ({ url: "/", method: "POST", body }),
    }),
    editStuff: build.mutation({
      query: (body) => ({ url: "/", method: "PUT", body }),
    }),
    deleteCollections: build.mutation({
      query: ({ url }) => ({ url, method: "DELETE" }),
    }),
  }),
});

export const { getStuff, postIp, editStuff, deleteCollections } = api.endpoints;
