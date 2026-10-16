import { isHTTPError } from "ky";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { CUSTOMER_ROUTES } from "@/app/router/routes.constants";
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
        navigate(CUSTOMER_ROUTES.HOME, { replace: true });
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

      const errorCode =
        errorData?.code ||
        (errorData as { error?: { code?: string } } | undefined)?.error?.code ||
        (typeof (errorData as { error?: string } | undefined)?.error === "string"
          ? (errorData as { error?: string }).error
          : undefined);

      const isUnverified =
        errorCode === "EMAIL_NOT_VERIFIED" ||
        (isHTTPError(err) &&
          err.response.status === 403 &&
          /email.*(?:not verified|verification)/i.test(err.message)) ||
        (err instanceof Error && /email.*(?:not verified|verification)/i.test(err.message));

      if (isUnverified) {
        toast.info(AUTH_MESSAGES.EMAIL_NOT_VERIFIED_PROMPT);
        navigate(
          `${CUSTOMER_ROUTES.AUTH.VERIFY_OTP}?email=${encodeURIComponent(values.email.trim().toLowerCase())}`,
        );
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
