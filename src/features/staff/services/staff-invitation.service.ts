import type { ApiResponse } from "@/features/auth/services/auth.service";
import { STAFF_ENDPOINTS, STAFF_MESSAGES } from "@/features/staff/constants/staff.constants";
import type {
  ResendStaffInvitationInput,
  RevokeStaffInvitationInput,
  SendStaffInvitationInput,
  StaffInvitation,
  StaffInvitationPagination,
  StaffInvitationSortBy,
  StaffInvitationSortOrder,
} from "@/features/staff/types/staff-invitation.types";
import { apiClient } from "@/lib/api/client";

export const staffInvitationService = {
  /**
   * Send a new staff invitation email
   */
  async sendInvitation(data: SendStaffInvitationInput): Promise<ApiResponse<StaffInvitation>> {
    return apiClient
      .post(STAFF_ENDPOINTS.INVITATIONS, {
        json: { email: data.email },
      })
      .json<ApiResponse<StaffInvitation>>();
  },

  /**
   * Resend an existing staff invitation email
   */
  async resendInvitation(data: ResendStaffInvitationInput): Promise<ApiResponse<StaffInvitation>> {
    return apiClient
      .post(STAFF_ENDPOINTS.INVITATIONS_RESEND, {
        json: { email: data.email },
      })
      .json<ApiResponse<StaffInvitation>>();
  },

  /**
   * Revoke an active/pending staff invitation
   */
  async revokeInvitation(data: RevokeStaffInvitationInput): Promise<ApiResponse> {
    return apiClient
      .post(STAFF_ENDPOINTS.INVITATIONS_REVOKE, {
        json: {
          invitationId: data.invitationId,
          ...(data.email ? { email: data.email } : {}),
        },
      })
      .json<ApiResponse>();
  },

  /**
   * Fetch all staff invitations for the restaurant
   */
  async getInvitations(params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
    sortBy?: StaffInvitationSortBy;
    sortOrder?: StaffInvitationSortOrder;
  }): Promise<
    ApiResponse<{
      invitations: StaffInvitation[];
      pagination?: StaffInvitationPagination;
    }>
  > {
    const searchParams: Record<string, string | number> = {};
    if (params?.page) searchParams.page = params.page;
    if (params?.limit) searchParams.limit = params.limit;
    if (params?.status && params.status !== "ALL") searchParams.status = params.status;
    if (params?.search) searchParams.search = params.search;
    if (params?.sortBy) searchParams.sortBy = params.sortBy;
    if (params?.sortOrder) searchParams.sortOrder = params.sortOrder;

    const raw = await apiClient
      .get(STAFF_ENDPOINTS.INVITATIONS, {
        searchParams: Object.keys(searchParams).length > 0 ? searchParams : undefined,
      })
      .json<{
        success?: boolean;
        message?: string;
        data?:
          | {
              invitations?: StaffInvitation[];
              pagination?: StaffInvitationPagination;
            }
          | StaffInvitation[];
      }>();

    const invitations: StaffInvitation[] = Array.isArray(raw.data)
      ? raw.data
      : raw.data?.invitations || [];

    const pagination = Array.isArray(raw.data) ? undefined : raw.data?.pagination;

    return {
      success: raw.success ?? true,
      message: raw.message ?? STAFF_MESSAGES.FETCH_INVITATIONS_SUCCESS,
      data: {
        invitations,
        pagination,
      },
    };
  },
};
