export const QUEUE_STATUS = {
  WAITING: "WAITING",
  CALLED: "CALLED",
  SEATED: "SEATED",
  SKIPPED: "SKIPPED",
  CANCELLED: "CANCELLED",
  NO_SHOW: "NO_SHOW",
} as const;

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
  ASSIGN_TABLE: (queueEntryId: string) =>
    `queues/staff/queue/${encodeURIComponent(queueEntryId)}/assign-tables`,
  CUSTOMER_STATUS: (restaurantId: string, queueEntryId: string) =>
    `queues/customer/restaurants/${encodeURIComponent(restaurantId)}/queue/status?queueEntryId=${encodeURIComponent(queueEntryId)}`,
  LEAVE_QUEUE: (restaurantId: string) =>
    `queues/customer/restaurants/${encodeURIComponent(restaurantId)}/queue/leave`,
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
  ASSIGN_TABLE_SUCCESS: "Tables assigned and party seated successfully",
  ASSIGN_TABLE_FAILED: "Failed to assign tables. Please try again.",
  INSUFFICIENT_CAPACITY: (partySize: number, selectedSeats: number) =>
    `Selected table capacity (${selectedSeats}) is less than party size (${partySize}).`,
  SELECT_TABLE_REQUIRED: "Please select at least one table to assign.",
  LEAVE_SUCCESS: "You have left the queue successfully.",
  LEAVE_FAILED: "Failed to leave the queue. Please try again.",
} as const;

export const PARTY_SIZE_PRESETS = [1, 2, 3, 4, 5, "6+"] as const;

export const PARTY_SIZE_LIMITS = {
  MIN: 1,
  MIN_CUSTOM: 6,
  MAX: 20,
} as const;

export const MIN_CUSTOM_PARTY_SIZE = PARTY_SIZE_LIMITS.MIN_CUSTOM;
export const MAX_PARTY_SIZE = PARTY_SIZE_LIMITS.MAX;

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
