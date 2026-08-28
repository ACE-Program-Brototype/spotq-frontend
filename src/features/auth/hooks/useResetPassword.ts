import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { AUTH_MESSAGES } from "@/features/auth/constants/auth.constants";
import { resetPassword } from "@/features/auth/services/auth.service";

export function useResetPassword() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: { password: string }) => resetPassword(data),
    onSuccess: () => {
      toast.success(AUTH_MESSAGES.PASSWORD_RESET_SUCCESS);
      navigate("/login", { replace: true });
    },
    onError: (error: Error) => {
      toast.error(error.message ?? AUTH_MESSAGES.GENERIC_ERROR);
    },
  });
}
