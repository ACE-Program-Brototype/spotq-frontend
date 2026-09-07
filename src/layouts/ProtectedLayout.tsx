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

  const roleHome = getRoleHome(user?.role);

  if (user?.role === "RESTAURANT_ADMIN" && !location.pathname.startsWith("/restaurant")) {
    if (location.pathname === roleHome) {
      return null;
    }
    return <Navigate to={roleHome} replace />;
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
