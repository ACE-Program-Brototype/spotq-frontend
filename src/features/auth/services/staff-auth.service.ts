import {
  AUTH_ENDPOINTS,
  AUTH_MESSAGES,
  STAFF_AUTH_ENDPOINTS,
} from "@/features/auth/constants/auth.constants";
import type { LoginFormValues } from "@/features/auth/schemas/login.schema";
import type {
  ApiAuthResponse,
  StaffLoginResponse,
  StaffLogoutRes,
  User,
} from "@/features/auth/types/auth.types";
import { apiClient } from "@/lib/api/client";
import type { ApiResponse } from "@/types/api.types";

export type StaffLoginApiRes = {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    requiresRestaurantSelection?: boolean;
    selectToken?: string;
    restaurants?: Array<{
      restaurantId: string;
      restaurantName: string;
      role: string;
    }>;
    staff?: User;
    user?: User;
    accessToken?: string;
  };
};

export async function staffForgotPassword(data: { email: string }): Promise<ApiResponse> {
  return apiClient.post(STAFF_AUTH_ENDPOINTS.FORGOT_PASSWORD, { json: data }).json<ApiResponse>();
}

export async function staffVerifyOtp(data: { email: string; otp: string }): Promise<ApiResponse> {
  return apiClient.post(STAFF_AUTH_ENDPOINTS.VERIFY_OTP, { json: data }).json<ApiResponse>();
}

export async function staffResendOtp(data: { email: string }): Promise<ApiResponse> {
  return apiClient.post(STAFF_AUTH_ENDPOINTS.RESEND_OTP, { json: data }).json<ApiResponse>();
}

export async function staffResetPassword(data: { password: string }): Promise<ApiResponse> {
  return apiClient.post(STAFF_AUTH_ENDPOINTS.RESET_PASSWORD, { json: data }).json<ApiResponse>();
}

export async function loginStaff(data: LoginFormValues): Promise<StaffLoginResponse> {
  const res = await apiClient
    .post(AUTH_ENDPOINTS.STAFF_LOGIN, {
      json: data,
    })
    .json<StaffLoginApiRes>();

  const rawStaff = res.data?.staff || res.data?.user;
  const fullname =
    (rawStaff as { fullname?: string })?.fullname || rawStaff?.fullName || rawStaff?.name;

  const userData: User | undefined = rawStaff
    ? {
        ...rawStaff,
        name: fullname || rawStaff.name,
        fullName: fullname || rawStaff.fullName,
      }
    : undefined;

  return {
    success: res.success,
    message: res.message,
    data: {
      requiresRestaurantSelection: res.data?.requiresRestaurantSelection,
      selectToken: res.data?.selectToken,
      restaurants: res.data?.restaurants,
      user: userData,
      accessToken: res.data?.accessToken,
    },
  };
}

export async function selectStaffRestaurant(input: {
  selectToken: string;
  restaurantId: string;
}): Promise<StaffLoginResponse> {
  const res = await apiClient
    .post(STAFF_AUTH_ENDPOINTS.SELECT_RESTAURANT, {
      json: input,
    })
    .json<StaffLoginApiRes>();

  const rawStaff = res.data?.staff || res.data?.user;
  const fullname =
    (rawStaff as { fullname?: string })?.fullname || rawStaff?.fullName || rawStaff?.name;

  const userData: User | undefined = rawStaff
    ? {
        ...rawStaff,
        name: fullname || rawStaff.name,
        fullName: fullname || rawStaff.fullName,
      }
    : undefined;

  return {
    success: res.success,
    message: res.message,
    data: {
      user: userData,
      accessToken: res.data?.accessToken,
    },
  };
}

export async function logoutStaff(): Promise<StaffLogoutRes> {
  const res = await apiClient
    .post(AUTH_ENDPOINTS.STAFF_LOGOUT, {
      json: {},
    })
    .json<ApiAuthResponse>();
  return {
    success: res.success,
    message: res.message,
  };
}

export type ValidateStaffInvitationResponse = {
  valid: boolean;
  email?: string;
  restaurantName?: string;
  message?: string;
  isExistingStaff?: boolean;
};

export type AcceptStaffInvitationInput = {
  token: string;
  fullname?: string;
  phone?: string;
  password?: string;
};

export type AcceptStaffInvitationResponse = {
  success: boolean;
  message: string;
  data?: {
    staff: User;
    accessToken: string;
  };
};

export async function validateStaffInvitation(
  token: string,
): Promise<ValidateStaffInvitationResponse> {
  try {
    const response = await apiClient
      .post(STAFF_AUTH_ENDPOINTS.INVITATION_VALIDATE, {
        json: { token },
      })
      .json<
        ApiResponse<{
          valid?: boolean;
          email?: string;
          restaurantName?: string;
          isExistingStaff?: boolean;
        }>
      >();

    const valid = response.data?.valid ?? response.success ?? true;
    const email = response.data?.email ?? "";
    const restaurantName = response.data?.restaurantName ?? "SpotQ Restaurant";
    const isExistingStaff = Boolean(response.data?.isExistingStaff);

    return {
      valid,
      email,
      restaurantName,
      isExistingStaff,
      message: response.message,
    };
  } catch (err: unknown) {
    const errorMsg =
      (err as { response?: { message?: string } })?.response?.message ||
      (err as Error)?.message ||
      AUTH_MESSAGES.STAFF_INVITATION_INVALID;
    return {
      valid: false,
      message: errorMsg,
    };
  }
}

export async function acceptStaffInvitation(
  input: AcceptStaffInvitationInput,
): Promise<AcceptStaffInvitationResponse> {
  const payload: Record<string, string> = { token: input.token };
  if (input.fullname) payload.fullname = input.fullname;
  if (input.phone) payload.phone = input.phone;
  if (input.password) payload.password = input.password;

  const rawRes = await apiClient
    .post(STAFF_AUTH_ENDPOINTS.INVITATION_ACCEPT, {
      json: payload,
    })
    .json<
      ApiResponse<{
        staff: User;
        accessToken: string;
      }>
    >();

  const rawStaff = rawRes.data?.staff;
  const staff: User | undefined = rawStaff
    ? {
        ...rawStaff,
        role: (rawStaff.role || "STAFF") as User["role"],
      }
    : undefined;
  const accessToken = rawRes.data?.accessToken;

  return {
    success: rawRes.success ?? true,
    message: rawRes.message ?? AUTH_MESSAGES.STAFF_INVITATION_ACCEPT_SUCCESS,
    data: staff && accessToken ? { staff, accessToken } : undefined,
  };
}
