/**
 * Hook to update customer profile and keep React Query cache and Auth Store in sync.
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { updateCustomerProfile } from "../services/profile.service";
import type { CustomerProfile, UpdateCustomerProfileDto } from "../types/profile.types";
import { CUSTOMER_PROFILE_QUERY_KEY } from "./use-customer-profile";

export function useUpdateCustomerProfile() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);
  const currentUser = useAuthStore((state) => state.user);

  return useMutation<CustomerProfile, Error, UpdateCustomerProfileDto>({
    mutationFn: updateCustomerProfile,
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(CUSTOMER_PROFILE_QUERY_KEY, updatedProfile);

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
