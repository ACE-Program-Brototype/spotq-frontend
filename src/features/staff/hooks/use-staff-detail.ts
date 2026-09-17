import { useQuery, useQueryClient } from "@tanstack/react-query";
import { HTTPError } from "ky";
import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { staffDetailService } from "@/features/staff/services/staff-detail.service";
import type { StaffDetail } from "@/features/staff/types/staff-detail.types";

export const STAFF_DETAIL_QUERY_KEY = "restaurant-staff-detail" as const;

export function useStaffDetail() {
  const { staffId = "" } = useParams<{ staffId: string }>();

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, clearAuth } = useAuthStore();

  const authRestaurantId = user?.restaurantId ?? "";
  const hasRestaurantAccess = Boolean(authRestaurantId);

  const queryKey = useMemo(
    () => [STAFF_DETAIL_QUERY_KEY, authRestaurantId, staffId],
    [authRestaurantId, staffId],
  );

  const query = useQuery<StaffDetail, Error>({
    queryKey,
    queryFn: () => staffDetailService.getStaffDetail(authRestaurantId, staffId),
    enabled: Boolean(hasRestaurantAccess && staffId),

    retry: (failureCount, error) => {
      const configuredDefaultRetry = queryClient.getDefaultOptions().queries?.retry;
      if (configuredDefaultRetry === false || configuredDefaultRetry === 0) {
        return false;
      }

      const status =
        error instanceof HTTPError ? error.response?.status : (error as { status?: number }).status;

      if (status === 401 || status === 403 || status === 404) {
        return false;
      }
      return failureCount < 2;
    },
  });

  const { data: staff, isLoading, isPending, isFetching, isError, error, refetch } = query;

  const errorStatus =
    error instanceof HTTPError ? error.response?.status : (error as { status?: number })?.status;

  const isUnauthorized = errorStatus === 401;
  const isForbidden = !hasRestaurantAccess || errorStatus === 403;
  const isNotFound = errorStatus === 404;

  // Handle 401 Unauthorized redirect
  useEffect(() => {
    if (isUnauthorized) {
      clearAuth();
      navigate("/restaurant/email/verification", { replace: true });
    }
  }, [isUnauthorized, clearAuth, navigate]);

  return {
    staff,
    isLoading,
    isPending,
    isFetching,
    isError,
    error,
    isForbidden,
    isNotFound,
    refetch,
  };
}
