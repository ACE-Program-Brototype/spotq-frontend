/**
 * Customer Payment Constants
 * Endpoints, query keys, message strings, and status mapping definitions.
 */

export const CUSTOMER_PAYMENT_ENDPOINTS = {
  HISTORY: "payments/history",
  RETRY: (id: string) => `payments/transactions/${id}/retry`,
  VERIFY: "payments/orders/verify",
  INVOICE: (id: string) => `payments/transactions/${id}/invoice`,
} as const;

export const CUSTOMER_PAYMENT_DEFAULTS = {
  PAGE: 1,
  LIMIT: 10,
  STATUS: "ALL" as const,
  SORT_BY: "createdAt" as const,
  SORT_ORDER: "desc" as const,
} as const;

export const CUSTOMER_PAYMENT_SORT_FIELDS = {
  CREATED_AT: "createdAt",
  AMOUNT_PAISE: "amountPaise",
} as const;

export const CUSTOMER_PAYMENT_SORT_DIRECTIONS = {
  ASC: "asc",
  DESC: "desc",
} as const;

export const CUSTOMER_PAYMENT_SORT_OPTIONS = [
  { label: "Newest First", sortBy: "createdAt", sortOrder: "desc" },
  { label: "Oldest First", sortBy: "createdAt", sortOrder: "asc" },
  { label: "Amount: High to Low", sortBy: "amountPaise", sortOrder: "desc" },
  { label: "Amount: Low to High", sortBy: "amountPaise", sortOrder: "asc" },
] as const;

export const RAZORPAY_CHECKOUT_CONFIG = {
  MERCHANT_NAME: "SpotQ Dining",
  RETRY_DESCRIPTION: "Payment Retry",
  DEFAULT_CURRENCY: "INR",
  THEME_COLOR: "#ff6b00",
} as const;

export const CUSTOMER_INVOICE_CONFIG = {
  FILE_PREFIX: "SpotQ-Invoice-",
  FILE_EXTENSION: ".pdf",
  formatFileName: (idOrNumber: string) => `SpotQ-Invoice-${idOrNumber}.pdf`,
} as const;

export const CUSTOMER_PAYMENT_STATUS = {
  SUCCESS: "SUCCESS",
  CAPTURED: "CAPTURED",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED",
} as const;

export const PAYMENT_FILTER_STATUS = {
  ALL: "ALL",
  SUCCESS: "CAPTURED",
  CAPTURED: "CAPTURED",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED",
} as const;

export const CUSTOMER_PAYMENT_QUERY_KEYS = {
  ALL: ["customer-payments"] as const,
  HISTORY: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    startDate?: string;
    endDate?: string;
    sortBy?: string;
    sortOrder?: string;
  }) => ["customer-payments", "history", params ?? {}] as const,
} as const;

export const CUSTOMER_PAYMENT_MESSAGES = {
  PAGE_TITLE: "Payment History",
  PAGE_SUBTITLE:
    "Track your dining expenses, retry failed payments, and download official GST tax invoices.",
  TABLE_HEADER_DATE: "Date",
  TABLE_HEADER_ORDER_ID: "Order ID",
  TABLE_HEADER_AMOUNT: "Amount",
  TABLE_HEADER_METHOD: "Payment Method",
  TABLE_HEADER_STATUS: "Status",
  TABLE_HEADER_ACTIONS: "Actions",

  STATUS_SUCCESS: "SUCCESS",
  STATUS_FAILED: "FAILED",
  STATUS_REFUNDED: "REFUNDED",

  ACTION_DOWNLOAD_RECEIPT: "Download Receipt",
  ACTION_DOWNLOADING: "Downloading...",
  ACTION_RETRY_PAYMENT: "Retry Payment",
  ACTION_RETRYING: "Retrying...",
  ACTION_EXPIRED: "Expired",
  ACTION_REFUND_DETAILS: "Refund Details",

  EMPTY_TITLE: "No payment transactions yet",
  EMPTY_DESCRIPTION:
    "When you place orders and make dining payments, your transaction history and tax invoices will appear here.",
  EMPTY_FILTER_TITLE: "No transactions found",
  EMPTY_FILTER_DESCRIPTION: (status: string) =>
    `No payment transactions matching "${status}" were found in your account history.`,
  EMPTY_CLEAR_FILTER: "View All Payments",

  ERROR_TITLE: "Failed to load payment history",
  ERROR_DESCRIPTION:
    "We encountered an issue retrieving your payments. Please check your connection and try again.",
  ERROR_RETRY: "Try Again",
  ERROR_RETRY_FAILED: "Failed to initiate payment retry",
  ERROR_INVOICE_TARGET_REQUIRED: "Transaction ID or invoice URL is required",
  ERROR_INVOICE_URL_FAILED: "Failed to retrieve invoice download URL",

  TOAST_PAYMENT_SUCCESS: "Payment successful! Food order confirmed.",
  TOAST_VERIFY_FAILED: "Failed to verify payment",
  TOAST_ALREADY_PAID: "This order has already been paid.",
  TOAST_ORDER_EXPIRED: "Payment window expired. Cart has been released.",
  TOAST_RETRY_FAILED: "Failed to initiate retry.",
  TOAST_SCRIPT_LOAD_ERROR: "Unable to load payment gateway. Please try again later.",
  TOAST_INVOICE_DOWNLOADING: "Downloading tax invoice receipt...",
  TOAST_INVOICE_DOWNLOAD_SUCCESS: "Tax invoice downloaded successfully.",
  TOAST_INVOICE_DOWNLOAD_ERROR: "Failed to download tax invoice.",
} as const;
