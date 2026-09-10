import { type BeforeRetryHook, isHTTPError } from "ky";
import { PUBLIC_AUTH_ENDPOINTS } from "@/features/auth/constants/auth.constants";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { getOrRefreshAccessToken } from "../auth-refresh";

export const beforeRetry: BeforeRetryHook = async ({ request, error, retryCount }) => {
  const is401 = isHTTPError(error) && error.response.status === 401;
  const isPublicAuthEndpoint = PUBLIC_AUTH_ENDPOINTS.some((endpoint) =>
    request?.url?.includes(endpoint),
  );

  if (is401) {
    if (isPublicAuthEndpoint || retryCount > 1) {
      throw error;
    }

    try {
      const newAccessToken = await getOrRefreshAccessToken();
      request.headers.set("Authorization", `Bearer ${newAccessToken}`);
    } catch {
      useAuthStore.getState().clearAuth();

      if (typeof window !== "undefined") {
        const path = window.location.pathname;
        const isAdminRoute = path.startsWith("/admin");
        const isStaffRoute = path.startsWith("/staff");
        const isRestaurantRoute = path.startsWith("/restaurant");

        if (isAdminRoute && path !== "/admin/login") {
          window.location.href = "/admin/login";
        } else if (isStaffRoute && path !== "/staff/login") {
          window.location.href = "/staff/login";
        } else if (
          isRestaurantRoute &&
          !path.startsWith("/restaurant/email") &&
          !path.startsWith("/restaurant/otp") &&
          !path.startsWith("/restaurant/onboarding")
        ) {
          window.location.href = "/restaurant/email/verification";
        } else if (!isAdminRoute && !isStaffRoute && !isRestaurantRoute && path !== "/login") {
          window.location.href = "/login";
        }
      }

      throw error;
    }
  }
};
