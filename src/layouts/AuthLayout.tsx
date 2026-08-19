import { Navigate, Outlet } from "react-router-dom";

import { useAuthStore } from "@/features/auth/store/auth.store";

export interface AuthLayoutProps {
  redirectTo?: string;
}

function AuthLayout({ redirectTo = "/" }: AuthLayoutProps = {}) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}

export default AuthLayout;
