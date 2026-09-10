const env = {
  apiUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:10000/api/v1",
  cdnBaseUrl: import.meta.env.VITE_CDN_BASE_URL || import.meta.env.VITE_S3_BASE_URL || "",
  staffInvitationStaleTimeMs:
    Number(import.meta.env.VITE_STAFF_INVITATION_STALE_TIME_MS) || 300_000,
} as const;

export default env;
