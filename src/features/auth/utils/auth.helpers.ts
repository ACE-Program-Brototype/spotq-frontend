import type { Role } from "../types/auth.types";

/**
 * Returns the canonical dashboard home route for a given user role.
 */
export const getRoleHome = (role?: Role): string => {
  switch (role) {
    case "ADMIN":
      return "/admin/dashboard";
    case "RESTAURANT_ADMIN":
      return "/restaurant/dashboard";
    case "RESTAURANT_STAFF":
      return "/staff/dashboard";
    default:
      return "/";
  }
};
