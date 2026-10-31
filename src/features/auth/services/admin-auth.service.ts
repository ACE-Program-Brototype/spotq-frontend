import { ADMIN_AUTH_ENDPOINTS } from "@/features/auth/constants/auth.constants";
import type { LoginFormValues } from "@/features/auth/schemas/login.schema";
import type { User } from "@/features/auth/types/auth.types";
import { apiClient } from "@/lib/api/client";
import type { ApiResponse } from "@/types/api.types";

export type LoginResponse = {
  success: boolean;
  message: string;
  data: {
    access_token: string;
    user: User;
  };
};

export async function loginAdmin(data: LoginFormValues): Promise<LoginResponse["data"]> {
  const res = await apiClient
    .post(ADMIN_AUTH_ENDPOINTS.LOGIN, { json: data })
    .json<LoginResponse>();

  return res.data;
}

export async function logoutAdmin(): Promise<void> {
  await apiClient.post(ADMIN_AUTH_ENDPOINTS.LOGOUT).json();
}

export async function adminForgotPassword(data: { email: string }): Promise<ApiResponse> {
  return apiClient.post(ADMIN_AUTH_ENDPOINTS.FORGOT_PASSWORD, { json: data }).json<ApiResponse>();
}

export async function adminVerifyOtp(data: { email: string; otp: string }): Promise<ApiResponse> {
  return apiClient.post(ADMIN_AUTH_ENDPOINTS.VERIFY_OTP, { json: data }).json<ApiResponse>();
}

export async function adminResendOtp(data: { email: string }): Promise<ApiResponse> {
  return apiClient.post(ADMIN_AUTH_ENDPOINTS.RESEND_OTP, { json: data }).json<ApiResponse>();
}

export async function adminResetPassword(data: { password: string }): Promise<ApiResponse> {
  return apiClient.post(ADMIN_AUTH_ENDPOINTS.RESET_PASSWORD, { json: data }).json<ApiResponse>();
}
