/**
 * Constants and user-facing messages for customer and staff profile features.
 */

export const PROFILE_MESSAGES = {
  // Customer Profile Messages
  UPDATE_SUCCESS: "Profile updated successfully",
  UPDATE_FAILED: "Failed to update profile. Please try again.",
  FETCH_FAILED: "Failed to load profile",
  FETCH_FAILED_DESCRIPTION:
    "We encountered an issue retrieving your profile information. Please try again.",
  EMAIL_IMMUTABLE_NOTE: "Email address cannot be changed directly.",
  PHONE_VERIFIED_NOTE: "Phone number is linked to your verified account.",
  NOT_SPECIFIED: "Not specified",
  NOT_PROVIDED: "Not provided",
  CUSTOMER_ACCOUNT: "Customer Account",
  MEMBER_SINCE: "Member since :",
  SAVING_CHANGES: "Saving Changes...",
  SAVE_CHANGES: "Save Changes",
  CANCEL: "Cancel",
  RETRY: "Retry",
  RETRYING: "Retrying...",
  LOADING_PROFILE: "Loading profile...",
  EDIT_PROFILE: "Edit Profile",
  MY_PROFILE: "My Profile",
  BACK_TO_PROFILE: "Back to Profile",
  PROFILE_HEADER_SUBTITLE: "Manage your personal information and account settings",
  EDIT_PROFILE_SUBTITLE: "Update your personal information and account preferences",

  VALIDATION: {
    NAME_MIN_LENGTH: "Full name must be at least 2 characters.",
    NAME_MAX_LENGTH: "Full name cannot exceed 100 characters.",
    NAME_INVALID_CHARS: "Full name can only contain letters, spaces, and hyphens.",
    DOB_FUTURE: "Date of birth cannot be in the future.",
    PHONE_INVALID: "Phone number must be exactly 10 digits.",
  },

  // Staff Profile Messages
  PAGE_SUBTITLE: "View and verify your staff account details and restaurant role.",
  ADMIN_ROLE_NOTICE: "Role and status can only be modified by an administrator.",
  PRIMARY_EMAIL_HINT: "Primary email for notifications and login.",
  NOT_RECORDED: "Not recorded",
  DEFAULT_NAME: "Staff Member",
  DEFAULT_ROLE: "Staff",
  DEFAULT_STATUS: "Active",
  FETCH_ERROR: "Failed to load profile details. Please try again.",
  UNABLE_TO_LOAD: "Unable to Load Profile",
  UNAUTHORIZED: "Your session has expired. Please sign in again.",
  NO_DATA: "No profile data available.",
} as const;

export const PROFILE_ENDPOINTS = {
  GET_PROFILE: "users/profile",
  UPDATE_PROFILE: "users/profile",
  GET_STAFF_PROFILE: "restaurants/staff/profile/me",
} as const;

export const PROFILE_QUERY_KEYS = {
  CUSTOMER_PROFILE: ["customer", "profile"] as const,
  STAFF_PROFILE: ["staff", "profile"] as const,
};

export const profileHooks = {
  STAFF_PROFILE_STALE_TIME: 5 * 60 * 1000,
  CUSTOMER_PROFILE_STALE_TIME: 5 * 60 * 1000,
};

export const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

export const Gender = {
  MALE: "MALE",
  FEMALE: "FEMALE",
  OTHER: "OTHER",
} as const;

export type Gender = (typeof Gender)[keyof typeof Gender];
