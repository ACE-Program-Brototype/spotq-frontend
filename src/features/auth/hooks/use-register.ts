import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AUTH_MESSAGES } from "../constants/auth.constants";
import type { RegisterFormValues } from "../schemas/register.schema";
import { useAuthStore } from "../store/auth.store";
import { useRegisterMutation } from "./use-auth-mutations";

export const useRegister = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const registerMutation = useRegisterMutation();

  const handleRegister = async (values: RegisterFormValues) => {
    try {
      const response = await registerMutation.mutateAsync({
        fullName: values.fullName,
        email: values.email,
        phoneNumber: values.phoneNumber,
        password: values.password,
      });

      if (response.success && response.data) {
        toast.success(AUTH_MESSAGES.REGISTER_SUCCESS);

        setAuth(response.data.user, response.data.accessToken);

        navigate(`/verify-otp?email=${response.data.user.email}`, { replace: true });
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
