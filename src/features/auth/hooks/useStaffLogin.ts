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
  email: string;
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
        if (response.data.requiresRestaurantSelection) {
          if (!response.data.selectToken) {
            toast.error(response.message || "Selection token missing from server response");
            return;
          }
          setSelectionData({
            selectToken: response.data.selectToken,
            restaurants: response.data.restaurants || [],
            email: values.email,
          });
          return;
        }

        if (!response.data.accessToken) {
          toast.error(response.message || AUTH_MESSAGES.LOGIN_FAILED);
          return;
        }

        const rawUser = response.data.user;
        const fullname =
          (rawUser as { fullname?: string })?.fullname || rawUser?.fullName || rawUser?.name;

        setAuth(
          {
            ...rawUser,
            name: fullname || rawUser?.name,
            fullName: fullname || rawUser?.fullName,
            email: rawUser?.email || values.email,
            role: "STAFF",
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

  const handleSelectRestaurant = async (restaurantId: string) => {
    if (!selectionData?.selectToken) return;

    try {
      const response = await selectRestaurantMutation.mutateAsync({
        selectToken: selectionData.selectToken,
        restaurantId,
      });

      if (response.success && response.data) {
        if (!response.data.accessToken) {
          toast.error(response.message || "Access token missing from server response");
          return;
        }

        const rawUser = response.data.user;
        const fullname =
          (rawUser as { fullname?: string })?.fullname || rawUser?.fullName || rawUser?.name;

        setAuth(
          {
            ...rawUser,
            name: fullname || rawUser?.name,
            fullName: fullname || rawUser?.fullName,
            email: rawUser?.email || selectionData.email || "",
            role: "STAFF",
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
