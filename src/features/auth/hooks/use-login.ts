import { isHTTPError } from "ky";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { NormalizedApiErrorData } from "@/lib/api/hooks/beforeError";
import { AUTH_MESSAGES } from "../constants/auth.constants";
import type { LoginFormValues } from "../schemas/login.schema";
import { useAuthStore } from "../store/auth.store";
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
        setAuth({ ...response.data.user, role: "CUSTOMER" }, response.data.accessToken);
        navigate("/", { replace: true });
      } else {
        toast.error(response.message || AUTH_MESSAGES.GENERIC_ERROR);
      }
    } catch (err: unknown) {
      const errorData =
        isHTTPError<NormalizedApiErrorData>(err) &&
        typeof err.data === "object" &&
        err.data !== null
          ? err.data
          : undefined;

      const isUnverified =
        (isHTTPError(err) &&
          (err.response.status === 403 || errorData?.code === "EMAIL_NOT_VERIFIED") &&
          (errorData?.code === "EMAIL_NOT_VERIFIED" || /not verified/i.test(err.message))) ||
        (err instanceof Error && /not verified/i.test(err.message));

      if (isUnverified) {
        toast.info(AUTH_MESSAGES.EMAIL_NOT_VERIFIED_PROMPT);
        navigate(`/verify-otp?email=${encodeURIComponent(values.email)}`);
        return;
      }

      const message = err instanceof Error ? err.message : AUTH_MESSAGES.LOGIN_FAILED;
      toast.error(message);
    }
  };

  return {
    handleLogin,
    isLoading: loginMutation.isPending,
  };
};
