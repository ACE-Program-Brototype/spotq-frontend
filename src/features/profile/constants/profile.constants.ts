/**
 * Constants and user-facing messages for the customer profile feature.
 */

export const PROFILE_MESSAGES = {
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
  },
} as const;

export const PROFILE_ENDPOINTS = {
  GET_PROFILE: "users/profile",
  UPDATE_PROFILE: "users/profile",
} as const;
