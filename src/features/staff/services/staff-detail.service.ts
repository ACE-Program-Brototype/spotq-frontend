import { STAFF_ENDPOINTS } from "@/features/staff/constants/staff.constants";
import type {
  StaffDetail,
  StaffDetailApiResponse,
  StaffDetailRawData,
  StaffStatus,
} from "@/features/staff/types/staff-detail.types";
import { apiClient } from "@/lib/api/client";

/**
 * Normalizes raw API staff detail data into a consistent domain model.
 */
export function normalizeStaffDetail(
  raw: StaffDetailRawData,
  fallbackRestaurantId = "",
): StaffDetail {
  return {
    id: raw.id,
    restaurantId: raw.restaurantId || raw.restaurant_id || fallbackRestaurantId,
    fullName: raw.fullname || raw.fullName || "Staff Member",
    email: raw.email || "",
    phone: raw.phone || raw.phoneNumber || null,
    avatarUrl: raw.avatarUrl || raw.avatar_url || null,
    role: raw.role || "Staff",
    status: (raw.status || "ACTIVE").toUpperCase(),
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

    return normalizeStaffDetail(response.data, restaurantId);
  },
};
