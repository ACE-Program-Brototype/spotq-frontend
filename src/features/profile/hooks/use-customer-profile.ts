import { useQuery } from "@tanstack/react-query";
import { getCustomerProfile } from "../api/profile.api";
import type { CustomerProfile } from "../types/profile.types";

export const CUSTOMER_PROFILE_QUERY_KEY = ["customer-profile"] as const;

/**
 * React Query hook to retrieve and cache the authenticated customer's profile.
 */
export function useCustomerProfile() {
  return useQuery<CustomerProfile, Error>({
    queryKey: CUSTOMER_PROFILE_QUERY_KEY,
    queryFn: getCustomerProfile,
    staleTime: 5 * 60 * 1000,
  });
}
