import type {
  ApplicationFilterStatusType,
  ApplicationSortByType,
  ApplicationSortOrderType,
} from "../types/restaurant-application.types";

export const RESTAURANT_APPLICATION_ENDPOINTS = {
  LIST: "restaurants/admin/restaurants/applications",
  DETAILS: (id: string) => `restaurants/admin/restaurants/applications/${id}`,
  APPROVE: (id: string) => `restaurants/admin/restaurants/${id}/approve`,
  REJECT: (id: string) => `restaurants/admin/restaurants/${id}/reject`,
} as const;

export const RESTAURANT_APPLICATION_QUERY_KEYS = {
  LIST: ["admin", "restaurant-applications"] as const,
  DETAILS: (id?: string) => ["admin", "restaurant-application", id] as const,
} as const;

export const APPLICATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 10,
  SEARCH_DEBOUNCE_MS: 350,
  SORT_BY: "created_at" as ApplicationSortByType,
  SORT_ORDER: "desc" as ApplicationSortOrderType,
  FILTER_STATUS: "ALL" as ApplicationFilterStatusType,
  DETAILS_STALE_TIME_MS: 1000 * 60 * 3, // 3 minutes
} as const;

export const APPLICATION_STATUS = {
  PENDING: "PENDING",
  REJECTED: "REJECTED",
  APPROVED: "APPROVED",
} as const;

export const APPLICATION_FILTER_STATUS = {
  ALL: "ALL",
  PENDING: "PENDING",
  REJECTED: "REJECTED",
} as const;

export const APPLICATION_SORT_OPTIONS: { label: string; value: ApplicationSortByType }[] = [
  { label: "Newest Submitted", value: "created_at" },
  { label: "Restaurant Name (A-Z)", value: "restaurant_name" },
  { label: "Owner Name (A-Z)", value: "owner_name" },
  { label: "Verification Status", value: "status" },
  { label: "Recently Updated", value: "updated_at" },
];

export const APPLICATION_MESSAGES = {
  PAGE_TITLE: "Restaurant Applications",
  PAGE_SUBTITLE:
    "Review, verify documents, and approve onboarding applications for new restaurants",
  SEARCH_PLACEHOLDER: "Search by restaurant name, owner, email, or phone...",
  ERROR_TITLE: "Failed to load applications",
  ERROR_DESCRIPTION:
    "There was a problem fetching the restaurant onboarding applications. Please try again.",
  RETRY_BUTTON: "Retry",
  EMPTY_TITLE: "No applications found",
  EMPTY_DESCRIPTION:
    "There are currently no restaurant applications matching your filter criteria.",
  EMPTY_DEFAULT: "No new restaurant registration applications are pending review.",
  CLEAR_FILTERS: "Clear Filters",

  // Columns
  COL_RESTAURANT: "Restaurant",
  COL_OWNER: "Owner & Contact",
  COL_DOCUMENTS: "Documents",
  COL_STATUS: "Status",
  COL_SUBMITTED: "Submitted Date",
  COL_ACTIONS: "Actions",

  // Review Page
  REVIEW_BACK_BUTTON: "Back to Applications",
  REVIEW_PAGE_TITLE: "Application Review",
  REVIEW_PAGE_SUBTITLE:
    "Inspect legal business certificates, store photos, and decide application outcome",
  REVIEW_NOT_FOUND_TITLE: "Application Not Found",
  REVIEW_NOT_FOUND_DESCRIPTION:
    "The requested restaurant onboarding application could not be located.",

  // Tabs
  TAB_OVERVIEW: "Overview & Location",
  TAB_DOCUMENTS: "Verification Documents",
  TAB_IMAGES: "Store Photos",

  // Actions
  APPROVE_BUTTON: "Approve Application",
  REJECT_BUTTON: "Reject Application",

  // Approval Dialog
  APPROVE_CONFIRM_TITLE: "Approve Restaurant Application",
  APPROVE_CONFIRM_DESCRIPTION: (name: string) =>
    `Are you sure you want to approve "${name}"? Once approved, the restaurant status will change to APPROVED and the owner will gain access to complete subscription plan selection.`,
  APPROVE_CONFIRM_BUTTON: "Confirm & Approve",
  APPROVE_CANCEL_BUTTON: "Cancel",
  APPROVE_SUCCESS: "Restaurant application has been approved successfully.",
  APPROVE_ERROR: "Failed to approve restaurant application. Please try again.",

  // Rejection Modal
  REJECT_MODAL_TITLE: "Reject Restaurant Application",
  REJECT_MODAL_DESCRIPTION:
    "Please provide a clear reason for rejecting this application. This feedback will be sent to the restaurant owner so they can re-upload or rectify their documents.",
  REJECT_REASON_LABEL: "Reason for Rejection",
  REJECT_REASON_PLACEHOLDER:
    "Specify reasons (e.g. FSSAI certificate expired, GST certificate blurry, store facade photo mismatch)...",
  REJECT_REASON_REQUIRED: "A rejection reason is required.",
  REJECT_REASON_MIN_LENGTH: "Rejection reason must be at least 5 characters long.",
  REJECT_CONFIRM_BUTTON: "Confirm & Reject",
  REJECT_CANCEL_BUTTON: "Cancel",
  REJECT_SUCCESS: "Restaurant application has been rejected.",
  REJECT_ERROR: "Failed to reject restaurant application. Please try again.",
} as const;
