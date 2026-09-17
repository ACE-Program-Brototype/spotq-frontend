export const STAFF_ENDPOINTS = {
  INVITATIONS: "restaurants/staff/invitations",
  INVITATIONS_RESEND: "restaurants/staff/invitations/resend",
  INVITATIONS_REVOKE: "restaurants/staff/invitations/revoke",
  STAFF_LIST: "restaurants/staff",
  STAFF_DETAIL: (restaurantIdOrStaffId: string, maybeStaffId?: string) =>
    maybeStaffId
      ? `restaurants/${restaurantIdOrStaffId}/staff/${maybeStaffId}`
      : `restaurants/staff/${restaurantIdOrStaffId}`,
  STAFF_DETAIL_BY_RESTAURANT: (restaurantId: string, staffId: string) =>
    `restaurants/${restaurantId}/staff/${staffId}`,
  STAFF_STATUS: (restaurantId: string, staffId: string) =>
    `restaurants/${restaurantId}/staff/${staffId}/status`,
  STAFF_DELETE: (restaurantId: string, staffId: string) =>
    `restaurants/${restaurantId}/staff/${staffId}`,
} as const;

export const STAFF_DESIGNATIONS = [
  "Manager",
  "Head Chef",
  "Sous Chef",
  "Chef",
  "Waiter / Server",
  "Cashier",
  "Bartender",
  "Host / Hostess",
  "Kitchen Staff",
] as const;

export type StaffDesignation = (typeof STAFF_DESIGNATIONS)[number];

export const STAFF_DEFAULTS = {
  RESTAURANT_NAME: "SpotQ Restaurant",
  NAME: "Staff Member",
  ROLE: "Staff",
  STATUS: "ACTIVE",
} as const;

export const STAFF_MESSAGES = {
  DEFAULT_NAME: "Staff Member",
  DEFAULT_ROLE: "Staff",
  DEFAULT_STATUS: "ACTIVE",
  NOT_PROVIDED: "Not provided",
  NOT_AVAILABLE: "Not available",
  MEMBER_SINCE: "Member since",
  LABEL_FULL_NAME: "Full Name",
  LABEL_EMAIL: "Email Address",
  LABEL_PHONE: "Phone Number",
  LABEL_ROLE: "Role",
  LABEL_STATUS: "Account Status",
  LABEL_CREATED_AT: "Created At",
  LABEL_UPDATED_AT: "Last Updated",
  LABEL_STAFF_ID: "Staff ID:",
  LABEL_RESTAURANT_ID: "Restaurant ID:",
  ACTION_DEACTIVATE: "Deactivate Staff",
  ACTION_ACTIVATE: "Activate Staff",
  ACTION_REMOVE: "Remove Staff",
  ACTION_CANCEL: "Cancel",
  ACTION_BACK_TO_STAFF_MEMBERS: "Back to Staff Members",
  ACTION_BACK_TO_STAFF: "Back to Staff",
  ACTION_RETRY: "Retry",
  ERROR_ACCESS_DENIED_TITLE: "Access Denied",
  ERROR_LOAD_FAILED_TITLE: "Unable to Load Staff Details",
  ERROR_NOT_FOUND_DESCRIPTION:
    "The staff member you are looking for does not exist or may have been removed.",
  INVITE_SENT_SUCCESS: "Invitation link sent successfully.",
  INVITE_RESENT_SUCCESS: "Invitation link resent successfully.",
  INVITE_REVOKED_SUCCESS: "Invitation revoked successfully.",
  INVITE_ACCEPTED_SUCCESS: "Invitation accepted successfully. Welcome to the team!",
  FETCH_INVITATIONS_SUCCESS: "Invitations fetched successfully",
  FETCH_INVITATIONS_ERROR: "Failed to fetch invitations",
  FETCH_STAFF_ERROR: "Failed to fetch staff directory.",
  INVALID_OR_EXPIRED_TOKEN: "Invalid or expired invitation token",
  ACCEPT_INVITATION_SUCCESS: "Invitation accepted successfully",
  SEND_INVITATION_ERROR: "Failed to send invitation. Please try again.",
  RESEND_INVITATION_ERROR: "Failed to resend invitation.",
  REVOKE_INVITATION_ERROR: "Failed to revoke invitation.",
  FETCH_STAFF_DETAIL_SUCCESS: "Staff member details retrieved successfully.",
  FETCH_STAFF_DETAIL_ERROR: "Failed to load staff details. Please try again.",
  STAFF_NOT_FOUND: "Staff member not found.",
  STAFF_FORBIDDEN: "You do not have permission to view this staff member's details.",
  STAFF_ACTIVATE_SUCCESS: "Staff activated successfully.",
  STAFF_DEACTIVATE_SUCCESS: "Staff deactivated successfully.",
  STAFF_STATUS_UPDATE_ERROR: "Failed to update staff status.",
  STAFF_DELETE_SUCCESS: "Staff member deleted successfully.",
  STAFF_DELETE_ERROR: "Failed to delete staff member.",
  STAFF_DELETE_CONFIRM_TITLE: "Remove Staff Member?",
  STAFF_DELETE_CONFIRM_DESCRIPTION:
    "Are you sure you want to remove this staff member? This action cannot be undone.",
  STAFF_UPDATE_SUCCESS: "Staff information updated successfully.",
  STAFF_UPDATE_ERROR: "Failed to update staff information. Please try again.",
  STAFF_NO_CHANGES: "No changes detected to update.",
  NAME_REQUIRED: "Name is required",
  NAME_MIN_LENGTH: "Full name must be at least 2 characters",
  NAME_MAX_LENGTH: "Full name must not exceed 100 characters",
  PHONE_REQUIRED: "Phone number is required",
  PHONE_INVALID: "Please enter a valid phone number",
} as const;
