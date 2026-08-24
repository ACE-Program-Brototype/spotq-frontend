import { type BeforeRetryHook, isHTTPError } from "ky";
import { PUBLIC_AUTH_ENDPOINTS } from "@/features/auth/constants/auth.constants";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { getOrRefreshAccessToken } from "../auth-refresh";

export const beforeRetry: BeforeRetryHook = async ({ request, error, retryCount }) => {
  const is401 = isHTTPError(error) && error.response.status === 401;
  const isPublicAuthEndpoint = PUBLIC_AUTH_ENDPOINTS.some((endpoint) =>
    request.url.includes(endpoint),
  );

  if (is401) {
    // Never retry public auth routes (e.g. login, google login, refresh token) on 401
    // Throw error to propagate HTTPError with parsed error.data directly to caller
    if (isPublicAuthEndpoint || retryCount > 1) {
      throw error;
    }

    try {
      const newAccessToken = await getOrRefreshAccessToken();
      request.headers.set("Authorization", `Bearer ${newAccessToken}`);
    } catch {
      useAuthStore.getState().clearAuth();

      if (typeof window !== "undefined" && window.location.pathname !== "/login") {
        window.location.href = "/login";
      }

      throw error;
    }
  }
};
