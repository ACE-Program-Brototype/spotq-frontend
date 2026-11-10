export const QUEUE_STATUS = {
  WAITING: "WAITING",
  SEATED: "SEATED",
  SKIPPED: "SKIPPED",
  CANCELLED: "CANCELLED",
  NO_SHOW: "NO_SHOW",
} as const;

export const QUEUE_TERMINAL_STATUSES = [
  QUEUE_STATUS.SEATED,
  QUEUE_STATUS.CANCELLED,
  QUEUE_STATUS.NO_SHOW,
] as const;

export const REGISTRATION_TYPE = {
  WALK_IN: "WALK_IN",
  ONLINE: "ONLINE",
} as const;

export const QUEUE_CANCEL_REASON = {
  NO_SHOW: "NO_SHOW",
  GUEST_CANCELLED: "GUEST_CANCELLED",
  WALK_OUT: "WALK_OUT",
  OTHER: "OTHER",
} as const;

export const QUEUE_STATUS_BADGE_VARIANTS = {
  [QUEUE_STATUS.SEATED]: "bg-emerald-50 text-emerald-700 border-emerald-200",
  [QUEUE_STATUS.SKIPPED]: "bg-amber-50 text-amber-700 border-amber-200",
  [QUEUE_STATUS.WAITING]: "bg-blue-50 text-blue-700 border-blue-200",
  WAITING_RINGING: "bg-amber-50 text-amber-700 border-amber-200",
  DEFAULT: "bg-neutral-100 text-neutral-600 border-neutral-200",
} as const;

export function getQueueStatusBadgeClass(
  status: (typeof QUEUE_STATUS)[keyof typeof QUEUE_STATUS] | string,
  isCalledOrRinging = false,
): string {
  if (status === QUEUE_STATUS.SEATED) return QUEUE_STATUS_BADGE_VARIANTS[QUEUE_STATUS.SEATED];
  if (status === QUEUE_STATUS.SKIPPED) return QUEUE_STATUS_BADGE_VARIANTS[QUEUE_STATUS.SKIPPED];
  if (status === QUEUE_STATUS.WAITING) {
    return isCalledOrRinging
      ? QUEUE_STATUS_BADGE_VARIANTS.WAITING_RINGING
      : QUEUE_STATUS_BADGE_VARIANTS[QUEUE_STATUS.WAITING];
  }
  return QUEUE_STATUS_BADGE_VARIANTS.DEFAULT;
}

export const STAFF_LIVE_QUEUE_CONFIG = {
  STALE_TIME_MS: 10_000,
} as const;

export const QUEUE_QUERY_KEYS = {
  QUEUE: "staff-queue",
  STAFF_LIVE_QUEUE: (restaurantId: string, filters?: Record<string, unknown>) =>
    ["staff-queue", restaurantId, filters ?? {}] as const,
  CUSTOMER_ETA: (restaurantId: string, partySize: number) =>
    ["queue", "eta", restaurantId, partySize] as const,
} as const;

export const QUEUE_ENDPOINTS = {
  STAFF_LIVE_QUEUE: (restaurantId: string) =>
    `queues/staff/restaurants/${encodeURIComponent(restaurantId)}`,
  REGISTER_WALK_IN: (restaurantId: string) =>
    `queues/staff/restaurants/${encodeURIComponent(restaurantId)}/queue/walk-in`,
  GET_ETA: (restaurantId: string) => `queues/customer/${encodeURIComponent(restaurantId)}/eta`,
  JOIN_QUEUE: (restaurantId: string) =>
    `queues/customer/restaurants/${encodeURIComponent(restaurantId)}/queue/join`,
  ASSIGN_TABLE: (queueEntryId: string) =>
    `queues/staff/queue/${encodeURIComponent(queueEntryId)}/assign-tables`,
  RING_CUSTOMER: (queueEntryId: string) =>
    `queues/staff/queue/${encodeURIComponent(queueEntryId)}/ring`,
  SKIP_PARTY: (restaurantId: string, queueEntryId: string) =>
    `queues/staff/restaurants/${encodeURIComponent(restaurantId)}/queue/${encodeURIComponent(queueEntryId)}/skip`,
  CANCEL_QUEUE_ENTRY: (restaurantId: string, queueEntryId: string) =>
    `queues/staff/restaurants/${encodeURIComponent(restaurantId)}/queue/${encodeURIComponent(queueEntryId)}/cancel`,
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
  RING_SUCCESS: "Customer has been notified that table is ready",
  RING_FAILED: "Failed to ring customer. Please try again.",
  SKIP_SUCCESS: "Queue entry skipped successfully",
  SKIP_FAILED: "Failed to skip queue entry. Please try again.",
  CANCEL_SUCCESS: "Queue entry cancelled successfully",
  NO_SHOW_SUCCESS: "Queue entry marked as no-show successfully",
  CANCEL_FAILED: "Failed to update queue entry status. Please try again.",
  FETCH_QUEUE_FAILED: "Unable to load live queue. Please refresh.",
} as const;

export const PARTY_SIZE_BUCKET = {
  ALL: "ALL",
  SMALL: "SMALL",
  MEDIUM: "MEDIUM",
  LARGE: "LARGE",
} as const;

export const PARTY_SIZE_BUCKET_LABELS = {
  [PARTY_SIZE_BUCKET.ALL]: "All Sizes",
  [PARTY_SIZE_BUCKET.SMALL]: "Small (1-2)",
  [PARTY_SIZE_BUCKET.MEDIUM]: "Medium (3-4)",
  [PARTY_SIZE_BUCKET.LARGE]: "Large (5+)",
} as const;

export const REGISTRATION_TYPE_FILTER = {
  ALL: "ALL",
  ONLINE: "ONLINE",
  WALK_IN: "WALK_IN",
} as const;

export const QUEUE_CANCEL_REASONS = [
  { value: QUEUE_CANCEL_REASON.NO_SHOW, label: "No-Show (Unresponsive)" },
  { value: QUEUE_CANCEL_REASON.GUEST_CANCELLED, label: "Guest Cancelled" },
  { value: QUEUE_CANCEL_REASON.WALK_OUT, label: "Walked Out" },
  { value: QUEUE_CANCEL_REASON.OTHER, label: "Other Reason" },
] as const;

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
