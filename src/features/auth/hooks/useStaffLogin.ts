import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AUTH_MESSAGES } from "@/features/auth/constants/auth.constants";
import { useAuthStore } from "@/features/auth/store/auth.store";
import type { StaffLoginInput, StaffRestaurantOption } from "@/features/auth/types/auth.types";
import { useStaffLoginMutation, useStaffSelectRestaurantMutation } from "./use-auth-mutations";

export interface RestaurantSelectionData {
  selectToken: string;
  restaurants: StaffRestaurantOption[];
}

export const useStaffLogin = () => {
  const navigate = useNavigate();

  const setAuth = useAuthStore((state) => state.setAuth);

  const staffLoginMutation = useStaffLoginMutation();
  const selectRestaurantMutation = useStaffSelectRestaurantMutation();

  const [selectionData, setSelectionData] = useState<RestaurantSelectionData | null>(null);

  const handleStaffLogin = async (values: StaffLoginInput) => {
    try {
      const response = await staffLoginMutation.mutateAsync({
        email: values.email,
        password: values.password,
      });

      if (response.success && response.data) {
        if (response.data.requiresRestaurantSelection && response.data.selectToken) {
          setSelectionData({
            selectToken: response.data.selectToken,
            restaurants: response.data.restaurants || [],
          });
          return;
        }

        setAuth(
          {
            ...response.data.user,
            email: response.data.user?.email || values.email,
            role: "STAFF",
          },
          response.data.accessToken || "",
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

  const handleSelectRestaurant = async (restaurantId: string) => {
    if (!selectionData?.selectToken) return;

    try {
      const response = await selectRestaurantMutation.mutateAsync({
        selectToken: selectionData.selectToken,
        restaurantId,
      });

      if (response.success && response.data) {
        setAuth(
          {
            ...response.data.user,
            email: response.data.user?.email || "",
            role: "STAFF",
          },
          response.data.accessToken || "",
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

  const handleBackToLogin = () => {
    setSelectionData(null);
  };

  return {
    handleStaffLogin,
    handleSelectRestaurant,
    handleBackToLogin,
    selectionData,
    isLoading: staffLoginMutation.isPending || selectRestaurantMutation.isPending,
    isSelecting: selectRestaurantMutation.isPending,
  };
};
