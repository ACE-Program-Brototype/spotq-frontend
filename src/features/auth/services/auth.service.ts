import { ADMIN_AUTH_ENDPOINTS, AUTH_ENDPOINTS } from "@/features/auth/constants/auth.constants";
import type { LoginFormValues } from "@/features/auth/schemas/login.schema";
import type {
  ApiAuthResponse,
  AuthResult,
  LoginInput,
  LogoutResult,
  RegisterInput,
  RegisterResult,
  ResendOtpInput,
  User,
  VerifyEmailResult,
  VerifyOtpInput,
} from "@/features/auth/types/auth.types";
import { mapApiAuthResponseToAuthResult } from "@/features/auth/utils/auth.mapper";
import { apiClient } from "@/lib/api/client";

export type LoginResponse = {
  success: boolean;
  message: string;
  data: {
    access_token: string;
    user: User;
  };
};

export type ApiResponse<T = unknown> = {
  success: boolean;
  statusCode?: number;
  message: string;
  data?: T;
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

export async function sendRestaurantEmailOtp(data: { email: string }): Promise<ApiResponse> {
  return apiClient.post(AUTH_ENDPOINTS.RESTAURANT_SEND_OTP, { json: data }).json<ApiResponse>();
}

export async function resendRestaurantEmailOtp(data: { email: string }): Promise<ApiResponse> {
  return apiClient.post(AUTH_ENDPOINTS.RESTAURANT_RESEND_OTP, { json: data }).json<ApiResponse>();
}

export async function verifyRestaurantEmailOtp(data: {
  email: string;
  otp: string;
}): Promise<ApiResponse> {
  return apiClient.post(AUTH_ENDPOINTS.RESTAURANT_VERIFY_OTP, { json: data }).json<ApiResponse>();
}

export async function resetPassword(data: { password: string }): Promise<ApiResponse> {
  return apiClient.post(AUTH_ENDPOINTS.RESET_PASSWORD, { json: data }).json<ApiResponse>();
}

const getDeviceInfo = () => {
  if (typeof window === "undefined" || !navigator) {
    return {
      deviceName: "Server Side",
      platform: "WEB" as const,
    };
  }

  const ua = navigator.userAgent;
  let browser = "Unknown Browser";
  let os = "Unknown OS";

  if (ua.indexOf("Firefox") > -1) browser = "Firefox";
  else if (ua.indexOf("SamsungBrowser") > -1) browser = "Samsung Browser";
  else if (ua.indexOf("Opera") > -1 || ua.indexOf("OPR") > -1) browser = "Opera";
  else if (ua.indexOf("Trident") > -1) browser = "Internet Explorer";
  else if (ua.indexOf("Edge") > -1 || ua.indexOf("Edg") > -1) browser = "Edge";
  else if (ua.indexOf("Chrome") > -1) browser = "Chrome";
  else if (ua.indexOf("Safari") > -1) browser = "Safari";

  if (ua.indexOf("Windows NT 10.0") > -1) os = "Windows 10/11";
  else if (ua.indexOf("Windows NT 6.2") > -1) os = "Windows 8";
  else if (ua.indexOf("Macintosh") > -1) os = "macOS";
  else if (ua.indexOf("Android") > -1) os = "Android";
  else if (ua.indexOf("iPhone") > -1) os = "iOS";
  else if (ua.indexOf("Linux") > -1) os = "Linux";

  return {
    deviceName: `${browser} on ${os}`,
    platform: "WEB" as const,
  };
};

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
      .json<ApiAuthResponse>();

    return mapApiAuthResponseToAuthResult(rawResponse);
  },

  verifyOtp: async (input: VerifyOtpInput): Promise<VerifyEmailResult> => {
    const rawResponse = await apiClient
      .post(AUTH_ENDPOINTS.VERIFY_OTP, {
        json: input,
      })
      .json<VerifyEmailResult>();

    return {
      success: rawResponse.success,
      statusCode: rawResponse.statusCode,
      message: rawResponse.message,
    };
  },

  resendEmailOtp: async (input: ResendOtpInput): Promise<VerifyEmailResult> => {
    const rawResponse = await apiClient
      .post(AUTH_ENDPOINTS.RESEND_EMAIL_OTP, {
        json: input,
      })
      .json<VerifyEmailResult>();

    return {
      success: rawResponse.success,
      statusCode: rawResponse.statusCode,
      message: rawResponse.message,
    };
  },
};
