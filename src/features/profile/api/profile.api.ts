/**
 * Customer Profile API Client
 */

import { apiClient } from "@/lib/api/client";
import { PROFILE_ENDPOINTS } from "../constants/profile.constants";
import type {
  CustomerProfile,
  CustomerProfileApiResponse,
  UpdateCustomerProfileDto,
} from "../types/profile.types";

export { PROFILE_ENDPOINTS };

/**
 * Fetches the authenticated customer's full profile details from the user service.
 */
export async function getCustomerProfile(): Promise<CustomerProfile> {
  const response = await apiClient
    .get(PROFILE_ENDPOINTS.GET_PROFILE)
    .json<CustomerProfileApiResponse>();

  return response.data;
}

/**
 * Updates the authenticated customer's profile details.
 */
export async function updateCustomerProfile(
  payload: UpdateCustomerProfileDto,
): Promise<CustomerProfile> {
  const response = await apiClient
    .patch(PROFILE_ENDPOINTS.UPDATE_PROFILE, {
      json: payload,
    })
    .json<CustomerProfileApiResponse>();

  return response.data;
}
