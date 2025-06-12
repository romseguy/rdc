import axios, { AxiosRequestConfig } from "axios";
import https from "https";

const agent = new https.Agent({
  rejectUnauthorized: false,
  requestCert: false,
});

export const config: AxiosRequestConfig = {
  responseType: "json",
  withCredentials: false,
  httpsAgent: agent,
  timeout: 60000,
};

export const client = axios.create(config);
client.interceptors.request.use(
  function (config) {
    console.log("🚀 ~ request :", config);
    return config;
  },
  function (error) {
    console.log("🚀 ~ request ~ error:", error);
    return Promise.reject(error);
  },
);
client.interceptors.response.use(
  function (config) {
    console.log("🚀 ~ response :", config);
    return config;
  },
  function (error) {
    console.log("🚀 ~ response ~ error:", error);
    return Promise.reject(error);
  },
);

export const prefix =
  import.meta.env.VITE_PUBLIC_API || "http://localhost:3001/api";
