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
