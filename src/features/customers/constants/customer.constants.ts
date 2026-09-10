export const CUSTOMER_ENDPOINTS = {
  LIST: "users",
  STATUS: (userId: string) => `users/${userId}/status`,
} as const;

export const CUSTOMER_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  BLOCKED: "BLOCKED",
} as const;

export type CustomerStatusType = (typeof CUSTOMER_STATUS)[keyof typeof CUSTOMER_STATUS];

export const CUSTOMER_FILTER_STATUS = {
  ALL: "ALL",
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  BLOCKED: "BLOCKED",
} as const;

export type CustomerFilterStatusType =
  (typeof CUSTOMER_FILTER_STATUS)[keyof typeof CUSTOMER_FILTER_STATUS];

export const CUSTOMER_SORT_BY = {
  CREATED_AT: "createdAt",
} as const;

export type CustomerSortByType = (typeof CUSTOMER_SORT_BY)[keyof typeof CUSTOMER_SORT_BY];

export const CUSTOMER_SORT_ORDER = {
  ASC: "ASC",
  DESC: "DESC",
} as const;

export type CustomerSortOrderType = (typeof CUSTOMER_SORT_ORDER)[keyof typeof CUSTOMER_SORT_ORDER];

export const CUSTOMER_DEFAULTS = {
  PAGE: 1,
  LIMIT: 20,
  SORT_BY: CUSTOMER_SORT_BY.CREATED_AT,
  SORT_ORDER: CUSTOMER_SORT_ORDER.DESC,
  FILTER_STATUS: CUSTOMER_FILTER_STATUS.ALL,
  SEARCH_DEBOUNCE_MS: 350,
} as const;

export const CUSTOMER_MESSAGES = {
  PAGE_TITLE: "Customer Directory",
  PAGE_SUBTITLE: "Manage platform users, monitor status, and handle administrative actions.",
  FILTER_STATUS_LABEL: "Filter Status:",
  SEARCH_PLACEHOLDER: "Search by name, email...",
  COL_USER_PROFILE: "USER PROFILE",
  COL_CONTACT_INFO: "CONTACT INFO",
  COL_LOCATION: "LOCATION",
  COL_STATUS: "STATUS",
  COL_ACTIONS: "ACTIONS",
  STATUS_ALL: "All Users",
  STATUS_ACTIVE: "Active",
  STATUS_INACTIVE: "Inactive",
  STATUS_BLOCKED: "Blocked",
  EMPTY_TITLE: "No customers found",
  EMPTY_FILTER_DESCRIPTION: "No customer records match your active search or filter criteria.",
  EMPTY_DEFAULT_DESCRIPTION: "There are currently no registered customers.",
  ERROR_TITLE: "Failed to load customers",
  ERROR_DESCRIPTION: "An error occurred while fetching customer records. Please try again.",
  RETRY_BUTTON: "Retry",
  CLEAR_FILTERS_BUTTON: "Clear Filters",
  MEMBER_SINCE_PREFIX: "Member since",
  LOCATION_NOT_AVAILABLE: "N/A",
  BLOCK_ACTION_TOOLTIP: "Block Customer",
  UNBLOCK_ACTION_TOOLTIP: "Unblock Customer",
  BLOCK_CONFIRM_TITLE: "Block Customer?",
  BLOCK_CONFIRM_DESCRIPTION: (name: string) =>
    `Are you sure you want to block ${name}? They will not be able to log in or use customer services until unblocked.`,
  UNBLOCK_CONFIRM_TITLE: "Unblock Customer?",
  UNBLOCK_CONFIRM_DESCRIPTION: (name: string) =>
    `Are you sure you want to unblock ${name}? Their account access will be restored immediately.`,
  CONFIRM_BLOCK_BUTTON: "Yes, Block Customer",
  CONFIRM_UNBLOCK_BUTTON: "Yes, Unblock Customer",
  BLOCK_SUCCESS: "Customer account has been blocked successfully.",
  UNBLOCK_SUCCESS: "Customer account has been unblocked successfully.",
  STATUS_UPDATE_ERROR: "Failed to update customer status. Please try again.",
} as const;
