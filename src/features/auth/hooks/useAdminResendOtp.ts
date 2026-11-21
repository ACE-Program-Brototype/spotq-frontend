import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { AUTH_MESSAGES } from "@/features/auth/constants/auth.constants";
import { adminResendOtp } from "@/features/auth/services/auth.service";

export function useAdminResendOtp() {
  return useMutation({
    mutationFn: (data: { email: string }) => adminResendOtp(data),
    onSuccess: () => {
      toast.success(AUTH_MESSAGES.OTP_RESENT_SUCCESS);
    },
    onError: (error: Error) => {
      toast.error(error.message ?? AUTH_MESSAGES.GENERIC_ERROR);
    },
  });
}
