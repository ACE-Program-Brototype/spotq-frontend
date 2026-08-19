import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AUTH_MESSAGES } from "../constants/auth.constants";
import type { LoginFormValues } from "../schemas/login.schema";
import { useAuthStore } from "../store/auth.store";
import { handleAuthError } from "../utils/auth-error-handler";
import { useLoginMutation } from "./use-auth-mutations";

export const useLogin = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const loginMutation = useLoginMutation();

  const handleLogin = async (values: LoginFormValues) => {
    try {
      const response = await loginMutation.mutateAsync({
        email: values.email,
        password: values.password,
      });

      if (response.success && response.data) {
        toast.success(AUTH_MESSAGES.LOGIN_SUCCESS);
        setAuth(response.data.user, response.data.access_token);
        navigate("/", { replace: true });
      } else {
        toast.error(response.message || AUTH_MESSAGES.GENERIC_ERROR);
      }
    } catch (err: unknown) {
      handleAuthError(err, "login");
    }
  };

  return {
    handleLogin,
    isLoading: loginMutation.isPending,
  };
};
