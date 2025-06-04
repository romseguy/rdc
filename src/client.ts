import axios from "axios";
import https from "https";

const agent = new https.Agent({
  rejectUnauthorized: false,
  requestCert: false,
});

export const client = axios.create({
  responseType: "json",
  withCredentials: false,
  httpsAgent: agent,
  timeout: 60000,
});

export const prefix =
  import.meta.env.VITE_PUBLIC_API || "http://localhost:3001/api";
