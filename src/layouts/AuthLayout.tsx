import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/auth.store";

export interface AuthLayoutProps {
  redirectTo?: string;
}

export default function AuthLayout({ redirectTo }: AuthLayoutProps = {}) {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to={redirectTo ?? "/"} replace />;
  }

  return <Outlet />;
}
