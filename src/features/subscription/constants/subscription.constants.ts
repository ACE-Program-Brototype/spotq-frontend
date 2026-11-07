export const SUBSCRIPTION_ENDPOINTS = {
  PLANS: "payments/plans",
  CREATE_ORDER: "payments/subscriptions/order",
  RENEW: (subscriptionId: string) => `payments/subscriptions/${subscriptionId}/renew`,
  VERIFY_PAYMENT: "payments/subscriptions/verify",
  STATUS: "payments/subscriptions/status",
  RESTAURANT_STATUS: "restaurants/me/status",
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

export const SUBSCRIPTION_RENEWAL_TEXTS = {
  BANNER_REGION_LABEL: "Subscription expiry alert",
  BANNER_TITLE: "Subscription Expiring Soon",
  BANNER_TITLE_EXPIRED: "Subscription Expired",
  BANNER_EXPIRED: (planName: string) =>
    `Your ${planName} subscription has expired. Renew now to restore uninterrupted service.`,
  BANNER_EXPIRES_TODAY: (planName: string) =>
    `Your ${planName} subscription expires today. Renew now to avoid service interruption.`,
  BANNER_EXPIRES_IN_ONE_DAY: (planName: string) =>
    `Your ${planName} subscription expires in 1 day. Renew now to avoid service interruption.`,
  BANNER_EXPIRES_IN_DAYS: (planName: string, days: number) =>
    `Your ${planName} subscription expires in ${days} days. Renew now to avoid service interruption.`,
  REMAINING_DAYS_BADGE_EXPIRED: "Expired",
  REMAINING_DAYS_BADGE_TODAY: "Expires today",
  REMAINING_DAYS_BADGE_ONE: "1 day remaining",
  REMAINING_DAYS_BADGE_MANY: (days: number) => `${days} days remaining`,
  RENEW_NOW_BUTTON: "Renew Now",
  SUBSCRIBE_BUTTON: "Subscribe",
  CONTINUE_TO_PAYMENT_BUTTON: "Continue to Payment",
  PROCESSING_RENEWAL_BUTTON: "Processing...",
  CANCEL_BUTTON: "Cancel",
  CLOSE_MODAL_ARIA_LABEL: "Close renewal modal",
  ELIGIBILITY_TOOLTIP: "Renewal opens 30 days prior to expiration",
  OVERVIEW_CARD_TITLE: "Subscription",
  OVERVIEW_STATUS_INACTIVE: "Inactive",
  OVERVIEW_EXPIRES_ON_PREFIX: "Expires",
  OVERVIEW_LOADING_TEXT: "Loading subscription details...",
  DEFAULT_CURRENT_PLAN_NAME: "Current Plan",
  NOT_AVAILABLE_FALLBACK: "N/A",
  MODAL_TITLE: "Renew Subscription",
  MODAL_DESCRIPTION:
    "Review your current subscription details and choose a billing cycle to extend uninterrupted SpotQ service.",
  SUMMARY_SECTION_TITLE: "Current Subscription",
  CURRENT_PLAN_LABEL: "Current Plan",
  CURRENT_CYCLE_LABEL: "Current Billing Cycle",
  CURRENT_EXPIRY_LABEL: "Current Expiry Date",
  SELECTED_CYCLE_LABEL: "Selected Renewal Cycle",
  RENEWAL_PRICE_LABEL: "Renewal Price",
  BILLING_CYCLE_SECTION_TITLE: "Select Billing Cycle",
  CYCLE_UNAVAILABLE_LABEL: "Not available for this plan",
  TERM_PREVIEW_SECTION_TITLE: "Renewal Term Preview",
  PROPOSED_EXPIRY_LABEL: "Proposed Expiry Date",
  TERM_PREVIEW_TEXT: (startDate: string, endDate: string) =>
    `Renews from ${startDate} to ${endDate}`,
  EXPIRED_SUBSCRIPTION_NOTE:
    "Your subscription has expired. The new billing period starts upon payment confirmation.",
  ACTIVE_EXTENSION_NOTE:
    "Extends directly from your current expiry date with no lost remaining days.",
  PLANS_LOADING_TEXT: "Loading available billing cycles...",
  PLANS_LOAD_ERROR_TEXT: "Unable to load renewal pricing right now. Please retry.",
  NO_VALID_PRICE_TEXT: "No valid renewal pricing is available for the selected billing cycle.",
  RETRY_PLANS_BUTTON: "Retry",
  CHECKOUT_BRAND_NAME: "SpotQ",
  CHECKOUT_THEME_COLOR: "#ea580c",
  CHECKOUT_DESCRIPTION: (planName: string) => `${planName} Subscription Renewal`,
  RENEWAL_INITIATION_FAILED: "Failed to initiate subscription renewal. Please try again.",
  RENEWAL_VERIFIED_SUCCESS:
    "Subscription renewed successfully! Your updated validity dates are now active.",
  MISSING_SUBSCRIPTION_ID_ERROR: "Subscription identifier is required to initiate renewal.",
  MISSING_RESTAURANT_ID_ORDER_ERROR:
    "Restaurant identification is required to create a subscription order.",
  MISSING_RESTAURANT_ID_VERIFY_ERROR: "Restaurant identification is required to verify payment.",
  MISSING_RESTAURANT_AUTH_ERROR: "No authenticated restaurant found.",
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

export const RESTAURANT_DASHBOARD_TEXTS = {
  BADGE: "Restaurant dashboard",
  WELCOME_PREFIX: "Welcome, ",
  DEFAULT_RESTAURANT_NAME: "restaurant",
  LOGOUT_BUTTON: "Logout",
  SUBSCRIPTION_REQUIRED_TITLE: "Subscription Required",
  SUBSCRIPTION_REQUIRED_DESC:
    "Your restaurant is verified! Select a subscription plan to start taking customer orders.",
  CHOOSE_PLAN_BUTTON: "Choose Plan",
  ACCOUNT_STATUS_LABEL: "Account status",
  DEFAULT_ACTIVE_STATUS: "Active",
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
