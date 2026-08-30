import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/auth.store";
import type { Role } from "@/features/auth/types/auth.types";

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

  // If a logged-in admin accesses customer-protected routes (like /), redirect directly to /admin/dashboard
  if (user?.role === "ADMIN" && !location.pathname.startsWith("/admin")) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (user?.role === "RESTAURANT_STAFF" && !location.pathname.startsWith("/staff")) {
    return <Navigate to="/staff/dashboard" replace />;
  }

  // Check role authorization
  if (allowedRoles && allowedRoles.length > 0 && user?.role) {
    if (!allowedRoles.includes(user.role)) {
      // If customer tries to access admin-only routes, redirect to customer home /
      const fallback = user.role === "CUSTOMER" ? "/" : redirectTo;
      if (location.pathname === fallback) {
        return null;
      }
      return <Navigate to={fallback} state={{ from: location }} replace />;
    }
  }

  return <Outlet />;
}
