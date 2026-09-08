import { apiClient } from "@/lib/api/client";
import type { CustomerProfile, CustomerProfileApiResponse } from "../types/profile.types";

export const PROFILE_ENDPOINTS = {
  GET_PROFILE: "users/profile",
} as const;

/**
 * Fetches the authenticated customer's full profile details from the user service.
 */
export async function getCustomerProfile(): Promise<CustomerProfile> {
  const response = await apiClient
    .get(PROFILE_ENDPOINTS.GET_PROFILE)
    .json<CustomerProfileApiResponse>();

  return response.data;
}
