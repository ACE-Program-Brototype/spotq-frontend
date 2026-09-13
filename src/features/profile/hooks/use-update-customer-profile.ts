/**
 * Hook to update customer profile and keep React Query cache and Auth Store in sync.
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { PROFILE_QUERY_KEYS } from "../constants/profile.constants";
import { updateCustomerProfile } from "../services/profile.service";
import type { CustomerProfile, UpdateCustomerProfileDto } from "../types/profile.types";

export function useUpdateCustomerProfile() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);
  const currentUser = useAuthStore((state) => state.user);

  return useMutation<CustomerProfile, Error, UpdateCustomerProfileDto>({
    mutationFn: updateCustomerProfile,
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(PROFILE_QUERY_KEYS.CUSTOMER_PROFILE, updatedProfile);

      if (currentUser) {
        setUser({
          ...currentUser,
          name: updatedProfile.full_name,
          fullName: updatedProfile.full_name,
        });
      }
    },
  });
}
