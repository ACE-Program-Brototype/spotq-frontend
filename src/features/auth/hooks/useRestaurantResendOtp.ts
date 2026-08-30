import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { AUTH_MESSAGES } from "@/features/auth/constants/auth.constants";
import { resendRestaurantEmailOtp } from "@/features/auth/services/auth.service";

export function useRestaurantResendOtp() {
  return useMutation({
    mutationFn: async (data: { email: string }): Promise<void> => {
      const response = await resendRestaurantEmailOtp(data);

      if (!response.success) {
        const message = response.message || "Couldn't resend the code. Try again.";
        throw new Error(message);
      }
    },
    onSuccess: () => {
      toast.success(AUTH_MESSAGES.OTP_RESENT_SUCCESS);
    },
    onError: (error: Error) => {
      toast.error(error.message ?? AUTH_MESSAGES.GENERIC_ERROR);
    },
  });
}
