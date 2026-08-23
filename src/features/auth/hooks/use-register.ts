import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AUTH_MESSAGES } from "../constants/auth.constants";
import type { RegisterFormValues } from "../schemas/register.schema";
import { useAuthStore } from "../store/auth.store";
import { handleAuthError } from "../utils/auth-error-handler";
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

        navigate("/", { replace: true });
      } else {
        toast.error(response.message || AUTH_MESSAGES.GENERIC_ERROR);
      }
    } catch (err: unknown) {
      await handleAuthError(err, "register");
    }
  };

  return {
    handleRegister,
    isLoading: registerMutation.isPending,
  };
};
