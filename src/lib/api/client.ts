import ky from "ky";
import env from "@/config/env";
import { afterResponse } from "./hooks/afterResponse";
import { beforeError } from "./hooks/beforeError";
import { beforeRequest } from "./hooks/beforeRequest";
import { beforeRetry } from "./hooks/beforeRetry";

const API_URL = env?.apiUrl || import.meta.env.VITE_API_BASE_URL;

if (!API_URL) {
  throw new Error("VITE_API_BASE_URL is not configured.");
}

export const apiClient = ky.create({
  prefix: API_URL,
  timeout: 10_000,
  credentials: "include",
  retry: {
    limit: 2,
    methods: ["get", "post", "put", "patch", "delete", "head", "options"],
    statusCodes: [401, 408, 429, 500, 502, 503, 504],
  },
  headers: {
    Accept: "application/json",
  },
  hooks: {
    afterResponse: [afterResponse],
    beforeRequest: [beforeRequest],
    beforeError: [beforeError],
    beforeRetry: [beforeRetry],
  },
});
