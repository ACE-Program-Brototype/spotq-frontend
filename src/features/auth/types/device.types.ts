export type PlatformType = "ANDROID" | "IOS" | "WEB";

export interface RegisterDeviceRequest {
  deviceId: string; // Required: 1-255 chars (e.g. UUID stored in localStorage)
  fid?: string | null; // Firebase Installation ID (FID)
  platform: PlatformType; // Required: "WEB" for browser clients
  appVersion?: string | null; // Optional: e.g. "1.0.0"
  deviceName?: string | null; // Optional: e.g. "Chrome on macOS"
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  statusCode?: number;
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
