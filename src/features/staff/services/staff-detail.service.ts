import { STAFF_DEFAULTS, STAFF_ENDPOINTS } from "@/features/staff/constants/staff.constants";
import type {
  StaffDetail,
  StaffDetailApiResponse,
  StaffDetailRawData,
  StaffStatus,
  UpdateStaffInfoPayload,
} from "@/features/staff/types/staff-detail.types";
import { apiClient } from "@/lib/api/client";

/**
 * Normalizes raw API staff detail data into a consistent domain model.
 */
export function normalizeStaffDetail(
  raw?: StaffDetailRawData | null,
  fallbackRestaurantId = "",
): StaffDetail {
  if (!raw) {
    return {
      id: "",
      restaurantId: fallbackRestaurantId,
      fullName: STAFF_DEFAULTS.NAME,
      email: "",
      phone: null,
      avatarUrl: null,
      role: STAFF_DEFAULTS.ROLE,
      status: STAFF_DEFAULTS.STATUS,
      createdAt: null,
      updatedAt: null,
    };
  }

  return {
    id: raw.id || "",
    restaurantId: raw.restaurantId || raw.restaurant_id || fallbackRestaurantId,
    fullName: raw.fullname || raw.fullName || STAFF_DEFAULTS.NAME,
    email: raw.email || "",
    phone: raw.phone || raw.phoneNumber || null,
    avatarUrl: raw.avatarUrl || raw.avatar_url || null,
    role: raw.role || STAFF_DEFAULTS.ROLE,
    status: (raw.status || STAFF_DEFAULTS.STATUS).toUpperCase(),
    createdAt: raw.createdAt || raw.created_at || null,
    updatedAt: raw.updatedAt || raw.updated_at || null,
  };
}

export const staffDetailService = {
  /**
   * Fetch detailed information of a staff member by restaurant and staff ID
   */
  async getStaffDetail(restaurantId: string, staffId: string): Promise<StaffDetail> {
    const response = await apiClient
      .get(STAFF_ENDPOINTS.STAFF_DETAIL_BY_RESTAURANT(restaurantId, staffId))
      .json<StaffDetailApiResponse>();

    return normalizeStaffDetail(response?.data, restaurantId);
  },

  /**
   * Update staff member's basic information (name, phone)
   */
  async updateStaffInfo(
    restaurantId: string,
    staffId: string,
    payload: UpdateStaffInfoPayload,
  ): Promise<StaffDetail> {
    const response = await apiClient
      .patch(STAFF_ENDPOINTS.STAFF_DETAIL_BY_RESTAURANT(restaurantId, staffId), {
        json: payload,
      })
      .json<StaffDetailApiResponse>();

    return normalizeStaffDetail(response?.data, restaurantId);
  },

  /**
   * Update staff account status (ACTIVE/INACTIVE) under SCRUM-64
   */
  async updateStaffStatus(
    restaurantId: string,
    staffId: string,
    status: StaffStatus,
  ): Promise<StaffDetail> {
    const response = await apiClient
      .patch(STAFF_ENDPOINTS.STAFF_STATUS(restaurantId, staffId), {
        json: { status },
      })
      .json<StaffDetailApiResponse>();

    return normalizeStaffDetail(response?.data, restaurantId);
  },

  /**
   * Remove a staff member belonging to the restaurant
   */
  async deleteStaff(restaurantId: string, staffId: string): Promise<void> {
    await apiClient.delete(STAFF_ENDPOINTS.STAFF_DELETE(restaurantId, staffId)).json();
  },
};
