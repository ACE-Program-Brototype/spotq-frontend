import { apiClient } from "@/lib/api/client";
import { PROFILE_ENDPOINTS } from "../constants/profile.constants";
import type { StaffProfile, StaffProfileApiResponse } from "../types/profile.types";
import { normalizeStaffProfile } from "../utils/profile.utils";

export const profileService = {
  getStaffProfile: async (): Promise<StaffProfile> => {
    const response = await apiClient
      .get(PROFILE_ENDPOINTS.GET_STAFF_PROFILE)
      .json<StaffProfileApiResponse>();

    return normalizeStaffProfile(response.data);
  },
};
