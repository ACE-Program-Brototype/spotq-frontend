import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { AUTH_MESSAGES } from "@/features/auth/constants/auth.constants";
import { resendOtp } from "@/features/auth/services/auth.service";

export function useResendOtp() {
  return useMutation({
    mutationFn: (data: { email: string }) => resendOtp(data),
    onSuccess: () => {
      toast.success(AUTH_MESSAGES.OTP_RESENT_SUCCESS);
    },
    onError: (error: Error) => {
      toast.error(error.message ?? AUTH_MESSAGES.GENERIC_ERROR);
    },
  });
}
