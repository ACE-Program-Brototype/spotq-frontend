import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { CUSTOMER_ROUTES } from "@/app/router/routes.constants";
import { AUTH_MESSAGES } from "../constants/auth.constants";
import { useAuthStore } from "../store/auth.store";
import { getOrCreateDeviceId } from "../utils/device.utils";
import { useLogoutMutation } from "./use-auth-mutations";
import { useDeactivateDevice } from "./use-device";

export const useLogout = () => {
  const navigate = useNavigate();
  const { clearAuth } = useAuthStore();
  const logoutMutation = useLogoutMutation();
  const deactivateDeviceMutation = useDeactivateDevice();

  const handleLogout = async () => {
    try {
      const deviceId = getOrCreateDeviceId();
      await Promise.allSettled([
        deactivateDeviceMutation.mutateAsync(deviceId),
        logoutMutation.mutateAsync(),
      ]);
    } catch {
    } finally {
      clearAuth();
      toast.success(AUTH_MESSAGES.LOGOUT_SUCCESS);
      navigate(CUSTOMER_ROUTES.AUTH.LOGIN, { replace: true });
    }
  };

  return {
    handleLogout,
    isLoading: logoutMutation.isPending || deactivateDeviceMutation.isPending,
  };
};
