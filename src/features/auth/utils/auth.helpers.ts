/**
 * Role Route Helper Utilities
 * Determines canonical default landing path based on user role.
 */

import type { Role } from "../types/auth.types";

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
