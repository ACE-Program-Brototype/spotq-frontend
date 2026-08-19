import type { AfterResponseHook } from "ky";
import ky from "ky";
import { AUTH_ENDPOINTS } from "../../../features/auth/constants/auth.constants";
import { useAuthStore } from "../../../features/auth/store/auth.store";
import type { User } from "../../../features/auth/types/auth.types";

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token: string) => {
  for (const cb of refreshSubscribers) {
    cb(token);
  }
  refreshSubscribers = [];
};

export const afterResponse: AfterResponseHook = async ({ request, response }) => {
  // If the request failed with 401 and it's not the login or refresh request itself
  if (
    response.status === 401 &&
    !request.url.includes(AUTH_ENDPOINTS.LOGIN) &&
    !request.url.includes("refresh-token")
  ) {
    if (!isRefreshing) {
      isRefreshing = true;

      try {
        const rawApiUrl = import.meta.env.VITE_API_BASE_URL;
        if (!rawApiUrl) {
          throw new Error("VITE_API_BASE_URL is not configured.");
        }

        const API_URL = /^\d+$/.test(rawApiUrl) ? `http://localhost:${rawApiUrl}` : rawApiUrl;

        // Call the refresh endpoint to obtain a new access token
        const refreshResponse = await ky
          .post(`${API_URL}/${AUTH_ENDPOINTS.REFRESH_TOKEN}`, {
            credentials: "include",
          })
          .json<{ data: { access_token: string; user: unknown } }>();

        const newAccessToken = refreshResponse.data.access_token;
        const user = refreshResponse.data.user as User;

        // Update the auth store
        useAuthStore.getState().setAuth(user, newAccessToken);

        isRefreshing = false;
        onRefreshed(newAccessToken);
      } catch {
        isRefreshing = false;
        // On refresh failure, clear auth and redirect to /login
        useAuthStore.getState().clearAuth();

        if (typeof window !== "undefined" && window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        return response;
      }
    }

    // Wait for the token refresh to complete and retry the request
    return new Promise((resolve) => {
      subscribeTokenRefresh((token) => {
        const newHeaders = new Headers(request.headers);
        newHeaders.set("Authorization", `Bearer ${token}`);
        // Retry the request using custom fetch options/headers
        resolve(ky(request, { headers: newHeaders }));
      });
    });
  }

  return response;
};
