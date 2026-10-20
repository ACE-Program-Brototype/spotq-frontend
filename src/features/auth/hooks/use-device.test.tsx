import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { DEVICE_QUERY_KEYS } from "../constants/auth.constants";
import { deviceService } from "../services/device.service";
import type {
  CustomerDeviceItem,
  CustomerDevicesResponse,
  DeactivateDeviceResponse,
  RegisterDeviceResponse,
} from "../types/device.types";
import { useCustomerDevices, useDeactivateDevice, useRegisterDevice } from "./use-device";

jest.mock("../services/device.service", () => ({
  deviceService: {
    registerDevice: jest.fn(),
    getDevices: jest.fn(),
    deactivateDevice: jest.fn(),
  },
}));

describe("Device Hooks", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  describe("useRegisterDevice", () => {
    it("successfully calls registerDevice and invalidates customer-devices query", async () => {
      const mockResponse: RegisterDeviceResponse = {
        success: true,
        message: "Device registered successfully",
        data: {
          device_id: "test-device-id",
          platform: "WEB",
          is_active: true,
        },
      };

      (deviceService.registerDevice as jest.Mock).mockResolvedValue(mockResponse);
      const invalidateSpy = jest.spyOn(queryClient, "invalidateQueries");

      const { result } = renderHook(() => useRegisterDevice(), { wrapper });

      await act(async () => {
        await result.current.mutateAsync({
          deviceId: "test-device-id",
          platform: "WEB",
        });
      });

      expect(deviceService.registerDevice).toHaveBeenCalledWith({
        deviceId: "test-device-id",
        platform: "WEB",
      });
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: DEVICE_QUERY_KEYS.ALL,
      });
    });
  });

  describe("useCustomerDevices", () => {
    it("fetches registered devices using query key", async () => {
      const mockDevices: CustomerDeviceItem[] = [
        {
          deviceRegistrationId: "reg-1",
          deviceId: "device-1",
          platform: "WEB",
          deviceName: "Chrome on macOS",
          appVersion: "1.0.0",
          isActive: true,
          lastLogin: "2026-10-15T00:00:00.000Z",
          createdAt: "2026-10-15T00:00:00.000Z",
          updatedAt: "2026-10-15T00:00:00.000Z",
        },
      ];

      const mockResponse: CustomerDevicesResponse = {
        success: true,
        message: "Devices retrieved successfully",
        data: mockDevices,
      };

      (deviceService.getDevices as jest.Mock).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useCustomerDevices(), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(deviceService.getDevices).toHaveBeenCalledTimes(1);
      expect(result.current.data).toEqual(mockResponse);
    });

    it("respects enabled option when set to false", () => {
      const { result } = renderHook(() => useCustomerDevices({ enabled: false }), {
        wrapper,
      });

      expect(result.current.fetchStatus).toBe("idle");
      expect(deviceService.getDevices).not.toHaveBeenCalled();
    });
  });

  describe("useDeactivateDevice", () => {
    it("deactivates device and invalidates customer-devices query", async () => {
      const mockResponse: DeactivateDeviceResponse = {
        success: true,
        message: "Device deactivated successfully",
        data: null,
      };

      (deviceService.deactivateDevice as jest.Mock).mockResolvedValue(mockResponse);
      const invalidateSpy = jest.spyOn(queryClient, "invalidateQueries");

      const { result } = renderHook(() => useDeactivateDevice(), { wrapper });

      await act(async () => {
        await result.current.mutateAsync("device-to-deactivate");
      });

      expect(deviceService.deactivateDevice).toHaveBeenCalledWith("device-to-deactivate");
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: DEVICE_QUERY_KEYS.ALL,
      });
    });
  });
});
