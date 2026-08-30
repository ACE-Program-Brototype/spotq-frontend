import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/auth.store";

export interface AuthLayoutProps {
  redirectTo?: string;
}

export default function AuthLayout({ redirectTo }: AuthLayoutProps = {}) {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated) {
    if (user?.role === "ADMIN") {
      return <Navigate to={redirectTo ?? "/admin/dashboard"} replace />;
    }
    if (user?.role === "RESTAURANT_STAFF") {
      return <Navigate to={redirectTo ?? "/staff/dashboard"} replace />;
    }
    if (user?.role === "RESTAURANT_ADMIN") {
      return <Navigate to={redirectTo ?? "/restaurant/dashboard"} replace />;
    }
    return <Navigate to={redirectTo ?? "/"} replace />;
  }

  return <Outlet />;
}
