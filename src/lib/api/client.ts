import ky from "ky";
import { afterResponse } from "./hooks/afterResponse";
import { beforeError } from "./hooks/beforeError";
import { beforeRequest } from "./hooks/beforeRequest";
import { beforeRetry } from "./hooks/beforeRetry";
import env from "@/config/env";


export const apiClient = ky.create({
  prefix: env.apiUrl,
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
