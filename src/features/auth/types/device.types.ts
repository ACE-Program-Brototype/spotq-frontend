import type { ApiResponse } from "@/types/api.types";

export type { ApiResponse };
export type PlatformType = "ANDROID" | "IOS" | "WEB";

export interface RegisterDeviceRequest {
  deviceId: string;
  fid?: string | null;
  platform: PlatformType;
  appVersion?: string | null;
  deviceName?: string | null;
}

export interface RegisterDeviceResponseData {
  device_id: string;
  platform: PlatformType;
  is_active: boolean;
}

export type RegisterDeviceResponse = ApiResponse<RegisterDeviceResponseData>;

export interface CustomerDeviceItem {
  deviceRegistrationId: string;
  deviceId: string | null;
  platform: PlatformType;
  deviceName: string | null;
  appVersion: string | null;
  isActive: boolean;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
}

export type CustomerDevicesResponse = ApiResponse<CustomerDeviceItem[]>;

export interface DeactivateDeviceResponse {
  success: boolean;
  message: string;
  data: null;
  statusCode?: number;
}
