import ky from "ky";
import { afterResponse } from "./hooks/afterResponse";
import { beforeError } from "./hooks/beforeError";
import { beforeRequest } from "./hooks/beforeRequest";
import { beforeRetry } from "./hooks/beforeRetry";

const rawApiUrl = import.meta.env.VITE_API_BASE_URL;

if (!rawApiUrl) {
  throw new Error("VITE_API_BASE_URL is not configured.");
}

const API_URL = /^\d+$/.test(rawApiUrl) ? `http://localhost:${rawApiUrl}` : rawApiUrl;

export const apiClient = ky.create({
  baseUrl: API_URL,
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
