export const prefix =
  import.meta.env.VITE_PUBLIC_API || "http://localhost:3001/api";

export const client = {
  defaults: {
    headers: {
      common: {},
    },
  },
  async get(url) {
    console.log("🚀 ~ get ~ url:", url);
    const res = await fetch(url, {
      //mode: "no-cors",
      headers: client.defaults.headers.common,
    });
    return { data: await res.json() };
  },
};

// import axios from "axios";
// import https from "https";

// const agent = new https.Agent({
//   rejectUnauthorized: false,
//   requestCert: false,
// });

// export const config: axios.AxiosRequestConfig = {
//   responseType: "json",
//   withCredentials: false,
//   httpsAgent: agent,
//   timeout: 60000,
// };

// export const client = axios.create(config);
// client.interceptors.request.use(
//   function (config) {
//     console.log("🚀 ~ request :", config);
//     return config;
//   },
//   function (error) {
//     console.log("🚀 ~ request ~ error:", error);
//     return Promise.reject(error);
//   },
// );
// client.interceptors.response.use(
//   function (config) {
//     console.log("🚀 ~ response :", config);
//     return config;
//   },
//   function (error) {
//     console.log("🚀 ~ response ~ error:", error);
//     return Promise.reject(error);
//   },
// );
