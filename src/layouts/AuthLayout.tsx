import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/auth.store";

export interface AuthLayoutProps {
  redirectTo?: string;
}

export default function AuthLayout({ redirectTo }: AuthLayoutProps = {}) {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated) {
    // If the logged-in user is an ADMIN, send to /admin/dashboard (or admin custom redirect).
    // If the logged-in user is a CUSTOMER, always redirect to customer home /
    const destination = user?.role === "ADMIN" ? (redirectTo ?? "/admin/dashboard") : "/";
    return <Navigate to={destination} replace />;
  }

  return <Outlet />;
}
