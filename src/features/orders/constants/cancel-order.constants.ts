/**
 * Cancel Order Constants
 * Centralized reason definitions, dialog labels, endpoints, and toast notifications.
 */

export const CANCEL_ORDER_REASONS = {
  ORDERED_BY_MISTAKE: "ORDERED_BY_MISTAKE",
  LONG_WAIT_TIME: "LONG_WAIT_TIME",
  CHANGE_ITEMS: "CHANGE_ITEMS",
  INCORRECT_TABLE_OR_ADDRESS: "INCORRECT_TABLE_OR_ADDRESS",
  OTHER: "OTHER",
} as const;

export const CANCEL_ORDER_REASON_OPTIONS = [
  {
    value: CANCEL_ORDER_REASONS.ORDERED_BY_MISTAKE,
    label: "Ordered by mistake",
  },
  {
    value: CANCEL_ORDER_REASONS.LONG_WAIT_TIME,
    label: "Estimated waiting time is too long",
  },
  {
    value: CANCEL_ORDER_REASONS.CHANGE_ITEMS,
    label: "Need to change menu items or portions",
  },
  {
    value: CANCEL_ORDER_REASONS.INCORRECT_TABLE_OR_ADDRESS,
    label: "Incorrect table number / dine-in details",
  },
  {
    value: CANCEL_ORDER_REASONS.OTHER,
    label: "Other reason (please describe below)",
  },
] as const;

export const MAX_CANCELLATION_NOTE_LENGTH = 250;

export const CANCEL_ORDER_ENDPOINTS = {
  CANCEL: (orderId: string) => `orders/${orderId}/cancel`,
} as const;

export const CANCEL_ORDER_QUERY_KEYS = {
  ORDERS_ROOT: ["customer", "orders"] as const,
} as const;

export const CANCEL_ORDER_MESSAGES = {
  TRIGGER_BUTTON: "Cancel Order",
  TRIGGER_TOOLTIP_PREPARING: "Order is already being prepared and cannot be cancelled",
  TRIGGER_TOOLTIP_COMPLETED: "Completed orders cannot be cancelled",
  TRIGGER_TOOLTIP_CANCELLED: "Order is already cancelled",
  MODAL_TITLE: "Cancel Order Confirmation",
  MODAL_DESCRIPTION: "Are you sure you want to cancel this order? This action cannot be undone.",
  WARNING_TITLE: "Important Cancellation Notice",
  WARNING_BODY:
    "Once the kitchen begins preparing your order, cancellation and refunds are no longer permitted.",
  WARNING_REFUND_INFO:
    "Any applicable refunds will be credited back to your original payment method.",
  REASON_LABEL: "Please select a reason for cancellation",
  REASON_PLACEHOLDER: "Select a reason...",
  NOTE_LABEL: "Additional Details (Optional)",
  NOTE_PLACEHOLDER: "Tell us more about why you're cancelling (max 250 characters)...",
  KEEP_ORDER_BUTTON: "Keep My Order",
  CONFIRM_CANCEL_BUTTON: "Yes, Cancel Order",
  CANCELLING_BUTTON: "Cancelling Order...",

  // Toast notifications
  TOAST_SUCCESS: "Order cancelled successfully",
  TOAST_BAD_REQUEST: "Please select a valid cancellation reason",
  TOAST_GENERIC_ERROR: "An unexpected error occurred while cancelling your order.",
} as const;
