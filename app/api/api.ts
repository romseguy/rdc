import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query";
import { baseUrl } from "./baseUrl";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    //mode: "no-cors",
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
    getCollections: build.query<any, any>({
      query: () => ({ url: "/" }),
    }),
    postNotes: build.mutation({
      query: (body) => ({ url: "/notes", method: "POST", body }),
    }),
    editNote: build.mutation({
      query: (body) => ({ url: "/note", method: "PUT", body }),
    }),
    deleteNote: build.mutation({
      query: ({ url }) => ({ url, method: "DELETE" }),
    }),
    deleteComment: build.mutation({
      query: ({ url }) => ({ url, method: "DELETE" }),
    }),
    postComments: build.mutation({
      query: (body) => ({ url: "/comments", method: "POST", body }),
    }),
  }),
});

export const {
  getCollections,
  postNotes,
  editNote,
  deleteNote,
  postComments,
  deleteComment,
} = api.endpoints;
