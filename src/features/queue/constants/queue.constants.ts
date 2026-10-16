export const QUEUE_QUERY_KEYS = {
  QUEUE: "staff-queue",
} as const;

export const QUEUE_ENDPOINTS = {
  REGISTER_WALK_IN: (restaurantId: string) =>
    `queues/staff/restaurants/${encodeURIComponent(restaurantId)}/queue/walk-in`,
} as const;

export const QUEUE_MESSAGES = {
  REGISTER_SUCCESS: "Walk-in guest successfully registered to queue",
  REGISTER_FAILED: "Failed to register walk-in guest. Please try again.",
  NO_RESTAURANT: "Staff restaurant identity could not be resolved.",
} as const;

export const PARTY_SIZE_PRESETS = [1, 2, 3, 4, 5, "6+"] as const;
