export const STAFF_ENDPOINTS = {
  INVITATIONS: "restaurants/staff/invitations",
  INVITATIONS_RESEND: "restaurants/staff/invitations/resend",
  INVITATIONS_REVOKE: "restaurants/staff/invitations/revoke",
  STAFF_LIST: "restaurants/staff",
  STAFF_DETAIL: (id: string) => `restaurants/staff/${id}`,
  STAFF_DETAIL_BY_RESTAURANT: (restaurantId: string, staffId: string) =>
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
} as const;

export const STAFF_MESSAGES = {
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
} as const;
