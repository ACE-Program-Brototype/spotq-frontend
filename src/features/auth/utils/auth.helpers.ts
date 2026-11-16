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
import {
  ONBOARDING_STATUS,
  USER_ROLES,
  USER_STATUS,
} from "@/features/auth/constants/auth.constants";
import type { Role } from "@/features/auth/types/auth.types";

export const getRoleHome = (
  role?: Role | string,
  status?: string,
  onboardingStatus?: string,
): string => {
  const normalizedRole = role?.toUpperCase();
  switch (normalizedRole) {
    case USER_ROLES.ADMIN:
      return ADMIN_ROUTES.DASHBOARD;
    case USER_ROLES.RESTAURANT_ADMIN:
    case USER_ROLES.RESTAURANT_OWNER:
      if (
        status === USER_STATUS.ACTIVE ||
        status === USER_STATUS.APPROVED ||
        status === USER_STATUS.VERIFIED
      ) {
        return RESTAURANT_ROUTES.DASHBOARD;
      }
      if (
        status === USER_STATUS.UNDER_REVIEW ||
        status === USER_STATUS.SUBMITTED ||
        onboardingStatus === ONBOARDING_STATUS.COMPLETED
      ) {
        return RESTAURANT_ROUTES.ONBOARDING.STATUS;
      }
      if (status === USER_STATUS.PENDING) {
        return RESTAURANT_ROUTES.ONBOARDING.BUSINESS_INFORMATION;
      }
      return RESTAURANT_ROUTES.DASHBOARD;
    case USER_ROLES.STAFF:
      return STAFF_ROUTES.DASHBOARD;
    default:
      return CUSTOMER_ROUTES.HOME;
  }
};
