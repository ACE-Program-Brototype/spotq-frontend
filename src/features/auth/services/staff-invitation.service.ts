import { STAFF_AUTH_ENDPOINTS } from "@/features/auth/constants/auth.constants";
import type { ApiResponse } from "@/features/auth/services/auth.service";
import type { User } from "@/features/auth/types/auth.types";
import type {
  AcceptInvitationInput,
  AcceptInvitationResponse,
  ResendStaffInvitationInput,
  RevokeStaffInvitationInput,
  SendStaffInvitationInput,
  StaffInvitation,
  StaffInvitationSortBy,
  StaffInvitationSortOrder,
  ValidateInvitationResponse,
} from "@/features/auth/types/staff-invitation.types";
import { apiClient } from "@/lib/api/client";

export const staffInvitationService = {
  /**
   * Send a new staff invitation email
   */
  async sendInvitation(data: SendStaffInvitationInput): Promise<ApiResponse<StaffInvitation>> {
    return apiClient
      .post(STAFF_AUTH_ENDPOINTS.INVITATIONS, {
        json: { email: data.email },
      })
      .json<ApiResponse<StaffInvitation>>();
  },

  /**
   * Resend an existing staff invitation email
   */
  async resendInvitation(data: ResendStaffInvitationInput): Promise<ApiResponse<StaffInvitation>> {
    return apiClient
      .post(STAFF_AUTH_ENDPOINTS.INVITATIONS_RESEND, {
        json: { email: data.email },
      })
      .json<ApiResponse<StaffInvitation>>();
  },

  /**
   * Revoke an active/pending staff invitation
   */
  async revokeInvitation(data: RevokeStaffInvitationInput): Promise<ApiResponse> {
    return apiClient
      .post(STAFF_AUTH_ENDPOINTS.INVITATIONS_REVOKE, {
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
      pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>
  > {
    try {
      const searchParams: Record<string, string | number> = {};
      if (params?.page) searchParams.page = params.page;
      if (params?.limit) searchParams.limit = params.limit;
      if (params?.status && params.status !== "ALL") searchParams.status = params.status;
      if (params?.search) searchParams.search = params.search;
      if (params?.sortBy) searchParams.sortBy = params.sortBy;
      if (params?.sortOrder) searchParams.sortOrder = params.sortOrder;

      const raw = await apiClient
        .get(STAFF_AUTH_ENDPOINTS.INVITATIONS, {
          searchParams: Object.keys(searchParams).length > 0 ? searchParams : undefined,
        })
        .json<{
          success?: boolean;
          message?: string;
          data?:
            | {
                invitations?: StaffInvitation[];
                pagination?: {
                  page: number;
                  limit: number;
                  total: number;
                  totalPages: number;
                };
              }
            | StaffInvitation[];
        }>();

      const invitations: StaffInvitation[] = Array.isArray(raw.data)
        ? raw.data
        : raw.data?.invitations || [];

      const pagination = Array.isArray(raw.data) ? undefined : raw.data?.pagination;

      return {
        success: raw.success ?? true,
        message: raw.message ?? "Invitations fetched successfully",
        data: {
          invitations,
          pagination,
        },
      };
    } catch {
      return {
        success: false,
        message: "Failed to fetch invitations",
        data: {
          invitations: [],
        },
      };
    }
  },

  /**
   * Validate an invitation token
   */
  async validateInvitation(token: string): Promise<ValidateInvitationResponse> {
    try {
      const response = await apiClient
        .post(STAFF_AUTH_ENDPOINTS.INVITATION_VALIDATE, {
          json: { token },
        })
        .json<{
          success?: boolean;
          valid?: boolean;
          email?: string;
          restaurantName?: string;
          data?: {
            valid?: boolean;
            email?: string;
            restaurantName?: string;
          };
          message?: string;
        }>();

      const valid = response.valid ?? response.data?.valid ?? response.success ?? true;
      const email = response.email ?? response.data?.email ?? "";
      const restaurantName =
        response.restaurantName ?? response.data?.restaurantName ?? "SpotQ Restaurant";

      return {
        valid,
        email,
        restaurantName,
        message: response.message,
      };
    } catch (err: unknown) {
      const errorMsg =
        (err as { response?: { message?: string } })?.response?.message ||
        (err as Error)?.message ||
        "Invalid or expired invitation token";
      return {
        valid: false,
        message: errorMsg,
      };
    }
  },

  /**
   * Complete staff registration and accept invitation
   */
  async acceptInvitation(input: AcceptInvitationInput): Promise<AcceptInvitationResponse> {
    const rawRes = await apiClient
      .post(STAFF_AUTH_ENDPOINTS.INVITATION_ACCEPT, {
        json: {
          token: input.token,
          fullname: input.fullname,
          phone: input.phone,
          password: input.password,
        },
      })
      .json<{
        success?: boolean;
        message?: string;
        staff?: User;
        accessToken?: string;
        data?: {
          staff: User;
          accessToken: string;
        };
      }>();

    const rawStaff = rawRes.staff || rawRes.data?.staff;
    const staff: User | undefined = rawStaff
      ? {
          ...rawStaff,
          role: (rawStaff.role || "RESTAURANT_STAFF") as User["role"],
        }
      : undefined;
    const accessToken = rawRes.accessToken || rawRes.data?.accessToken;

    return {
      success: rawRes.success ?? true,
      message: rawRes.message ?? "Invitation accepted successfully",
      data: staff && accessToken ? { staff, accessToken } : undefined,
    };
  },
};
