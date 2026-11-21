import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { RESTAURANT_ROUTES } from "@/app/router/routes.constants";
import { AUTH_MESSAGES } from "@/features/auth/constants/auth.constants";
import { logoutRestaurant } from "@/features/auth/services/restaurant-auth.service";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useOnboardStore } from "@/features/onboard/store/onboard.store";

export function useRestaurantLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const resetOnboardStore = useOnboardStore((state) => state.resetOnboardStore);

  const mutation = useMutation({
    mutationFn: logoutRestaurant,
    onSettled: () => {
      clearAuth();
      resetOnboardStore();
      queryClient.clear();
      toast.success(AUTH_MESSAGES.LOGOUT_SUCCESS);
      navigate(RESTAURANT_ROUTES.LOGIN, { replace: true });
    },
  });

  return {
    handleLogout: () => mutation.mutate(),
    isLoading: mutation.isPending,
  };
}

export default useRestaurantLogout;
