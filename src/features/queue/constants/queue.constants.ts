export const QUEUE_QUERY_KEYS = {
  QUEUE: "staff-queue",
  CUSTOMER_ETA: (restaurantId: string, partySize: number) =>
    ["queue", "eta", restaurantId, partySize] as const,
  CUSTOMER_STATUS: (restaurantId: string, queueEntryId: string) =>
    ["queue", "status", restaurantId, queueEntryId] as const,
} as const;

export const QUEUE_ENDPOINTS = {
  REGISTER_WALK_IN: (restaurantId: string) =>
    `queues/staff/restaurants/${encodeURIComponent(restaurantId)}/queue/walk-in`,
  GET_ETA: (restaurantId: string) => `queues/customer/${encodeURIComponent(restaurantId)}/eta`,
  JOIN_QUEUE: (restaurantId: string) =>
    `queues/customer/restaurants/${encodeURIComponent(restaurantId)}/queue/join`,
} as const;

export const QUEUE_MESSAGES = {
  REGISTER_SUCCESS: "Walk-in guest successfully registered to queue",
  REGISTER_FAILED: "Failed to register walk-in guest. Please try again.",
  NO_RESTAURANT: "Staff restaurant identity could not be resolved.",
  RESTAURANT_REQUIRED: "Restaurant ID is required to join queue.",
  JOIN_SUCCESS: "You've successfully joined the queue!",
  JOIN_FAILED: "Failed to join the queue. Please try again.",
  ETA_CALCULATING: "Calculating estimated wait time...",
  ETA_UNAVAILABLE: "Live wait time currently unavailable. You can still join the line.",
} as const;

export const PARTY_SIZE_PRESETS = [1, 2, 3, 4, 5, "6+"] as const;

export const QUEUE_ETA_CONFIG = {
  DEBOUNCE_MS: 300,
  STALE_TIME_MS: 15_000,
  RETRY_COUNT: 1,
} as const;

export const COUNTRY_DIAL_CODES = [
  { code: "+91", label: "India (+91)", flag: "🇮🇳" },
  { code: "+1", label: "USA / Canada (+1)", flag: "🇺🇸" },
  { code: "+44", label: "UK (+44)", flag: "🇬🇧" },
  { code: "+971", label: "UAE (+971)", flag: "🇦🇪" },
  { code: "+65", label: "Singapore (+65)", flag: "🇸🇬" },
  { code: "+61", label: "Australia (+61)", flag: "🇦🇺" },
] as const;
