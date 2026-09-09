import { useQuery } from "@tanstack/react-query";
import { getCustomerProfile } from "../api/profile.api";
import {
  CUSTOMER_PROFILE_QUERY_KEY,
  CUSTOMER_PROFILE_STALE_TIME_MS,
} from "../constants/profile.constants";
import type { CustomerProfile } from "../types/profile.types";

export { CUSTOMER_PROFILE_QUERY_KEY };

/**
 * React Query hook to retrieve and cache the authenticated customer's profile.
 */
export function useCustomerProfile() {
  return useQuery<CustomerProfile, Error>({
    queryKey: CUSTOMER_PROFILE_QUERY_KEY,
    queryFn: getCustomerProfile,
    staleTime: CUSTOMER_PROFILE_STALE_TIME_MS,
  });
}
