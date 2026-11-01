/**
 * WebSocket event and route constants for customer and queue sockets.
 */
export const QUEUE_WS_EVENTS = {
  // Client to Server
  JOIN_TICKET: "join:ticket",
  LEAVE_TICKET: "leave:ticket",

  // Server to Client
  TICKET_CALLED: "ticket:called",
  CUSTOMER_RING_TRIGGERED: "CUSTOMER_RING_TRIGGERED",
  TICKET_SEATED: "ticket:seated",
  TICKET_CANCELLED: "ticket:cancelled",
  QUEUE_POSITION_UPDATED: "queue:position-updated",
  ROOM_JOINED: "room:joined",
  ROOM_LEFT: "room:left",
  ERROR: "error",
} as const;

export const QUEUE_WS_CONFIG = {
  DEFAULT_PATH: "/ws/queues",
  TICKET_ROOM_PREFIX: "ticket:",
} as const;

export const ACTIVE_QUEUE_STORAGE_KEY = "spotq_active_customer_ticket";
