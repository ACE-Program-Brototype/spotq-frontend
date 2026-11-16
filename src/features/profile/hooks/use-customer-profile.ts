import { useQuery } from "@tanstack/react-query";
import { PROFILE_QUERY_KEYS, profileHooks } from "@/features/profile/constants/profile.constants";
import { getCustomerProfile } from "@/features/profile/services/profile.service";
import type { CustomerProfile } from "@/features/profile/types/profile.types";

/**
 * React Query hook to retrieve and cache the authenticated customer's profile.
 */
export function useCustomerProfile() {
  return useQuery<CustomerProfile, Error>({
    queryKey: PROFILE_QUERY_KEYS.CUSTOMER_PROFILE,
    queryFn: getCustomerProfile,
    staleTime: profileHooks.CUSTOMER_PROFILE_STALE_TIME,
  });
}
