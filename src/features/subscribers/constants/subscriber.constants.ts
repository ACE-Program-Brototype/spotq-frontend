export const SUBSCRIBER_ENDPOINTS = {
  LIST: "subscribers",
  DETAILS: (subscriberId: string) => `subscribers/${subscriberId}`,
} as const;

export const SUBSCRIBER_STATUS = {
  ACTIVE: "ACTIVE",
  PENDING: "PENDING",
  EXPIRED: "EXPIRED",
  CANCELLED: "CANCELLED",
  PAST_DUE: "PAST_DUE",
} as const;

export const SUBSCRIBER_FILTER_STATUS = {
  ALL: "ALL",
  ACTIVE: "ACTIVE",
  PENDING: "PENDING",
  EXPIRED: "EXPIRED",
  CANCELLED: "CANCELLED",
  PAST_DUE: "PAST_DUE",
} as const;

export const SUBSCRIBER_SORT_BY = {
  CREATED_AT: "createdAt",
  CURRENT_PERIOD_END: "currentPeriodEnd",
  CURRENT_PERIOD_START: "currentPeriodStart",
  STATUS: "status",
} as const;

export const SUBSCRIBER_SORT_ORDER = {
  ASC: "asc",
  DESC: "desc",
} as const;

export const SUBSCRIBER_DEFAULTS = {
  PAGE: 1,
  LIMIT: 10,
  SORT_BY: SUBSCRIBER_SORT_BY.CREATED_AT,
  SORT_ORDER: SUBSCRIBER_SORT_ORDER.DESC,
  FILTER_STATUS: SUBSCRIBER_FILTER_STATUS.ALL,
  SEARCH_DEBOUNCE_MS: 350,
} as const;

export const DATE_ONLY_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  hour: undefined,
  minute: undefined,
};

export const SUBSCRIBER_QUERY_KEYS = {
  ALL: ["subscribers"] as const,
  LIST: (params: Record<string, unknown>) => ["subscribers", "list", params] as const,
  DETAILS: (id?: string) => ["subscribers", "detail", id] as const,
} as const;

export const SUBSCRIBER_MESSAGES = {
  PAGE_TITLE: "Subscribers",
  PAGE_SUBTITLE: "View and monitor restaurants subscribed to SpotQ.",
  SEARCH_PLACEHOLDER: "Search by restaurant or subscriber...",
  FILTER_STATUS_LABEL: "Status:",
  FILTER_STATUS_ALL: "All Statuses",
  SORT_LABEL: "Sort:",
  SORT_NEWEST: "Newest First",
  SORT_OLDEST: "Oldest First",
  CLEAR_FILTERS: "Clear Filters",
  VIEW_DETAILS: "View Details",
  TABLE_HEADER_RESTAURANT: "Restaurant",
  TABLE_HEADER_SUBSCRIBER: "Subscriber",
  TABLE_HEADER_PLAN: "Plan",
  TABLE_HEADER_CYCLE: "Billing Cycle",
  TABLE_HEADER_PRICE: "Price",
  TABLE_HEADER_STATUS: "Status",
  TABLE_HEADER_START_DATE: "Start Date",
  TABLE_HEADER_RENEWAL: "Renewal / Expiry",
  TABLE_HEADER_ACTIONS: "Actions",
  EMPTY_TITLE: "No subscribers found",
  EMPTY_DESCRIPTION: "There are currently no subscribed restaurants on the platform.",
  FILTERED_EMPTY_TITLE: "No matching subscribers",
  FILTERED_EMPTY_DESCRIPTION: "No subscribers match your search and filter criteria.",
  ERROR_TITLE: "Failed to load subscribers",
  ERROR_DESCRIPTION: "An error occurred while fetching the subscribers list. Please try again.",
  RETRY_BUTTON: "Try Again",
  DETAILS_PAGE_BACK_BUTTON: "Back to Subscribers",
  DETAILS_SECTION_RESTAURANT: "Restaurant & Subscriber Details",
  DETAILS_SECTION_PLAN: "Subscription Plan",
  DETAILS_SECTION_TRANSACTIONS: "Transaction History",
  DETAILS_SECTION_INVOICES: "Invoices",
  DETAILS_NO_TRANSACTIONS: "No transactions recorded for this subscription.",
  DETAILS_NO_INVOICES: "No invoices available for this subscription.",
  DETAILS_NOT_FOUND_TITLE: "Subscriber Not Found",
  DETAILS_NOT_FOUND_DESCRIPTION:
    "The requested subscriber record does not exist or may have been removed.",
  DETAILS_ERROR_TITLE: "Failed to load subscriber details",
  DETAILS_ERROR_DESCRIPTION:
    "Could not retrieve subscriber details. Please check your network and retry.",
  LABEL_RESTAURANT_ID: "Restaurant ID",
  LABEL_SUBSCRIBER_NAME: "Subscriber Name",
  LABEL_EMAIL: "Email Address",
  LABEL_CREATED_AT: "Created On",
  LABEL_UPDATED_AT: "Last Updated",
  LABEL_PLAN_CODE: "Plan Code",
  LABEL_BILLING_CYCLE: "Billing Cycle",
  LABEL_PRICE: "Price",
  LABEL_PERIOD_START: "Current Period Start",
  LABEL_PERIOD_END: "Current Period End",
  LABEL_CANCELED_AT: "Canceled On",
  LABEL_FEATURES: "Included Features",
  LABEL_NO_FEATURES: "Standard features included.",
  TXN_HEADER_ID: "Transaction ID",
  TXN_HEADER_AMOUNT: "Amount",
  TXN_HEADER_STATUS: "Status",
  TXN_HEADER_ORDER_ID: "Razorpay Order ID",
  TXN_HEADER_PAYMENT_ID: "Razorpay Payment ID",
  TXN_HEADER_DATE: "Date",
  INV_HEADER_NUMBER: "Invoice #",
  INV_HEADER_AMOUNT: "Amount",
  INV_HEADER_STATUS: "Status",
  INV_HEADER_PAID_AT: "Paid At",
  INV_HEADER_DATE: "Date",
  NOT_APPLICABLE: "-",
} as const;
