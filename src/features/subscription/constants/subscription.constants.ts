export const SUBSCRIPTION_ENDPOINTS = {
  PLANS: "payments/plans",
  CREATE_ORDER: "payments/subscriptions/order",
  RENEW: (subscriptionId: string) => `payments/subscriptions/${subscriptionId}/renew`,
  VERIFY_PAYMENT: "payments/subscriptions/verify",
  STATUS: "payments/subscriptions/status",
  RESTAURANT_STATUS: "restaurants/me/status",
  HISTORY: (restaurantId: string) => `payments/subscriptions/restaurants/${restaurantId}/history`,
} as const;

export const SUBSCRIPTION_HEADERS = {
  IDEMPOTENCY_KEY: "Idempotency-Key",
} as const;

export const SUBSCRIPTION_QUERY_KEYS = {
  PLANS: ["subscription-plans"] as const,
  RESTAURANT_STATUS: ["restaurant-status"] as const,
} as const;

export const SUBSCRIPTION_THRESHOLDS = {
  EXPIRY_BANNER_WARNING_DAYS: 7,
  RENEWAL_ELIGIBILITY_WINDOW_DAYS: 30,
  MILLISECONDS_PER_DAY: 86_400_000,
} as const;

export const SUBSCRIPTION_BILLING_CYCLES = {
  MONTHLY: "MONTHLY",
  YEARLY: "YEARLY",
} as const;

export const SUBSCRIPTION_BILLING_CYCLE_OPTIONS = [
  SUBSCRIPTION_BILLING_CYCLES.MONTHLY,
  SUBSCRIPTION_BILLING_CYCLES.YEARLY,
] as const;

export const SUBSCRIPTION_BILLING_CYCLE_LABELS = {
  MONTHLY: "Monthly",
  YEARLY: "Yearly",
} as const;

export const SUBSCRIPTION_STATUSES = {
  ACTIVE: "ACTIVE",
  EXPIRED: "EXPIRED",
  PAST_DUE: "PAST_DUE",
  CANCELLED: "CANCELLED",
  PENDING: "PENDING",
} as const;

export const RESTAURANT_VERIFICATION_STATUSES = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  VERIFIED: "VERIFIED",
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
