import { useQuery, useQueryClient } from "@tanstack/react-query";
import { HTTPError } from "ky";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { STAFF_ROUTES } from "@/app/router/routes.constants";
import { useAuthStore } from "@/features/auth/store/auth.store";
import {
  PROFILE_MESSAGES,
  PROFILE_QUERY_KEYS,
  profileHooks,
} from "@/features/profile/constants/profile.constants";
import { profileService } from "@/features/profile/services/profile.service";
import type { StaffProfile } from "@/features/profile/types/profile.types";

export function useStaffProfile(options?: {
  retry?: boolean | number | ((failureCount: number, error: Error) => boolean);
}) {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const queryClient = useQueryClient();
  const configuredDefaultRetry = queryClient.getDefaultOptions().queries?.retry;

  const query = useQuery<StaffProfile, Error>({
    queryKey: PROFILE_QUERY_KEYS.STAFF_PROFILE,
    queryFn: profileService.getStaffProfile,
    staleTime: profileHooks.STAFF_PROFILE_STALE_TIME,
    retry: (failureCount, error) => {
      const isUnauthorized =
        (error instanceof HTTPError && error.response?.status === 401) ||
        (error as { status?: number }).status === 401 ||
        /unauthorized/i.test(error.message);

      if (isUnauthorized) {
        return false;
      }
      if (options?.retry !== undefined) {
        return typeof options.retry === "function"
          ? options.retry(failureCount, error)
          : Boolean(options.retry);
      }
      if (configuredDefaultRetry === false || configuredDefaultRetry === 0) {
        return false;
      }
      return failureCount < 2;
    },
  });

  const { error, isError } = query;

  useEffect(() => {
    if (!isError || !error) return;

    const isUnauthorized =
      (error instanceof HTTPError && error.response?.status === 401) ||
      (error as { status?: number }).status === 401 ||
      error.message.includes("401") ||
      /unauthorized/i.test(error.message);

    if (isUnauthorized) {
      clearAuth();
      navigate(STAFF_ROUTES.LOGIN, { replace: true });
    }
  }, [isError, error, clearAuth, navigate]);

  useEffect(() => {
    if (query.data?.fullName && query.data.fullName !== PROFILE_MESSAGES.DEFAULT_NAME) {
      if (user && (user.fullName !== query.data.fullName || user.name !== query.data.fullName)) {
        setUser({
          ...user,
          fullName: query.data.fullName,
          name: query.data.fullName,
        });
      }
    }
  }, [query.data?.fullName, user, setUser]);

  return {
    profile: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
