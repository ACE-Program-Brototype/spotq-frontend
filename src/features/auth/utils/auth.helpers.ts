/**
 * Role Route Helper Utilities
 * Determines canonical default landing path based on user role and onboarding status.
 */

import {
  ADMIN_ROUTES,
  CUSTOMER_ROUTES,
  RESTAURANT_ROUTES,
  STAFF_ROUTES,
} from "@/app/router/routes.constants";
import type { Role } from "../types/auth.types";

export const getRoleHome = (
  role?: Role | string,
  status?: string,
  onboardingStatus?: string,
): string => {
  const normalizedRole = role?.toUpperCase();
  switch (normalizedRole) {
    case "ADMIN":
      return ADMIN_ROUTES.DASHBOARD;
    case "RESTAURANT_ADMIN":
      if (status === "ACTIVE" || status === "APPROVED" || status === "VERIFIED") {
        return RESTAURANT_ROUTES.DASHBOARD;
      }
      if (status === "UNDER_REVIEW" || status === "SUBMITTED" || onboardingStatus === "COMPLETED") {
        return RESTAURANT_ROUTES.ONBOARDING.STATUS;
      }
      if (status === "PENDING") {
        return RESTAURANT_ROUTES.ONBOARDING.BUSINESS_INFORMATION;
      }
      return RESTAURANT_ROUTES.DASHBOARD;
    case "STAFF":
      return STAFF_ROUTES.DASHBOARD;
    default:
      return CUSTOMER_ROUTES.HOME;
  }
};
