import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { getRoleHome } from "@/features/auth/utils/auth.helpers";

export interface AuthLayoutProps {
  redirectTo?: string;
}

export default function AuthLayout({ redirectTo }: AuthLayoutProps = {}) {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated) {
    const roleHome = getRoleHome(user?.role);
    return <Navigate to={redirectTo && user?.role === "ADMIN" ? redirectTo : roleHome} replace />;
  }

  return <Outlet />;
}
