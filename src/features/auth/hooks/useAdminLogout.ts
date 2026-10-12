import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { ADMIN_ROUTES } from "@/app/router/routes.constants";
import { AUTH_MESSAGES } from "@/features/auth/constants/auth.constants";
import { logoutAdmin } from "@/features/auth/services/auth.service";
import { useAuthStore } from "@/features/auth/store/auth.store";

export function useAdminLogout() {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    mutationFn: logoutAdmin,
    onSuccess: () => {
      clearAuth();
      toast.success(AUTH_MESSAGES.ADMIN_LOGOUT_SUCCESS);
      navigate(ADMIN_ROUTES.LOGIN, { replace: true });
    },
    onError: (error: Error) => {
      clearAuth();
      toast.error(error.message ?? AUTH_MESSAGES.LOGOUT_FAILED);
      navigate(ADMIN_ROUTES.LOGIN, { replace: true });
    },
  });
}
