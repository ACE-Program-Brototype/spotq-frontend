import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AUTH_MESSAGES } from "../constants/auth.constants";
import { useAuthStore } from "../store/auth.store";
import { useLogoutMutation } from "./use-auth-mutations";

export const useLogout = () => {
  const navigate = useNavigate();
  const { clearAuth } = useAuthStore();
  const logoutMutation = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch {
    } finally {
      clearAuth();
      toast.success(AUTH_MESSAGES.LOGOUT_SUCCESS);
      navigate("/login", { replace: true });
    }
  };

  return {
    handleLogout,
    isLoading: logoutMutation.isPending,
  };
};
