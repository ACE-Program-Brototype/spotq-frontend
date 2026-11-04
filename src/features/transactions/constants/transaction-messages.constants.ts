/**
 * Transaction Messages & UI String Constants
 * Centralized repository for all user-facing strings, headers, labels, placeholders, and error messages.
 */

export const TRANSACTION_MESSAGES = {
  PAGE_TITLE: "Payment Transactions",
  PAGE_SUBTITLE:
    "Monitor customer dining payments, inspect itemized order billing breakdowns, and verify settlement records.",
  BREADCRUMB_PARENT: "Finance",
  BREADCRUMB_CURRENT: "Transactions",

  // Action Buttons
  EXPORT_CSV: "Export CSV",
  EXPORTING_CSV: "Exporting...",
  VIEW_DETAILS: "View Details",
  RESET_FILTERS: "Reset Filters",
  RETRY: "Retry",
  CLOSE: "Close",
  COPY: "Copy",
  COPIED: "Copied to clipboard",

  // Search & Filters
  SEARCH_PLACEHOLDER: "Search by Order #, Customer, or Payment ID...",
  SEARCH_ARIA_LABEL: "Search transactions",
  FILTER_STATUS_LABEL: "Status",
  FILTER_METHOD_LABEL: "Payment Method",
  FILTER_DATE_LABEL: "Date Range",
  START_DATE_LABEL: "Start Date",
  END_DATE_LABEL: "End Date",

  // Filter Dropdown Options
  STATUS_OPTIONS: {
    ALL: "All Statuses",
    SUCCESS: "Success",
    PENDING: "Pending",
    FAILED: "Failed",
    REFUNDED: "Refunded",
  },
  METHOD_OPTIONS: {
    ALL: "All Methods",
    UPI: "UPI",
    CARD: "Card",
    NETBANKING: "Netbanking",
  },
  DATE_OPTIONS: {
    ALL: "All Time",
    TODAY: "Today",
    YESTERDAY: "Yesterday",
    LAST_7_DAYS: "Last 7 Days",
    THIS_MONTH: "This Month",
    CUSTOM: "Custom Range",
  },

  // Table Headers
  TABLE_HEADERS: {
    DATE_TIME: "Date & Time",
    ORDER_NUMBER: "Order Number",
    CUSTOMER: "Customer",
    METHOD: "Method",
    AMOUNT: "Amount",
    STATUS: "Status",
    SETTLEMENT: "Settlement",
    ACTIONS: "Action",
  },

  // Status Badges
  STATUS_LABELS: {
    SUCCESS: "Success",
    PENDING: "Pending",
    FAILED: "Failed",
    REFUNDED: "Refunded",
  },

  // Settlement Badges
  SETTLEMENT_LABELS: {
    PENDING_EOD: "Pending EOD",
    SETTLED: "Settled",
    DEDUCTED_EOD: "Deducted EOD",
    N_A: "N/A",
  },

  // Slide-Over Drawer
  DRAWER_TITLE: "Transaction Details",
  DRAWER_SUBTITLE:
    "Inspect customer order information, itemized billing breakdown, and Razorpay gateway metadata.",
  SECTION_CONTEXT: "Transaction Overview",
  SECTION_CUSTOMER: "Customer & Dining Context",
  SECTION_FINANCIAL: "Financial Billing Breakdown",
  SECTION_GATEWAY: "Payment Gateway Metadata",
  SECTION_REFUND: "Refund Information",

  // Drawer Field Labels
  LABEL_TRANSACTION_ID: "Transaction ID",
  LABEL_TIMESTAMP: "Timestamp",
  LABEL_ORDER_NUMBER: "Order Number",
  LABEL_ORDER_STATUS: "Order Status",
  LABEL_CUSTOMER_NAME: "Customer Name",
  LABEL_CUSTOMER_CONTACT: "Contact",
  LABEL_TABLE_TOKEN: "Table / Token",
  LABEL_FOOD_SUBTOTAL: "Food Items Subtotal",
  LABEL_GST: "GST Taxes",
  LABEL_DISCOUNTS: "Discounts & Offers",
  LABEL_TOTAL_AMOUNT: "Total Amount Charged",
  LABEL_GATEWAY_PROVIDER: "Gateway Provider",
  LABEL_PAYMENT_ID: "Razorpay Payment ID",
  LABEL_GATEWAY_ORDER_ID: "Razorpay Order ID",
  LABEL_VPA_CARD: "Payment Account / VPA",
  LABEL_BANK_RRN: "Bank Reference (RRN)",
  LABEL_SETTLEMENT_STATUS: "Settlement Status",
  LABEL_SETTLEMENT_DATE: "Expected Settlement Date",
  LABEL_REFUND_ID: "Refund ID",
  LABEL_REFUND_AMOUNT: "Refund Amount",
  LABEL_REFUND_REASON: "Refund Reason",
  LABEL_REFUND_DATE: "Refund Date",

  // Empty & Error States
  INVALID_DATE_RANGE: "Start date cannot be after end date",
  EMPTY_TITLE: "No transactions found",
  EMPTY_DESCRIPTION:
    "Try adjusting your search criteria, selecting a different date range, or clearing applied filters.",
  ERROR_TITLE: "Failed to load transactions",
  ERROR_DESCRIPTION:
    "An error occurred while fetching payment records. Please verify your network connection and retry.",
  DRAWER_ERROR: "Unable to load transaction details. Please close and try again.",

  // CSV Export Notifications
  EXPORT_SUCCESS: "Transactions exported successfully",
  EXPORT_ERROR: "Failed to generate transactions CSV export",
  EXPORT_EMPTY: "No transactions available to export",
} as const;
