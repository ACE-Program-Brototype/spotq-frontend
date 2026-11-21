import { useMutation } from "@tanstack/react-query";

import { verifyRestaurantEmailOtp } from "@/features/auth/services/auth.service";
import type { ApiErrorShape, VerifyOtpResponse } from "@/features/auth/types/auth.types";

export function useRestaurantVerifyOtp() {
  return useMutation({
    mutationFn: async (data: { email: string; otp: string }): Promise<VerifyOtpResponse> => {
      const response = await verifyRestaurantEmailOtp(data);

      if (!response.success || !response.data) {
        const message = response.message || "We couldn't verify that code. Please try again.";
        const error = new Error(message) as Error & { code?: string };
        error.code = (response as ApiErrorShape)?.code;
        throw error;
      }

      return response.data as VerifyOtpResponse;
    },
  });
}
