import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { AUTH_MESSAGES } from "@/features/auth/constants/auth.constants";
import { adminVerifyOtp } from "@/features/auth/services/auth.service";

export function useAdminVerifyOtp() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: { email: string; otp: string }) => adminVerifyOtp(data),
    onSuccess: (_, variables) => {
      toast.success(AUTH_MESSAGES.OTP_VERIFIED_SUCCESS);
      navigate("/admin/forgot-password/reset-password", {
        state: { email: variables.email },
      });
    },
    onError: (error: Error) => {
      toast.error(error.message ?? AUTH_MESSAGES.GENERIC_ERROR);
    },
  });
}
