import type { SubscriptionBillingFilterStatus } from "@/features/subscription/types/subscription-history.types";

export interface StatusFilterOption {
  label: string;
  value: SubscriptionBillingFilterStatus;
}

export const SUBSCRIPTION_HISTORY_STATUS_OPTIONS: readonly StatusFilterOption[] = [
  { label: "All Statuses", value: "ALL" },
  { label: "Success", value: "SUCCESS" },
  { label: "Created / Incomplete", value: "CREATED" },
  { label: "Failed", value: "FAILED" },
] as const;

export const SUBSCRIPTION_HISTORY_MESSAGES = {
  PAGE_TITLE: "Subscription History & Tax Invoices",
  PAGE_SUBTITLE:
    "Track historical subscription purchases, check transaction statuses, and securely download tax invoices.",
  BREADCRUMB_SETTINGS: "Settings",
  BREADCRUMB_BILLING: "Billing",
  BREADCRUMB_CURRENT: "Subscription History",

  STATUS_FILTER_LABEL: "Filter by Status",
  ALL_STATUSES: "All Statuses",

  EMPTY_TITLE: "No billing transactions yet",
  EMPTY_DESCRIPTION:
    "Your restaurant has not completed or initiated any subscription transactions yet.",
  FILTER_EMPTY_TITLE: "No matching transactions",
  FILTER_EMPTY_DESCRIPTION: "No subscription transactions match the selected status filter.",
  RESET_FILTER_BUTTON: "Reset Filters",

  FETCH_ERROR_TITLE: "Unable to load billing history",
  FETCH_ERROR_DESCRIPTION:
    "An error occurred while fetching your billing history records. Please check your network connection and try again.",
  RETRY_BUTTON: "Try Again",

  INVOICE_NOT_AVAILABLE: "Invoice PDF not available for this transaction",
  DOWNLOAD_INVOICE_ARIA: "Download tax invoice",
  DOWNLOAD_BUTTON_LABEL: "Download",
  INVOICE_UNAVAILABLE_LABEL: "Unavailable",

  TABLE_HEADER_DATE: "Date",
  TABLE_HEADER_INVOICE: "Invoice #",
  TABLE_HEADER_PLAN: "Plan",
  TABLE_HEADER_CYCLE: "Billing Cycle",
  TABLE_HEADER_AMOUNT: "Amount",
  TABLE_HEADER_STATUS: "Status",
  TABLE_HEADER_ACTIONS: "Invoice",

  STATUS_SUCCESS_LABEL: "Success",
  STATUS_FAILED_LABEL: "Failed",
  STATUS_CREATED_LABEL: "Incomplete",

  CYCLE_MONTHLY_LABEL: "Monthly",
  CYCLE_YEARLY_LABEL: "Yearly",

  REFRESH_BUTTON_LABEL: "Refresh",
  REFRESHING_LABEL: "Refreshing...",

  TOTAL_COUNT_LABEL: "Total Transactions",
} as const;

export const SUBSCRIPTION_HISTORY_CONFIG = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  DEFAULT_STATUS: "ALL" as const,
  STALE_TIME_MS: 60 * 1000,
} as const;
