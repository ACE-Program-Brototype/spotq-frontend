import ky from "ky";

import { AUTH_ENDPOINTS } from "@/features/auth/constants/auth.constants";
import { useAuthStore } from "@/features/auth/store/auth.store";
import type { ApiUser } from "@/features/auth/types/auth.types";
import { mapApiUserToUser } from "@/features/auth/utils/auth.mapper";

let refreshPromise: Promise<string> | null = null;

export const getOrRefreshAccessToken = async (): Promise<string> => {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    const API_URL = import.meta.env.VITE_API_BASE_URL;

    if (!API_URL) {
      throw new Error("VITE_API_BASE_URL is not configured.");
    }

    const currentUser = useAuthStore.getState().user;
    const currentRole = currentUser?.role;

    let refreshEndpoint: string;

    switch (currentRole) {
      case "RESTAURANT_ADMIN":
        refreshEndpoint = AUTH_ENDPOINTS.RESTAURANT_REFRESH_TOKEN;
        break;

      case "RESTAURANT_STAFF":
        refreshEndpoint = AUTH_ENDPOINTS.STAFF_REFRESH_TOKEN;
        break;

      default:
        refreshEndpoint = AUTH_ENDPOINTS.REFRESH_TOKEN;
        break;
    }

    const response = await ky
      .post(refreshEndpoint, {
        prefix: API_URL,
        credentials: "include",
      })
      .json<{
        data?: {
          access_token?: string;
          accessToken?: string;
          user?: ApiUser;
        };
      }>();

    const newAccessToken = response.data?.accessToken || response.data?.access_token;

    if (!newAccessToken) {
      throw new Error("No access token returned from refresh endpoint.");
    }

    const mappedUser = response.data?.user ? mapApiUserToUser(response.data.user) : null;
    const user = mappedUser
      ? {
          ...mappedUser,
          role: currentRole ?? mappedUser.role,
        }
      : currentUser;

    if (user) {
      useAuthStore.getState().setAuth(user, newAccessToken);
    }

    return newAccessToken;
  })().finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
};
