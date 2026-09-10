import { useQuery } from "@tanstack/react-query";
import { PROFILE_QUERY_KEYS, profileHooks } from "../constants/profile.constants";
import { getCustomerProfile } from "../services/profile.service";
import type { CustomerProfile } from "../types/profile.types";

export const CUSTOMER_PROFILE_QUERY_KEY = PROFILE_QUERY_KEYS.CUSTOMER_PROFILE;

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
