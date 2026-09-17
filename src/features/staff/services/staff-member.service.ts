import { STAFF_ENDPOINTS } from "@/features/staff/constants/staff.constants";
import type {
  StaffInvitationPagination,
  StaffMember,
} from "@/features/staff/types/staff-invitation.types";
import { apiClient } from "@/lib/api/client";

export type ListStaffMembersParams = {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  sortBy?: "createdAt";
  sortOrder?: "ASC" | "DESC" | "asc" | "desc";
};

export type StaffMemberResponseItem = {
  id: string;
  fullname: string;
  email: string;
  status: string;
  phone?: string;
  role?: string;
  createdAt?: string;
};

export const staffMemberService = {
  /**
   * Fetch paginated list of staff members for a restaurant
   */
  async getStaffMembers(
    restaurantId: string,
    params?: ListStaffMembersParams,
  ): Promise<{
    success: boolean;
    message: string;
    data: StaffMember[];
    pagination: StaffInvitationPagination;
  }> {
    if (!restaurantId) {
      return {
        success: false,
        message: "Restaurant ID is required",
        data: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPrevPage: false,
        },
      };
    }

    const searchParams: Record<string, string | number> = {};
    if (params?.page) searchParams.page = params.page;
    if (params?.limit) searchParams.limit = params.limit;
    if (params?.status && params.status !== "ALL") searchParams.status = params.status;
    if (params?.search) searchParams.search = params.search;
    if (params?.sortBy) searchParams.sortBy = params.sortBy;
    if (params?.sortOrder) searchParams.sortOrder = params.sortOrder;

    const endpoint = STAFF_ENDPOINTS.STAFF_LIST_BY_RESTAURANT(restaurantId);

    const raw = await apiClient
      .get(endpoint, {
        searchParams: Object.keys(searchParams).length > 0 ? searchParams : undefined,
        headers: {
          "x-restaurant-id": restaurantId,
        },
      })
      .json<{
        success?: boolean;
        message?: string;
        data?: StaffMemberResponseItem[];
        pagination?: StaffInvitationPagination;
      }>();

    const rawItems = Array.isArray(raw.data) ? raw.data : [];
    const staffMembers: StaffMember[] = rawItems.map((item) => ({
      id: item.id,
      name: item.fullname || "Staff Member",
      email: item.email || "",
      phone: item.phone || "-",
      designation: item.role || "Staff",
      status: (item.status?.toUpperCase() as "ACTIVE" | "INACTIVE" | "PENDING") || "ACTIVE",
      joinedDate: item.createdAt || new Date().toISOString(),
      lastLogin: item.createdAt || new Date().toISOString(),
      employeeCode: `EMP-${item.id.slice(-6).toUpperCase()}`,
    }));

    const defaultLimit = params?.limit || 20;
    const pagination: StaffInvitationPagination = raw.pagination || {
      page: params?.page || 1,
      limit: defaultLimit,
      total: staffMembers.length,
      totalPages:
        Math.ceil(staffMembers.length / defaultLimit) || (staffMembers.length > 0 ? 1 : 0),
      hasNextPage: false,
      hasPrevPage: false,
    };

    return {
      success: raw.success ?? true,
      message: raw.message || "Staff members retrieved successfully",
      data: staffMembers,
      pagination,
    };
  },
};
