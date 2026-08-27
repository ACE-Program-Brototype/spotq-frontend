import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AUTH_MESSAGES } from "../constants/auth.constants";
import { useAuthStore } from "../store/auth.store";
import { handleAuthError } from "../utils/auth-error-handler";
import { useGoogleLoginMutation } from "./use-auth-mutations";

export const useGoogleAuth = (destination = "/") => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const googleLoginMutation = useGoogleLoginMutation();

  const handleGoogleSuccess = useCallback(
    async (response: { credential: string }) => {
      try {
        const res = await googleLoginMutation.mutateAsync({
          idToken: response.credential,
        });

        if (res.success && res.data) {
          toast.success(AUTH_MESSAGES.GOOGLE_SUCCESS);

          setAuth(res.data.user, res.data.accessToken);

          navigate(destination, {
            replace: true,
          });

          return;
        }

        toast.error(res.message || AUTH_MESSAGES.GOOGLE_FAILED);
      } catch (err: unknown) {
        await handleAuthError(err, "google");
      }
    },
    [googleLoginMutation, setAuth, navigate, destination],
  );

  return {
    handleGoogleSuccess,
    isLoading: googleLoginMutation.isPending,
  };
};
