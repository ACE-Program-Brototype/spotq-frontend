import { type BeforeRetryHook, isHTTPError } from "ky";
import { PUBLIC_AUTH_ENDPOINTS } from "@/features/auth/constants/auth.constants";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { getOrRefreshAccessToken } from "../auth-refresh";

export const beforeRetry: BeforeRetryHook = async ({ request, error, retryCount }) => {
  const isHTTP = isHTTPError(error);
  if (!isHTTP) return;

  const status = error.response.status;
  const is401 = status === 401;

  // Immediate session revocation on account block (403 or 401 with USER_BLOCKED / blocked message)
  const errorData = error.data as { code?: string; message?: string; error?: string } | undefined;
  const isBlocked =
    errorData?.code === "USER_BLOCKED" ||
    errorData?.code === "ACCOUNT_BLOCKED" ||
    (typeof errorData?.message === "string" && /blocked|suspended/i.test(errorData.message)) ||
    (typeof errorData?.error === "string" && /blocked|suspended/i.test(errorData.error));

  if (isBlocked) {
    useAuthStore.getState().clearAuth();
    if (typeof window !== "undefined" && window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
    throw error;
  }

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
