import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
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
import { useAuthStore } from "@/features/auth/store/auth.store";
import type { Role } from "@/features/auth/types/auth.types";
import { getRoleHome } from "@/features/auth/utils/auth.helpers";

export interface ProtectedLayoutProps {
  allowedRoles?: Role[];
  redirectTo?: string;
}

export default function ProtectedLayout({
  allowedRoles,
  redirectTo = CUSTOMER_ROUTES.AUTH.LOGIN,
}: ProtectedLayoutProps = {}) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();
  const [isHydrated, setIsHydrated] = useState(() => useAuthStore.persist?.hasHydrated?.() ?? true);

  useEffect(() => {
    if (useAuthStore.persist?.hasHydrated?.()) {
      setIsHydrated(true);
      return;
    }
    const unsub = useAuthStore.persist?.onFinishHydration?.(() => {
      setIsHydrated(true);
    });
    return () => {
      unsub?.();
    };
  }, []);

  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-100">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    if (location.pathname === redirectTo) {
      return null;
    }
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  const normalizedRole = user?.role?.toUpperCase();
  const roleHome = getRoleHome(normalizedRole, user?.status, user?.onboardingStatus);

  if (
    normalizedRole === USER_ROLES.RESTAURANT_ADMIN ||
    normalizedRole === USER_ROLES.RESTAURANT_OWNER
  ) {
    const isVerifiedOrActive =
      user?.status === USER_STATUS.VERIFIED ||
      user?.status === USER_STATUS.ACTIVE ||
      user?.status === USER_STATUS.APPROVED;

    if (isVerifiedOrActive) {
      // Verified, active or approved restaurant admins can navigate restaurant pages without redirection
    } else if (
      user?.status === USER_STATUS.SUBMITTED ||
      user?.status === USER_STATUS.UNDER_REVIEW ||
      user?.status === USER_STATUS.REJECTED ||
      (user?.onboardingStatus === ONBOARDING_STATUS.COMPLETED &&
        user?.status !== USER_STATUS.VERIFIED)
    ) {
      if (!location.pathname.startsWith(RESTAURANT_ROUTES.ONBOARDING.STATUS)) {
        return <Navigate to={RESTAURANT_ROUTES.ONBOARDING.STATUS} replace />;
      }
    } else if (
      user?.status === USER_STATUS.PENDING &&
      !location.pathname.startsWith(RESTAURANT_ROUTES.ONBOARDING.ROOT)
    ) {
      return <Navigate to={RESTAURANT_ROUTES.ONBOARDING.BUSINESS_INFORMATION} replace />;
    }

    const isRestaurantPath =
      location.pathname === RESTAURANT_ROUTES.ROOT ||
      location.pathname.startsWith(`${RESTAURANT_ROUTES.ROOT}/`);

    if (!isRestaurantPath) {
      if (location.pathname === roleHome) {
        return null;
      }
      return <Navigate to={roleHome} replace />;
    }
  }

  const isAdminPath =
    location.pathname === ADMIN_ROUTES.ROOT ||
    location.pathname.startsWith(`${ADMIN_ROUTES.ROOT}/`);
  if (normalizedRole === USER_ROLES.ADMIN && !isAdminPath) {
    if (location.pathname === roleHome) {
      return null;
    }
    return <Navigate to={roleHome} replace />;
  }

  const isStaffPath =
    location.pathname === STAFF_ROUTES.ROOT ||
    location.pathname.startsWith(`${STAFF_ROUTES.ROOT}/`);
  const isStaffAllowedPath =
    location.pathname === RESTAURANT_ROUTES.ROOT ||
    location.pathname.startsWith(`${RESTAURANT_ROUTES.ROOT}/`);
  if (
    (normalizedRole === USER_ROLES.STAFF || normalizedRole === USER_ROLES.RESTAURANT_STAFF) &&
    !isStaffPath &&
    !isStaffAllowedPath
  ) {
    if (location.pathname === roleHome) {
      return null;
    }
    return <Navigate to={roleHome} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && normalizedRole) {
    const isAllowed = allowedRoles.some((r) => r.toUpperCase() === normalizedRole);
    if (!isAllowed) {
      if (location.pathname === roleHome) {
        return null;
      }
      return <Navigate to={roleHome} state={{ from: location }} replace />;
    }
  }

  return <Outlet />;
}
