import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DEVICE_QUERY_KEYS } from "../constants/auth.constants";
import { deviceService } from "../services/device.service";
import type {
  CustomerDevicesResponse,
  DeactivateDeviceResponse,
  RegisterDeviceRequest,
  RegisterDeviceResponse,
} from "../types/device.types";

/**
 * Mutation hook to register or update customer device FID and info.
 */
export const useRegisterDevice = () => {
  const queryClient = useQueryClient();

  return useMutation<RegisterDeviceResponse, Error, Partial<RegisterDeviceRequest> | undefined>({
    mutationFn: (input) => deviceService.registerDevice(input || undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEVICE_QUERY_KEYS.ALL });
    },
  });
};

/**
 * Query hook to fetch registered customer devices.
 */
export const useCustomerDevices = (options?: { enabled?: boolean }) => {
  return useQuery<CustomerDevicesResponse, Error>({
    queryKey: DEVICE_QUERY_KEYS.LIST(),
    queryFn: () => deviceService.getDevices(),
    enabled: options?.enabled ?? true,
  });
};

/**
 * Mutation hook to deactivate a customer device.
 */
export const useDeactivateDevice = () => {
  const queryClient = useQueryClient();

  return useMutation<DeactivateDeviceResponse, Error, string>({
    mutationFn: (deviceId: string) => deviceService.deactivateDevice(deviceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEVICE_QUERY_KEYS.ALL });
    },
  });
};
