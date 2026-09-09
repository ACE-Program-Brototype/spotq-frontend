export const PROFILE_ENDPOINTS = {
  GET_STAFF_PROFILE: "restaurants/staff/profile/me",
} as const;

export const PROFILE_QUERY_KEYS = {
  STAFF_PROFILE: ["staff", "profile"] as const,
};

export const PROFILE_MESSAGES = {
  PAGE_SUBTITLE: "View and verify your staff account details and restaurant role.",
  ADMIN_ROLE_NOTICE: "Role and status can only be modified by an administrator.",
  PRIMARY_EMAIL_HINT: "Primary email for notifications and login.",
  NOT_PROVIDED: "Not provided",
  NOT_RECORDED: "Not recorded",
  DEFAULT_NAME: "Staff Member",
  DEFAULT_ROLE: "Staff",
  DEFAULT_STATUS: "Active",
  FETCH_ERROR: "Failed to load profile details. Please try again.",
  UNABLE_TO_LOAD: "Unable to Load Profile",
  RETRY: "Retry",
  RETRYING: "Retrying...",
  UNAUTHORIZED: "Your session has expired. Please sign in again.",
  NO_DATA: "No profile data available.",
} as const;

