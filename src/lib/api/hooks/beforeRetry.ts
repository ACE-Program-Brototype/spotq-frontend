import ky, { type BeforeRetryHook, HTTPError } from "ky";
import { AUTH_ENDPOINTS } from "@/features/auth/constants/auth.constants";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { getOrRefreshAccessToken } from "../auth-refresh";

export const beforeRetry: BeforeRetryHook = async ({ request, error, retryCount }) => {
  const is401 = error instanceof HTTPError && error.response.status === 401;
  const isAuthEndpoint =
    request.url.includes(AUTH_ENDPOINTS.LOGIN) ||
    request.url.includes(AUTH_ENDPOINTS.REFRESH_TOKEN);

  // If unauthorized on a protected endpoint, refresh token on first retry
  if (is401 && !isAuthEndpoint && retryCount === 1) {
    try {
      const newAccessToken = await getOrRefreshAccessToken();
      request.headers.set("Authorization", `Bearer ${newAccessToken}`);
    } catch {
      useAuthStore.getState().clearAuth();

      if (typeof window !== "undefined" && window.location.pathname !== "/login") {
        window.location.href = "/login";
      }

      return ky.stop as ReturnType<BeforeRetryHook>;
    }
  }
};
