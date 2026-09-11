import { useMutation, useQueryClient } from "@tanstack/react-query";
import { HTTPError } from "ky";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { PROFILE_QUERY_KEYS } from "../constants/profile.constants";
import { profileService } from "../services/profile.service";
import type { StaffProfile, UpdateStaffProfileDto } from "../types/profile.types";

interface UpdateStaffProfileParams {
  restaurantId: string;
  staffId: string;
  payload: UpdateStaffProfileDto;
}

export function useUpdateStaffProfile() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation<StaffProfile, Error, UpdateStaffProfileParams>({
    mutationFn: ({ restaurantId, staffId, payload }) =>
      profileService.updateStaffProfile(restaurantId, staffId, payload),

    onSuccess: (updatedProfile) => {
      // 1. Immediately update TanStack Query cache
      queryClient.setQueryData(PROFILE_QUERY_KEYS.STAFF_PROFILE, updatedProfile);
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEYS.STAFF_PROFILE });

      // 2. Synchronize user state in AuthStore if user is logged in
      if (user) {
        setUser({
          ...user,
          name: updatedProfile.fullName,
          fullName: updatedProfile.fullName,
          phone: updatedProfile.phone || undefined,
        });
      }
    },

    onError: (error) => {
      const isUnauthorized =
        (error instanceof HTTPError && error.response?.status === 401) ||
        (error as { status?: number }).status === 401 ||
        /unauthorized/i.test(error.message);

      if (isUnauthorized) {
        clearAuth();
        navigate("/staff/login", { replace: true });
      }
    },
  });
}
