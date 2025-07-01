import {
  buildCreateApi,
  coreModule,
  //fetchBaseQuery,
  type BaseQueryFn,
} from "@reduxjs/toolkit/query";
import { reactHooksModule } from "@reduxjs/toolkit/query/react";
//import { REHYDRATE } from "redux-persist";
import type { AxiosError, AxiosRequestConfig } from "axios";
import axios from "axios";
import { baseUrl } from "./baseUrl";
import { createStore } from "~/store";
import type { Comment } from "~/utils";

axios.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const { store } = createStore();
      config.headers.common.authorization = `Bearer ${
        store.getState().app.auth?.bearer
      }`;
    }
    config.headers.common["Access-Control-Allow-Origin"] = "*";
    return config;
  },
  (error) => Promise.reject(error),
);

axios.interceptors.response.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error),
);

const createApi = buildCreateApi(
  coreModule(),
  reactHooksModule({ unstable__sideEffectsInRender: true }),
);

const axiosBaseQuery =
  (
    { baseUrl }: { baseUrl: string } = { baseUrl: "" },
  ): BaseQueryFn<
    {
      url: string;
      method?: AxiosRequestConfig["method"];
      body?: AxiosRequestConfig["data"];
      params?: AxiosRequestConfig["params"];
      headers?: AxiosRequestConfig["headers"];
    },
    unknown,
    unknown
  > =>
  async (props) => {
    const { url, method, body, params, headers } = props;
    try {
      const result = await axios({
        url: `${baseUrl}${url !== "/" ? url : ""}`,
        method,
        data: body,
        params,
        headers,
        timeout: 5000,
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
          error: err.toJSON(),
        },
      };
    }
  };

export const api = createApi({
  baseQuery: axiosBaseQuery({
    baseUrl,
  }),
  endpoints: (build) => ({
    getCollections: build.query({
      query: () => {
        console.log("GET /");
        return { url: "/" };
      },
    }),
    postIp: build.mutation({
      query: (body) => ({ url: "/", method: "POST", body }),
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
  postIp,
  postNotes,
  editNote,
  deleteNote,
  postComments,
  deleteComment,
} = api.endpoints;

// baseQuery: fetchBaseQuery({
//   mode: "no-cors",
//   baseUrl,
//   prepareHeaders: (headers, api: { getState: () => any }) => {
//     const auth = api.getState().app.auth;
//     if (auth) {
//       headers.set("authorization", `Bearer ${auth.bearer}`);
//     }
//     headers.set("locale", import.meta.env.VITE_PUBLIC_LOCALE);
//     return headers;
//   },
// }),
// extractRehydrationInfo(action): any {
//   if (action.type === REHYDRATE && action.key === "api") return action.payload
// },
