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
    // Never retry public auth routes (e.g. customer login, admin login, google login, refresh token) on 401
    // Throw error to propagate HTTPError directly to caller
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

        if (isAdminRoute && path !== "/admin/login") {
          window.location.href = "/admin/login";
        } else if (!isAdminRoute && path !== "/login") {
          window.location.href = "/login";
        }
      }

      throw error;
    }
  }
};
