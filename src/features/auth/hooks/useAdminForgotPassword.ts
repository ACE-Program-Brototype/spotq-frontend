import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { AUTH_MESSAGES } from "@/features/auth/constants/auth.constants";
import type { ForgotPasswordFormValues } from "@/features/auth/schemas/forgot-password.schema";
import { adminForgotPassword } from "@/features/auth/services/auth.service";

export function useAdminForgotPassword() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: ForgotPasswordFormValues) => adminForgotPassword(data),
    onSuccess: (_, variables) => {
      toast.success(AUTH_MESSAGES.OTP_SENT_SUCCESS);
      navigate("/admin/forgot-password/verify", {
        state: { email: variables.email },
      });
    },
    onError: (error: Error) => {
      toast.error(error.message ?? AUTH_MESSAGES.GENERIC_ERROR);
    },
  });
}
