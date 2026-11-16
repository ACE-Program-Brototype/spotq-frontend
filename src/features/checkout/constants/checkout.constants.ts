export const CHECKOUT_ENDPOINTS = {
  GET_CHECKOUT: "orders/checkout",
  PLACE_ORDER: "orders",
  VERIFY_PAYMENT: "payments/orders/verify",
} as const;

export const CHECKOUT_VIEW_STATUS = {
  CHECKOUT: "CHECKOUT",
  SUCCESS: "SUCCESS",
  FAILURE: "FAILURE",
} as const;

export type CheckoutViewStatus = (typeof CHECKOUT_VIEW_STATUS)[keyof typeof CHECKOUT_VIEW_STATUS];

export const CHECKOUT_PAYMENT_STATUS = {
  CAPTURED: "CAPTURED",
  FAILED: "FAILED",
} as const;

export const RAZORPAY_CONFIG = {
  BRAND_NAME: "SpotQ",
  THEME_COLOR: "#ff6b00",
  EVENT_PAYMENT_FAILED: "payment.failed",
} as const;

export const ORDER_PAYMENT_STATUS = {
  PAID: "PAID",
  PENDING: "PENDING",
  FAILED: "FAILED",
} as const;

export const ORDER_STATUS = {
  CONFIRMED: "CONFIRMED",
  PENDING: "PENDING",
  CANCELLED: "CANCELLED",
} as const;

export const PHONE_REGEX = /^\+?[0-9\s-]{7,20}$/;

export const CHECKOUT_MESSAGES = {
  PHONE_INVALID: "Please enter a valid mobile number (7-20 digits)",
  GATEWAY_LOAD_ERROR:
    "Unable to load Razorpay payment gateway. Please check your internet connection.",
  ORDER_DESCRIPTION: (orderNumber: string) => `Order ${orderNumber}`,
  PAYMENT_CAPTURE_FAILED: "Payment capture failed or was declined by the bank.",
  PAYMENT_VERIFIED_SUCCESS: "Payment verified! Order confirmed.",
  PAYMENT_VERIFICATION_FAILED: "Payment verification failed",
  PAYMENT_CANCELLED: "Payment was cancelled or closed",
  GATEWAY_PAYMENT_FAILED: "Payment failed via gateway",
  GATEWAY_INITIATION_FAILED: "Failed to initiate payment gateway",
} as const;
