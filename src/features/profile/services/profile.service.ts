import { apiClient } from "@/lib/api/client";
import { PROFILE_ENDPOINTS } from "../constants/profile.constants";
import type {
  CustomerProfile,
  CustomerProfileApiResponse,
  StaffProfile,
  StaffProfileApiResponse,
  UpdateCustomerProfileDto,
} from "../types/profile.types";
import { normalizeStaffProfile } from "../utils/profile.utils";

export const profileService = {
  // Customer Profile
  getProfile: async (): Promise<CustomerProfile> => {
    const response = await apiClient
      .get(PROFILE_ENDPOINTS.GET_PROFILE)
      .json<CustomerProfileApiResponse>();

    return response.data;
  },

  updateProfile: async (payload: UpdateCustomerProfileDto): Promise<CustomerProfile> => {
    const response = await apiClient
      .patch(PROFILE_ENDPOINTS.UPDATE_PROFILE, {
        json: payload,
      })
      .json<CustomerProfileApiResponse>();

    return response.data;
  },

  // Staff Profile
  getStaffProfile: async (): Promise<StaffProfile> => {
    const response = await apiClient
      .get(PROFILE_ENDPOINTS.GET_STAFF_PROFILE)
      .json<StaffProfileApiResponse>();

    return normalizeStaffProfile(response.data);
  },
};

export const getCustomerProfile = profileService.getProfile;
export const updateCustomerProfile = profileService.updateProfile;
