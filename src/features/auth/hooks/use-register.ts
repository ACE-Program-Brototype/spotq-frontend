import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AUTH_MESSAGES } from "../constants/auth.constants";
import type { RegisterFormValues } from "../schemas/register.schema";
import { useRegisterMutation } from "./use-auth-mutations";

export const useRegister = () => {
  const navigate = useNavigate();
  const registerMutation = useRegisterMutation();

  const handleRegister = async (values: RegisterFormValues) => {
    try {
      const response = await registerMutation.mutateAsync({
        fullName: values.fullName,
        email: values.email,
        phoneNumber: values.phoneNumber,
        password: values.password,
      });

      if (response.success) {
        toast.success(response.message || AUTH_MESSAGES.OTP_SENT_SUCCESS);

        navigate(`/verify-otp?email=${encodeURIComponent(values.email)}`, { replace: true });
      } else {
        toast.error(response.message || AUTH_MESSAGES.GENERIC_ERROR);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : AUTH_MESSAGES.GENERIC_ERROR;
      toast.error(message);
    }
  };

  return {
    handleRegister,
    isLoading: registerMutation.isPending,
  };
};
