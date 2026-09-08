const env = {
  apiUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:10000/api/v1",
} as const;

export default env;
