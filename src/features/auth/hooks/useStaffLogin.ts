import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AUTH_MESSAGES } from "@/features/auth/constants/auth.constants";
import { useAuthStore } from "@/features/auth/store/auth.store";
import type { StaffLoginInput } from "@/features/auth/types/auth.types";
import { useStaffLoginMutation } from "./use-auth-mutations";

export const useStaffLogin = () => {
  const navigate = useNavigate();

  const setAuth = useAuthStore((state) => state.setAuth);

  const staffLoginMutation = useStaffLoginMutation();

  const handleStaffLogin = async (values: StaffLoginInput) => {
    try {
      const response = await staffLoginMutation.mutateAsync({
        email: values.email,
        password: values.password,
      });

      if (response.success && response.data) {
        setAuth(
          {
            ...response.data.user,
            role: "RESTAURANT_STAFF",
          },
          response.data.accessToken,
        );

        toast.success(response.message || "Staff login successful!");

        navigate("/staff/dashboard", {
          replace: true,
        });

        return;
      }

      toast.error(response.message || AUTH_MESSAGES.LOGIN_FAILED);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : AUTH_MESSAGES.LOGIN_FAILED;

      toast.error(message);
    }
  };

  return {
    handleStaffLogin,
    isLoading: staffLoginMutation.isPending,
  };
};
