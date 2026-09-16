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
  ALREADY_ACTIVE_REDIRECT:
    "Restaurant already has an active subscription. Redirecting to dashboard...",
  PLANS_RETRY_BUTTON: "Retry Loading Plans",
  ACTIVE_STATUS: "ACTIVE",
  DEFAULT_PRO_PLAN_CODE: "QUEUE_PRO",
} as const;

export const SUBSCRIPTION_SUCCESS_TEXTS = {
  TITLE: "Subscription Activated!",
  SUBTITLE: "Your restaurant account is now fully active with SpotQ Pro features.",
  PLAN_LABEL: "Current Plan",
  STATUS_LABEL: "Status",
  ACTIVE_BADGE: "Active",
  VALID_UNTIL_LABEL: "Valid Until",
  DASHBOARD_BUTTON: "Go to Dashboard",
  STAFF_BUTTON: "Manage Staff",
  FEATURES_TITLE: "Unlocked Features",
  DEFAULT_PLAN_NAME: "SpotQ Pro Plan",
  FEATURE_QUEUE: "Real-time queue and table management",
  FEATURE_QR: "Contactless digital QR ordering and menus",
  FEATURE_ANALYTICS: "Performance analytics and customer insights",
  FEATURE_SUPPORT: "24/7 priority onboarding and technical support",
} as const;

export const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

export const SUBSCRIPTION_FAILURE_TEXTS = {
  TITLE: "Payment Incomplete",
  SUBTITLE:
    "We could not activate your subscription at this time. If any amount was debited, it will be automatically refunded.",
  PLAN_LABEL: "Attempted Plan",
  STATUS_LABEL: "Status",
  FAILED_BADGE: "Failed",
  REASON_LABEL: "Reason",
  DEFAULT_REASON: "Payment transaction was not completed or verification failed.",
  RETRY_BUTTON: "Try Again",
  DASHBOARD_BUTTON: "Back to Plans",
  SUPPORT_NOTE:
    "If you believe this is an error or money was deducted from your account, please reach out to SpotQ support with your payment details.",
} as const;
