import { useEffect, useState } from "react";
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

  if (normalizedRole === "RESTAURANT_ADMIN") {
    const isVerifiedOrActive =
      user?.status === "VERIFIED" || user?.status === "ACTIVE" || user?.status === "APPROVED";

    if (isVerifiedOrActive) {
      // Verified, active or approved restaurant admins can navigate restaurant pages without redirection
    } else if (
      user?.status === "SUBMITTED" ||
      user?.status === "UNDER_REVIEW" ||
      user?.status === "REJECTED" ||
      (user?.onboardingStatus === "COMPLETED" && user?.status !== "VERIFIED")
    ) {
      if (
        !location.pathname.startsWith("/restaurant/onboarding/status") &&
        !location.pathname.startsWith("/restaurant/onboarding/verification-status")
      ) {
        return <Navigate to="/restaurant/onboarding/status" replace />;
      }
    } else if (
      user?.status === "PENDING" &&
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

  if (normalizedRole === "ADMIN" && !location.pathname.startsWith("/admin")) {
    if (location.pathname === roleHome) {
      return null;
    }
    return <Navigate to={roleHome} replace />;
  }

  if (
    (normalizedRole === "STAFF" || normalizedRole === "RESTAURANT_STAFF") &&
    !location.pathname.startsWith("/staff") &&
    !location.pathname.startsWith("/restaurant")
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
