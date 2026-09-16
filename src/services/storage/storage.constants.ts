export const STORAGE_ENDPOINTS = {
  PRESIGNED_URL: "storage/presigned-url",
} as const;

export const STORAGE_DEFAULTS = {
  PRESIGNED_URL_STALE_TIME_MS: 1000 * 60 * 15, // 15 minutes cache
} as const;

export const STORAGE_QUERY_KEYS = {
  PRESIGNED_URL: (key?: string | null) => ["storage", "presigned-url", key] as const,
} as const;
