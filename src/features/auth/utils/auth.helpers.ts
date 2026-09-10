/**
 * Role Route Helper Utilities
 * Determines canonical default landing path based on user role and onboarding status.
 */

import type { Role } from "../types/auth.types";

export const getRoleHome = (role?: Role, status?: string): string => {
  switch (role) {
    case "ADMIN":
      return "/admin/dashboard";
    case "RESTAURANT_ADMIN":
      if (status === "PENDING") {
        return "/restaurant/onboarding/business-information";
      }
      return "/restaurant/dashboard";
    case "RESTAURANT_STAFF":
      return "/staff/dashboard";
    default:
      return "/";
  }
};
