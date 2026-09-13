import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/auth.store";
import type { Role } from "@/features/auth/types/auth.types";
import { getRoleHome } from "@/features/auth/utils/auth.helpers";

export interface ProtectedLayoutProps {
  allowedRoles?: Role[];
  redirectTo?: string;
}

export default function ProtectedLayout({
  allowedRoles,
  redirectTo = "/login",
}: ProtectedLayoutProps = {}) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    if (location.pathname === redirectTo) {
      return null;
    }
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  const roleHome = getRoleHome(user?.role, user?.status, user?.onboardingStatus);

  if (user?.role === "RESTAURANT_ADMIN") {
    if (user.onboardingStatus === "COMPLETED" || user.status === "UNDER_REVIEW") {
      if (
        !location.pathname.startsWith("/restaurant/onboarding/status") &&
        !location.pathname.startsWith("/restaurant/dashboard") &&
        !location.pathname.startsWith("/restaurant/subscription")
      ) {
        return <Navigate to="/restaurant/onboarding/status" replace />;
      }
    } else if (
      user.status === "PENDING" &&
      !location.pathname.startsWith("/restaurant/onboarding")
    ) {
      return <Navigate to="/restaurant/onboarding/business-information" replace />;
    }

    if (!location.pathname.startsWith("/restaurant")) {
      if (location.pathname === roleHome) {
        return null;
      }
      return <Navigate to={roleHome} replace />;
    }
  }

  if (user?.role === "ADMIN" && !location.pathname.startsWith("/admin")) {
    if (location.pathname === roleHome) {
      return null;
    }
    return <Navigate to={roleHome} replace />;
  }

  if (
    user?.role === "RESTAURANT_STAFF" &&
    !location.pathname.startsWith("/staff") &&
    !location.pathname.startsWith("/restaurant")
  ) {
    if (location.pathname === roleHome) {
      return null;
    }
    return <Navigate to={roleHome} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && user?.role) {
    if (!allowedRoles.includes(user.role)) {
      if (location.pathname === roleHome) {
        return null;
      }
      return <Navigate to={roleHome} state={{ from: location }} replace />;
    }
  }

  return <Outlet />;
}
