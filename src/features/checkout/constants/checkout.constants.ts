export const CHECKOUT_ENDPOINTS = {
  GET_CHECKOUT: "orders/checkout",
  PLACE_ORDER: "orders",
  VERIFY_PAYMENT: "payments/orders/verify",
} as const;

export const CHECKOUT_PRICING = {
  PLATFORM_FEE: 0, // ₹0 Platform Fee
  GST_RATE: 0.05, // 5% GST
} as const;
