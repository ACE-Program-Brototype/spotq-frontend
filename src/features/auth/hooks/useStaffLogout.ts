import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { AUTH_MESSAGES } from "@/features/auth/constants/auth.constants";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useStaffLogoutMutation } from "./use-auth-mutations";

export const useStaffLogout = () => {
  const navigate = useNavigate();

  const clearAuth = useAuthStore((state) => state.clearAuth);

  const staffLogoutMutation = useStaffLogoutMutation();

  const handleStaffLogout = async () => {
    try {
      const response = await staffLogoutMutation.mutateAsync();

      // Always clear local authentication after successful logout
      clearAuth();

      toast.success(response.message || AUTH_MESSAGES.LOGOUT_SUCCESS);

      navigate("/staff/login", {
        replace: true,
      });
    } catch (error: unknown) {
      // Even if backend logout fails, remove the local session
      clearAuth();

      const message = error instanceof Error ? error.message : AUTH_MESSAGES.LOGOUT_FAILED;

      toast.error(message);

      navigate("/staff/login", {
        replace: true,
      });
    }
  };

  return {
    handleStaffLogout,
    isLoading: staffLogoutMutation.isPending,
  };
};
