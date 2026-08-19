import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import type { LoginFormValues } from "@/features/auth/schemas/login.schema";
import { loginAdmin } from "@/features/auth/services/auth.service";
import { useAuthStore } from "@/features/auth/store/auth.store";

export function useLogin() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (data: LoginFormValues) => loginAdmin(data),
    onSuccess: ({ access_token, user }) => {
      localStorage.setItem("accessToken", access_token);
      setUser(user);
      toast.success("Welcome back! Redirecting to dashboard…");
      navigate("/admin/dashboard", { replace: true });
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Login failed. Please try again.");
    },
  });
}
