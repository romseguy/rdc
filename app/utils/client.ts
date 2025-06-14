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
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const config: RequestInit = {
        headers: client.defaults.headers.common,
        signal:
          process.env.NODE_ENV === "development"
            ? controller.signal
            : undefined,
      };
      const res = await fetch(url, config);
      if (process.env.NODE_ENV === "development") clearTimeout(timeoutId);

      const data = await res.json();
      //console.log(prefix + "data:", JSON.stringify(data));
      return { data };
    } catch (error: any) {
      console.log(prefix + "error:", error);
      return { data: { error, message: error.message } };
    }
  },
  async delete(endpoint?: string) {
    const url = endpoint ? baseUrl + endpoint : baseUrl;
    const prefix = `🚀 ~ DELETE ${url} ~ `;
    console.log(prefix);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const config: RequestInit = {
        method: "DELETE",
        headers: client.defaults.headers.common,
        signal:
          process.env.NODE_ENV === "development"
            ? controller.signal
            : undefined,
      };
      const res = await fetch(url, config);
      if (process.env.NODE_ENV === "development") clearTimeout(timeoutId);

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
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const config = {
        method: "POST",
        headers: client.defaults.headers.common,
        body: JSON.stringify(body),
        signal:
          process.env.NODE_ENV === "development"
            ? controller.signal
            : undefined,
      };
      const res = await fetch(url, config);
      if (process.env.NODE_ENV === "development") clearTimeout(timeoutId);

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
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const config = {
        method: "PUT",
        headers: client.defaults.headers.common,
        body: JSON.stringify(body),
        signal:
          process.env.NODE_ENV === "development"
            ? controller.signal
            : undefined,
      };
      const res = await fetch(url, config);

      if (process.env.NODE_ENV === "development") clearTimeout(timeoutId);
      const data = await res.json();
      //console.log(prefix + "data:", JSON.stringify(data));
      return { data };
    } catch (error: any) {
      console.log(prefix + "error:", error);
      return { data: { error, message: error.message } };
    }
  },
};
