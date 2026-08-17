const env = {
  apiUrl: import.meta.env.VITE_API_BASE_URL,
} as const;

if (!env.apiUrl) {
  throw new Error("VITE_API_BASE_URL is not configured");
}

export default env;