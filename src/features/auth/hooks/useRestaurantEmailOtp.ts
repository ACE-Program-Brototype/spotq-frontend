import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { AUTH_MESSAGES } from "@/features/auth/constants/auth.constants";
import { sendRestaurantEmailOtp } from "@/features/auth/services/auth.service";

export function useRestaurantEmailOtp() {
  return useMutation({
    mutationFn: (data: { email: string }) => sendRestaurantEmailOtp(data),
    onSuccess: () => {
      toast.success(AUTH_MESSAGES.OTP_SENT_SUCCESS);
    },
    onError: (error: Error) => {
      toast.error(error.message ?? AUTH_MESSAGES.GENERIC_ERROR);
    },
  });
}
