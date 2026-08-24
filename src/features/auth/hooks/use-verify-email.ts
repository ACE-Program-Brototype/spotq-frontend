import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AUTH_MESSAGES } from "../constants/auth.constants";
import { handleAuthError } from "../utils/auth-error-handler";
import { useVerifyEmailMutation } from "./use-auth-mutations";

export const useVerifyOtp = () => {
  const navigate = useNavigate();

  const verifyOtpMutation = useVerifyEmailMutation();

  const handleVerifyOtp = async (email: string, otp: string) => {
    try {
      const response = await verifyOtpMutation.mutateAsync({
        email,
        otp,
      });

      if (response.success) {
        toast.success(AUTH_MESSAGES.OTP_VERIFIED_SUCCESS);

        navigate("/", {
          replace: true,
        });
      } else {
        toast.error(response.message || AUTH_MESSAGES.GENERIC_ERROR);
      }
    } catch (err: unknown) {
      await handleAuthError(err, "verify-otp");
    }
  };

  return {
    handleVerifyOtp,
    isLoading: verifyOtpMutation.isPending,
  };
};
