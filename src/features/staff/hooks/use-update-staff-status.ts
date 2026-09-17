import { useMutation, useQueryClient } from "@tanstack/react-query";
import { HTTPError } from "ky";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { STAFF_ENDPOINTS, STAFF_MESSAGES } from "@/features/staff/constants/staff.constants";
import { STAFF_DETAIL_QUERY_KEY } from "@/features/staff/hooks/use-staff-detail";
import { staffDetailService } from "@/features/staff/services/staff-detail.service";
import type { StaffDetail, StaffStatus } from "@/features/staff/types/staff-detail.types";

export interface UseUpdateStaffStatusOptions {
  restaurantId: string;
  staffId: string;
  onSuccess?: (data: StaffDetail) => void;
  onError?: (error: Error) => void;
}

export function useUpdateStaffStatus({
  restaurantId,
  staffId,
  onSuccess,
  onError,
}: UseUpdateStaffStatusOptions) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { clearAuth } = useAuthStore();

  return useMutation<StaffDetail, Error, StaffStatus>({
    mutationFn: (status: StaffStatus) =>
      staffDetailService.updateStaffStatus(restaurantId, staffId, status),
    onSuccess: (updatedStaff, status) => {
      // Synchronize cache immediately with server truth
      queryClient.setQueryData([STAFF_DETAIL_QUERY_KEY, restaurantId, staffId], updatedStaff);

      // Invalidate queries to ensure consistent state across views
      queryClient.invalidateQueries({
        queryKey: [STAFF_DETAIL_QUERY_KEY, restaurantId, staffId],
      });
      queryClient.invalidateQueries({
        queryKey: [STAFF_ENDPOINTS.STAFF_LIST],
      });

      const message =
        status === "ACTIVE"
          ? STAFF_MESSAGES.STAFF_ACTIVATE_SUCCESS
          : STAFF_MESSAGES.STAFF_DEACTIVATE_SUCCESS;

      toast.success(message);
      onSuccess?.(updatedStaff);
    },
    onError: (err: Error) => {
      let status: number | undefined;
      let errorMessage = err.message || STAFF_MESSAGES.STAFF_STATUS_UPDATE_ERROR;

      if (err instanceof HTTPError) {
        status = err.response?.status;
      } else if (typeof (err as { status?: number }).status === "number") {
        status = (err as { status?: number }).status;
      }

      if (status === 401) {
        clearAuth();
        toast.error("Session expired. Please sign in again.");
        navigate("/restaurant/email/verification", { replace: true });
        onError?.(err);
        return;
      }

      if (status === 403) {
        errorMessage = STAFF_MESSAGES.STAFF_FORBIDDEN;
      } else if (status === 404) {
        errorMessage = STAFF_MESSAGES.STAFF_NOT_FOUND;
      }

      toast.error(errorMessage);
      onError?.(err);
    },
  });
}
