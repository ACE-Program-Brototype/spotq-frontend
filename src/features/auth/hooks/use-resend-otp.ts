import { toast } from "sonner";
import { AUTH_MESSAGES } from "../constants/auth.constants";
import { useResendEmailOtp } from "./use-auth-mutations";

export const useResendOtp = () => {
  const resendOtpMutation = useResendEmailOtp();

  const handleResendOtp = async (email: string) => {
    try {
      const response = await resendOtpMutation.mutateAsync({
        email,
      });

      if (response.success) {
        toast.success(AUTH_MESSAGES.OTP_RESEND_SUCCESS);

        return response;
      }

      toast.error(response.message || AUTH_MESSAGES.GENERIC_ERROR);

      return response;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : AUTH_MESSAGES.GENERIC_ERROR;
      toast.error(message);
      return null;
    }
  };

  return {
    handleResendOtp,
    isLoading: resendOtpMutation.isPending,
  };
};
