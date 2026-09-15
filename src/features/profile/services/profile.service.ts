import { apiClient } from "@/lib/api/client";
import { PROFILE_ENDPOINTS } from "../constants/profile.constants";
import type {
  CustomerProfile,
  CustomerProfileApiResponse,
  StaffProfile,
  StaffProfileApiResponse,
  UpdateCustomerProfileDto,
  UpdateStaffProfileDto,
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

  updateStaffProfile: async (
    restaurantId: string,
    staffId: string,
    payload: UpdateStaffProfileDto,
  ): Promise<StaffProfile> => {
    const response = await apiClient
      .patch(PROFILE_ENDPOINTS.UPDATE_STAFF_PROFILE(restaurantId, staffId), {
        json: payload,
      })
      .json<StaffProfileApiResponse>();

    return normalizeStaffProfile(response.data);
  },

  uploadStaffAvatar: async (restaurantId: string, file: File): Promise<string> => {
    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        restaurantId,
      );
    const entityId = isUuid ? restaurantId : "00000000-0000-0000-0000-000000000000";

    const presignedRes = await apiClient
      .post(PROFILE_ENDPOINTS.STORAGE_PRESIGNED_URL, {
        json: {
          entity_type: "restaurants",
          entity_id: entityId,
          file_name: file.name,
          content_type: file.type,
          file_category: "PROFILE",
          file_size: file.size,
        },
      })
      .json<{
        success: boolean;
        data?: { uploadUrl: string; s3ObjectKey: string };
      }>();

    const data = presignedRes.data;
    if (!data?.uploadUrl || !data?.s3ObjectKey) {
      throw new Error("Failed to obtain upload authorization for avatar.");
    }

    const uploadRes = await fetch(data.uploadUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });

    if (!uploadRes.ok) {
      throw new Error("Failed to upload avatar image to storage.");
    }

    return data.s3ObjectKey;
  },
};

export const getCustomerProfile = profileService.getProfile;
export const updateCustomerProfile = profileService.updateProfile;
export const getStaffProfile = profileService.getStaffProfile;
export const updateStaffProfile = profileService.updateStaffProfile;
