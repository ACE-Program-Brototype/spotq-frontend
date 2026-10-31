export const QUEUE_QUERY_KEYS = {
  QUEUE: "staff-queue",
} as const;

export const QUEUE_ENDPOINTS = {
  REGISTER_WALK_IN: (restaurantId: string) =>
    `queues/staff/restaurants/${encodeURIComponent(restaurantId)}/queue/walk-in`,
  SEAT_PARTY: (restaurantId: string, queueEntryId: string) =>
    `queues/staff/restaurants/${encodeURIComponent(restaurantId)}/queue/${encodeURIComponent(queueEntryId)}/seat`,
  SKIP_PARTY: (restaurantId: string, queueEntryId: string) =>
    `queues/staff/restaurants/${encodeURIComponent(restaurantId)}/queue/${encodeURIComponent(queueEntryId)}/skip`,
  CANCEL_QUEUE_ENTRY: (restaurantId: string, queueEntryId: string) =>
    `queues/staff/restaurants/${encodeURIComponent(restaurantId)}/queue/${encodeURIComponent(queueEntryId)}/cancel`,
} as const;

export const QUEUE_MESSAGES = {
  REGISTER_SUCCESS: "Walk-in guest successfully registered to queue",
  REGISTER_FAILED: "Failed to register walk-in guest. Please try again.",
  NO_RESTAURANT: "Staff restaurant identity could not be resolved.",
  SEAT_SUCCESS: "Party seated successfully",
  SEAT_FAILED: "Failed to seat party. Please try again.",
  SKIP_SUCCESS: "Party skipped successfully",
  SKIP_FAILED: "Failed to skip party. Please try again.",
  CANCEL_SUCCESS: "Queue entry cancelled successfully",
  NO_SHOW_SUCCESS: "Queue entry marked as no-show",
  CANCEL_FAILED: "Failed to process queue cancellation. Please try again.",
} as const;

export const PARTY_SIZE_PRESETS = [1, 2, 3, 4, 5, "6+"] as const;
