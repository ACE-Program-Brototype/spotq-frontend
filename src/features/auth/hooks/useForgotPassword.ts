import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { AUTH_MESSAGES } from "@/features/auth/constants/auth.constants";
import type { ForgotPasswordFormValues } from "@/features/auth/schemas/forgot-password.schema";
import { forgotPassword } from "@/features/auth/services/auth.service";

export function useForgotPassword() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: ForgotPasswordFormValues) => forgotPassword(data),
    onSuccess: (_, variables) => {
      toast.success(AUTH_MESSAGES.OTP_SENT_SUCCESS);
      navigate("/forgot-password/verify", {
        state: { email: variables.email },
      });
    },
    onError: (error: Error) => {
      toast.error(error.message ?? AUTH_MESSAGES.GENERIC_ERROR);
    },
  });
}
