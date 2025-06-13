export const baseUrl =
  import.meta.env.VITE_PUBLIC_API || "http://localhost:3001/api";

export const client = {
  defaults: {
    headers: {
      common: {},
    },
  },
  async get(endpoint?: string) {
    const url = endpoint ? baseUrl + endpoint : baseUrl;
    const prefix = `🚀 ~ GET ${url} ~ `;
    console.log(prefix);

    try {
      const res = await fetch(url, {
        //mode: "no-cors",
        headers: client.defaults.headers.common,
      });
      const data = await res.json();
      //console.log(prefix + "data:", JSON.stringify(data));
      return { data };
    } catch (error: any) {
      console.log(prefix + "error:", error);
      return { data: { error, message: error.message } };
    }
  },
  async post(endpoint: string, body: Record<string, string>) {
    const url = endpoint === "/" ? baseUrl : baseUrl + endpoint;
    const prefix = `🚀 ~ POST ${url} ~ `;
    console.log(prefix);

    try {
      const res = await fetch(url, {
        //mode: "no-cors",
        method: "POST",
        headers: client.defaults.headers.common,
        body: JSON.stringify(body),
      });
      const data = await res.json();
      //console.log(prefix + "data:", JSON.stringify(data));
      return { data };
    } catch (error: any) {
      console.log(prefix + "error:", error);
      return { data: { error, message: error.message } };
    }
  },
  async put(endpoint: string, body: Record<string, string>) {
    const url = endpoint === "/" ? baseUrl : baseUrl + endpoint;
    const prefix = `🚀 ~ PUT ${url} ~ `;
    console.log(prefix);

    try {
      const res = await fetch(url, {
        //mode: "no-cors",
        method: "PUT",
        headers: client.defaults.headers.common,
        body: JSON.stringify(body),
      });
      const data = await res.json();
      //console.log(prefix + "data:", JSON.stringify(data));
      return { data };
    } catch (error: any) {
      console.log(prefix + "error:", error);
      return { data: { error, message: error.message } };
    }
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
