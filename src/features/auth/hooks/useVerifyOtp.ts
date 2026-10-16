import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { CUSTOMER_ROUTES } from "@/app/router/routes.constants";
import { AUTH_MESSAGES } from "@/features/auth/constants/auth.constants";
import { verifyOtp } from "@/features/auth/services/auth.service";

export function useVerifyOtp() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: { email: string; otp: string }) => verifyOtp(data),
    onSuccess: (_, variables) => {
      toast.success(AUTH_MESSAGES.OTP_VERIFIED_SUCCESS);
      navigate(CUSTOMER_ROUTES.AUTH.FORGOT_PASSWORD_RESET, {
        state: { email: variables.email },
      });
    },
    onError: (error: Error) => {
      toast.error(error.message ?? AUTH_MESSAGES.GENERIC_ERROR);
    },
  });
}
