/**
 * Role Route Helper Utilities
 * Determines canonical default landing path based on user role and onboarding status.
 */

import type { Role } from "../types/auth.types";

export const getRoleHome = (
  role?: Role | string,
  status?: string,
  onboardingStatus?: string,
): string => {
  const normalizedRole = role?.toUpperCase();
  switch (normalizedRole) {
    case "ADMIN":
      return "/admin/dashboard";
    case "RESTAURANT_ADMIN":
      if (status === "ACTIVE" || status === "APPROVED" || status === "VERIFIED") {
        return "/restaurant/dashboard";
      }
      if (status === "UNDER_REVIEW" || status === "SUBMITTED" || onboardingStatus === "COMPLETED") {
        return "/restaurant/onboarding/status";
      }
      if (status === "PENDING") {
        return "/restaurant/onboarding/business-information";
      }
      return "/restaurant/dashboard";
    case "STAFF":
      return "/staff/dashboard";
    default:
      return "/";
  }
};
