import ky from "ky";

const API_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_URL) {
  throw new Error("VITE_API_URL is not configured.");
}

export const apiClient = ky.create({
  baseUrl: API_URL,
  timeout: 10_000,
  retry: {
    limit: 2,
    methods: ["get", "head", "options"],
    statusCodes: [408, 429, 500, 502, 503, 504],
  },
  headers: {
    Accept: "application/json",
  },
});
