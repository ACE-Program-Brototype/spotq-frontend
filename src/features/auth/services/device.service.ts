import { apiClient } from "@/lib/api/client";
import { DEVICE_ENDPOINTS } from "../constants/auth.constants";
import type {
  CustomerDevicesResponse,
  DeactivateDeviceResponse,
  RegisterDeviceRequest,
  RegisterDeviceResponse,
} from "../types/device.types";
import { buildDevicePayload } from "../utils/device.utils";

export const deviceService = {
  /**
   * Registers or updates a device for the authenticated customer.
   */
  registerDevice: async (
    payload?: Partial<RegisterDeviceRequest>,
  ): Promise<RegisterDeviceResponse> => {
    const body: RegisterDeviceRequest = buildDevicePayload(payload);
    return apiClient
      .post(DEVICE_ENDPOINTS.DEVICES, {
        json: body,
      })
      .json<RegisterDeviceResponse>();
  },

  /**
   * Retrieves all registered devices for the authenticated customer.
   */
  getDevices: async (): Promise<CustomerDevicesResponse> => {
    return apiClient.get(DEVICE_ENDPOINTS.DEVICES).json<CustomerDevicesResponse>();
  },

  /**
   * Deactivates a specific device for the authenticated customer.
   */
  deactivateDevice: async (deviceId: string): Promise<DeactivateDeviceResponse> => {
    return apiClient
      .delete(DEVICE_ENDPOINTS.DEVICE_BY_ID(deviceId))
      .json<DeactivateDeviceResponse>();
  },
};

export const registerDevice = deviceService.registerDevice;
export const getDevices = deviceService.getDevices;
export const deactivateDevice = deviceService.deactivateDevice;
