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

export const PHONE_REGEX = /^\+?[0-9\s-]{7,20}$/;

export const CHECKOUT_MESSAGES = {
  PHONE_INVALID: "Please enter a valid mobile number (7-20 digits)",
} as const;
