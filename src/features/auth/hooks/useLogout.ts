import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { logoutAdmin } from "@/features/auth/services/auth.service";
import { useAuthStore } from "@/features/auth/store/auth.store";

export function useLogout() {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    mutationFn: logoutAdmin,
    onSuccess: () => {
      localStorage.removeItem("accessToken");
      clearAuth();
      toast.success("Logged out successfully.");
      navigate("/admin/login", { replace: true });
    },
    onError: (error: Error) => {
      // Clean up local auth even if backend error occurs
      localStorage.removeItem("accessToken");
      clearAuth();
      toast.error(error.message ?? "Logout encountered an issue.");
      navigate("/admin/login", { replace: true });
    },
  });
}
