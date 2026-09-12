import { type BeforeRetryHook, isHTTPError } from "ky";
import { PUBLIC_AUTH_ENDPOINTS } from "@/features/auth/constants/auth.constants";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { getOrRefreshAccessToken } from "../auth-refresh";
import { redirectToPortalLogin } from "../portal-redirect";

export const beforeRetry: BeforeRetryHook = async ({ request, error, retryCount }) => {
  const isHTTP = isHTTPError(error);
  if (!isHTTP) return;

  const status = error.response.status;
  const is401 = status === 401;

  // Immediate session revocation on account block (403 or 401 with USER_BLOCKED / ACCOUNT_BLOCKED code)
  const errorData = error.data as
    | { code?: string; message?: string; error?: string | { code?: string } }
    | undefined;
  const isBlocked =
    errorData?.code === "USER_BLOCKED" ||
    errorData?.code === "ACCOUNT_BLOCKED" ||
    (typeof errorData?.error === "object" &&
      (errorData?.error?.code === "USER_BLOCKED" || errorData?.error?.code === "ACCOUNT_BLOCKED"));

  if (isBlocked) {
    useAuthStore.getState().clearAuth();
    redirectToPortalLogin();
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
      redirectToPortalLogin();
      throw error;
    }
  }
};
