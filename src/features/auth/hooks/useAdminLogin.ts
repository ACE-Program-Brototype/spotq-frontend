import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { AUTH_MESSAGES } from "@/features/auth/constants/auth.constants";
import type { LoginFormValues } from "@/features/auth/schemas/login.schema";
import { loginAdmin } from "@/features/auth/services/auth.service";
import { useAuthStore } from "@/features/auth/store/auth.store";

export function useAdminLogin() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (data: LoginFormValues) => loginAdmin(data),
    onSuccess: ({ access_token, user }) => {
      setAuth({ ...user, role: "ADMIN" }, access_token);
      toast.success(AUTH_MESSAGES.ADMIN_LOGIN_SUCCESS);
      navigate("/admin/dashboard", { replace: true });
    },
    onError: (error: Error) => {
      toast.error(error.message ?? AUTH_MESSAGES.LOGIN_FAILED);
    },
  });
}
