const env = {
  apiUrl: import.meta.env.VITE_API_BASE_URL,
  staffInvitationStaleTimeMs:
    Number(import.meta.env.VITE_STAFF_INVITATION_STALE_TIME_MS) || 300_000,
} as const;

if (!env.apiUrl) {
  throw new Error("VITE_API_BASE_URL is not configured");
}

export default env;
