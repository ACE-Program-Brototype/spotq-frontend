import { AUTH_ENDPOINTS } from "@/features/auth/constants/auth.constants";
import type {
  ApiAuthResponse,
  AuthResult,
  LoginInput,
  LogoutResult,
  RegisterInput,
  RegisterResult,
  ResendOtpInput,
  VerifyEmailResult,
  VerifyOtpInput,
} from "@/features/auth/types/auth.types";
import { mapApiAuthResponseToAuthResult } from "@/features/auth/utils/auth.mapper";
import { apiClient } from "@/lib/api/client";
import type { ApiResponse } from "@/types/api.types";
import { getDeviceName } from "../utils/device.utils";

const getDeviceInfo = () => ({
  deviceName: getDeviceName(),
  platform: "WEB" as const,
});

export async function forgotPassword(data: { email: string }): Promise<ApiResponse> {
  return apiClient.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, { json: data }).json<ApiResponse>();
}

export async function verifyOtp(data: { email: string; otp: string }): Promise<ApiResponse> {
  return apiClient.post(AUTH_ENDPOINTS.FORGOT_PASSWORD_VERIFY, { json: data }).json<ApiResponse>();
}

export async function resendOtp(data: { email: string }): Promise<ApiResponse> {
  return apiClient
    .post(AUTH_ENDPOINTS.FORGOT_PASSWORD_RESEND_OTP, { json: data })
    .json<ApiResponse>();
}

export async function resetPassword(data: { password: string }): Promise<ApiResponse> {
  return apiClient.post(AUTH_ENDPOINTS.RESET_PASSWORD, { json: data }).json<ApiResponse>();
}

export const authService = {
  login: async (input: LoginInput): Promise<AuthResult> => {
    const payload = {
      ...input,
      device: input.device || getDeviceInfo(),
    };

    const rawResponse = await apiClient
      .post(AUTH_ENDPOINTS.LOGIN, {
        json: payload,
      })
      .json<ApiAuthResponse>();

    return mapApiAuthResponseToAuthResult(rawResponse);
  },

  googleLogin: async (input: { idToken: string }): Promise<AuthResult> => {
    const payload = {
      idToken: input.idToken,
      device: getDeviceInfo(),
    };

    const rawResponse = await apiClient
      .post(AUTH_ENDPOINTS.GOOGLE_LOGIN, {
        json: payload,
      })
      .json<ApiAuthResponse>();

    return mapApiAuthResponseToAuthResult(rawResponse);
  },

  logout: async (): Promise<LogoutResult> => {
    return apiClient
      .post(AUTH_ENDPOINTS.LOGOUT, {
        json: {},
      })
      .json<LogoutResult>();
  },

  register: async (input: RegisterInput): Promise<RegisterResult> => {
    const rawResponse = await apiClient
      .post(AUTH_ENDPOINTS.REGISTER, {
        json: input,
      })
      .json<ApiResponse>();

    return {
      success: rawResponse.success,
      statusCode: rawResponse.statusCode,
      message: rawResponse.message,
    };
  },

  verifyOtp: async (input: VerifyOtpInput): Promise<VerifyEmailResult> => {
    const rawResponse = await apiClient
      .post(AUTH_ENDPOINTS.VERIFY_OTP, {
        json: input,
      })
      .json<ApiAuthResponse>();

    return mapApiAuthResponseToAuthResult(rawResponse);
  },

  resendEmailOtp: async (input: ResendOtpInput): Promise<ApiResponse> => {
    const rawResponse = await apiClient
      .post(AUTH_ENDPOINTS.RESEND_EMAIL_OTP, {
        json: input,
      })
      .json<ApiResponse>();

    return {
      success: rawResponse.success,
      statusCode: rawResponse.statusCode,
      message: rawResponse.message,
    };
  },
};
