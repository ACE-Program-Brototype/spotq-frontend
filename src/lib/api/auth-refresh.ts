import ky from "ky";
import { AUTH_ENDPOINTS } from "@/features/auth/constants/auth.constants";
import { useAuthStore } from "@/features/auth/store/auth.store";
import type { ApiUser } from "@/features/auth/types/auth.types";
import { mapApiUserToUser } from "@/features/auth/utils/auth.mapper";

let refreshPromise: Promise<string> | null = null;

/**
 * Singleton Mutex Promise Lock for Token Refresh.
 * Ensures that if multiple concurrent requests encounter 401,
 * only a single network call is made to the refresh endpoint.
 */
export const getOrRefreshAccessToken = async (): Promise<string> => {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    const rawApiUrl = import.meta.env.VITE_API_BASE_URL;
    if (!rawApiUrl) {
      throw new Error("VITE_API_BASE_URL is not configured.");
    }

    const API_URL = /^\d+$/.test(rawApiUrl) ? `http://localhost:${rawApiUrl}` : rawApiUrl;

    const response = await ky
      .post(`${API_URL}/${AUTH_ENDPOINTS.REFRESH_TOKEN}`, {
        credentials: "include",
      })
      .json<{ data: { access_token: string; user: ApiUser } }>();

    const newAccessToken = response.data.access_token;
    const user = mapApiUserToUser(response.data.user);

    useAuthStore.getState().setAuth(user, newAccessToken);
    return newAccessToken;
  })().finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
};
