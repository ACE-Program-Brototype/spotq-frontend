import { apiClient } from "@/lib/api/client";
import { DEVICE_ENDPOINTS } from "../constants/auth.constants";
import type {
  CustomerDeviceItem,
  CustomerDevicesResponse,
  DeactivateDeviceResponse,
  RegisterDeviceResponse,
} from "../types/device.types";
import { deviceService } from "./device.service";

jest.mock("@/lib/api/client", () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
  },
}));

describe("deviceService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("registerDevice", () => {
    it("calls POST users/me/devices with provided payload and returns response", async () => {
      const mockResponse: RegisterDeviceResponse = {
        success: true,
        message: "Device registered successfully",
        data: {
          device_id: "test-device-uuid",
          platform: "WEB",
          is_active: true,
        },
      };

      const mockJson = jest.fn().mockResolvedValue(mockResponse);
      (apiClient.post as jest.Mock).mockReturnValue({ json: mockJson });

      const payload = {
        deviceId: "test-device-uuid",
        platform: "WEB" as const,
        deviceName: "Chrome on macOS",
        appVersion: "1.0.0",
        fid: "sample-fid-token",
      };

      const result = await deviceService.registerDevice(payload);

      expect(apiClient.post).toHaveBeenCalledWith(DEVICE_ENDPOINTS.DEVICES, {
        json: payload,
      });
      expect(result).toEqual(mockResponse);
    });

    it("uses default device payload when called with no payload", async () => {
      const mockResponse: RegisterDeviceResponse = {
        success: true,
        message: "Device registered successfully",
        data: {
          device_id: "auto-generated-id",
          platform: "WEB",
          is_active: true,
        },
      };

      const mockJson = jest.fn().mockResolvedValue(mockResponse);
      (apiClient.post as jest.Mock).mockReturnValue({ json: mockJson });

      const result = await deviceService.registerDevice();

      expect(apiClient.post).toHaveBeenCalledWith(
        DEVICE_ENDPOINTS.DEVICES,
        expect.objectContaining({
          json: expect.objectContaining({
            platform: "WEB",
            deviceId: expect.any(String),
          }),
        }),
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("getDevices", () => {
    it("calls GET users/me/devices and returns registered devices list", async () => {
      const mockDevices: CustomerDeviceItem[] = [
        {
          deviceRegistrationId: "reg-1",
          deviceId: "device-uuid-1",
          platform: "WEB",
          deviceName: "Chrome on macOS",
          appVersion: "1.0.0",
          isActive: true,
          lastLogin: "2026-10-15T10:00:00.000Z",
          createdAt: "2026-10-10T10:00:00.000Z",
          updatedAt: "2026-10-15T10:00:00.000Z",
        },
      ];

      const mockResponse: CustomerDevicesResponse = {
        success: true,
        message: "Devices retrieved successfully",
        data: mockDevices,
      };

      const mockJson = jest.fn().mockResolvedValue(mockResponse);
      (apiClient.get as jest.Mock).mockReturnValue({ json: mockJson });

      const result = await deviceService.getDevices();

      expect(apiClient.get).toHaveBeenCalledWith(DEVICE_ENDPOINTS.DEVICES);
      expect(result).toEqual(mockResponse);
    });
  });

  describe("deactivateDevice", () => {
    it("calls DELETE users/me/devices/:deviceId with encoded deviceId", async () => {
      const mockResponse: DeactivateDeviceResponse = {
        success: true,
        message: "Device deactivated successfully",
        data: null,
      };

      const mockJson = jest.fn().mockResolvedValue(mockResponse);
      (apiClient.delete as jest.Mock).mockReturnValue({ json: mockJson });

      const result = await deviceService.deactivateDevice("device/with special@chars");

      expect(apiClient.delete).toHaveBeenCalledWith(
        "users/me/devices/device%2Fwith%20special%40chars",
      );
      expect(result).toEqual(mockResponse);
    });
  });
});
