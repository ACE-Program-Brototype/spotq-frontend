import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AUTH_MESSAGES } from "../constants/auth.constants";
import { useAuthStore } from "../store/auth.store";
import { useVerifyEmailMutation } from "./use-auth-mutations";

export const useVerifyOtp = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const verifyOtpMutation = useVerifyEmailMutation();

  const handleVerifyOtp = async (email: string, otp: string) => {
    try {
      const response = await verifyOtpMutation.mutateAsync({
        email,
        otp,
      });

      if (response.success) {
        toast.success(response.message || AUTH_MESSAGES.OTP_VERIFIED_SUCCESS);

        if (response.data?.user && response.data?.accessToken) {
          setAuth(response.data.user, response.data.accessToken);
        }

        navigate("/", {
          replace: true,
        });
      } else {
        toast.error(response.message || AUTH_MESSAGES.GENERIC_ERROR);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : AUTH_MESSAGES.GENERIC_ERROR;
      toast.error(message);
    }
  };

  return {
    handleVerifyOtp,
    isLoading: verifyOtpMutation.isPending,
  };
};
