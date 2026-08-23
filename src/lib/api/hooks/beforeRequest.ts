import type { BeforeRequestHook } from "ky";
import { PUBLIC_AUTH_ENDPOINTS } from "@/features/auth/constants/auth.constants";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { getOrRefreshAccessToken } from "../auth-refresh";

export const beforeRequest: BeforeRequestHook = async ({ request }) => {
  const isPublicAuthEndpoint = PUBLIC_AUTH_ENDPOINTS.some((endpoint) =>
    request?.url?.includes(endpoint),
  );

  if (isPublicAuthEndpoint) {
    return request;
  }

  let token = useAuthStore.getState().accessToken;

  // If token is missing after page refresh but user was authenticated, restore token silently
  if (!token && useAuthStore.getState().isAuthenticated) {
    try {
      token = await getOrRefreshAccessToken();
    } catch {
      useAuthStore.getState().clearAuth();
    }
  }

  if (token) {
    request.headers.set("Authorization", `Bearer ${token}`);
  }

  return request;
};
