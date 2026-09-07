export const SUBSCRIPTION_ENDPOINTS = {
  PLANS: "payments/plans",
  CREATE_ORDER: "payments/subscriptions/order",
  VERIFY_PAYMENT: "payments/subscriptions/verify",
  STATUS: "payments/subscriptions/status",
  RESTAURANT_STATUS: "restaurants/me/status",
} as const;

export const SUBSCRIPTION_MESSAGES = {
  FETCH_PLANS_ERROR: "Failed to load subscription plans. Please refresh.",
  ORDER_CREATION_FAILED: "Failed to initiate subscription order. Please try again.",
  PAYMENT_VERIFIED_SUCCESS: "Subscription activated successfully! Welcome to SpotQ Pro.",
  PAYMENT_VERIFY_FAILED:
    "Payment verification failed. If money was debited, please contact support.",
  PAYMENT_CANCELLED: "Payment window closed without completing payment.",
  SCRIPT_LOAD_ERROR: "Failed to load payment gateway. Please check your internet connection.",
} as const;

export const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";
