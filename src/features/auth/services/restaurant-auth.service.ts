import {
  AUTH_ENDPOINTS,
  RESTAURANT_AUTH_ENDPOINTS,
} from "@/features/auth/constants/auth.constants";
import type { VerifyOtpResponse } from "@/features/auth/types/auth.types";
import { apiClient } from "@/lib/api/client";
import type { ApiResponse } from "@/types/api.types";

export interface CompleteRestaurantOnboardingPayload {
  restaurantName: string;
  phone: string;
  ownerName: string;
  seatingCapacity?: number;
  documents?: {
    fssai: { documentName: string; documentKey: string };
    businessRegistration: { documentName: string; documentKey: string };
    ownerIdentity: { documentName: string; documentKey: string };
    gst: { documentName: string; documentKey: string };
    businessPan: { documentName: string; documentKey: string };
  };
  restaurantImages?: Array<{
    objectKey: string;
    fileName?: string;
    displayOrder?: number;
  }>;
  location?: {
    addressLine1: string;
    addressLine2?: string | null;
    city: string;
    state: string;
    country: string;
    pincode: string;
    latitude: number;
    longitude: number;
  };
}

export type VerificationStatus = "SUBMITTED" | "UNDER_REVIEW" | "VERIFIED" | "REJECTED";

export interface RestaurantVerificationStatusData {
  status: VerificationStatus;
  rejectionReason?: string;
  submittedAt?: string;
  updatedAt?: string;
}

export interface VerificationStatusResponse {
  success: boolean;
  message: string;
  data: RestaurantVerificationStatusData;
}

export async function sendRestaurantEmailOtp(data: { email: string }): Promise<ApiResponse> {
  return apiClient.post(RESTAURANT_AUTH_ENDPOINTS.SEND_OTP, { json: data }).json<ApiResponse>();
}

export async function resendRestaurantEmailOtp(data: { email: string }): Promise<ApiResponse> {
  return apiClient.post(RESTAURANT_AUTH_ENDPOINTS.RESEND_OTP, { json: data }).json<ApiResponse>();
}

export async function verifyRestaurantEmailOtp(data: {
  email: string;
  otp: string;
}): Promise<ApiResponse<VerifyOtpResponse>> {
  const res = await apiClient.post(RESTAURANT_AUTH_ENDPOINTS.VERIFY_OTP, { json: data }).json<
    ApiResponse<
      VerifyOtpResponse & {
        accessToken?: string;
        access_token?: string;
      }
    >
  >();

  const token = res.data?.accessToken || res.data?.access_token;

  return {
    success: res.success,
    statusCode: res.statusCode,
    message: res.message,
    data: res.data
      ? {
          ...res.data,
          ...(token ? { accessToken: token } : {}),
        }
      : undefined,
  };
}

export async function completeRestaurantOnboarding(
  payload: CompleteRestaurantOnboardingPayload,
): Promise<ApiResponse> {
  return apiClient
    .post(AUTH_ENDPOINTS.RESTAURANT_ONBOARD, {
      json: payload,
    })
    .json<ApiResponse>();
}

export async function getRestaurantVerificationStatus(
  restaurantId?: string,
): Promise<VerificationStatusResponse> {
  const endpoint = restaurantId
    ? `restaurants/${restaurantId}/verification-status`
    : AUTH_ENDPOINTS.RESTAURANT_VERIFICATION_STATUS;
  return apiClient.get(endpoint).json<VerificationStatusResponse>();
}
