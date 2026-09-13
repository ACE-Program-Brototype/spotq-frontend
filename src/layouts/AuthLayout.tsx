import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { getRoleHome } from "@/features/auth/utils/auth.helpers";

export interface AuthLayoutProps {
  redirectTo?: string;
}

export default function AuthLayout({ redirectTo }: AuthLayoutProps = {}) {
  const { isAuthenticated, user } = useAuthStore();
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

  if (isAuthenticated) {
    const roleHome = getRoleHome(user?.role, user?.status, user?.onboardingStatus);
    return <Navigate to={redirectTo && user?.role === "ADMIN" ? redirectTo : roleHome} replace />;
  }

  return <Outlet />;
}
