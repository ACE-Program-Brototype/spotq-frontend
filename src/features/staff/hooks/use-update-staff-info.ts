import { useMutation, useQueryClient } from "@tanstack/react-query";
import { HTTPError } from "ky";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { STAFF_MESSAGES } from "@/features/staff/constants/staff.constants";
import { STAFF_DETAIL_QUERY_KEY } from "@/features/staff/hooks/use-staff-detail";
import { staffDetailService } from "@/features/staff/services/staff-detail.service";
import type {
  StaffDetail,
  UpdateStaffInfoPayload,
} from "@/features/staff/types/staff-detail.types";

export interface UseUpdateStaffInfoOptions {
  restaurantId: string;
  staffId: string;
  onSuccess?: (data: StaffDetail) => void;
  onError?: (error: Error) => void;
}

export function useUpdateStaffInfo({
  restaurantId,
  staffId,
  onSuccess,
  onError,
}: UseUpdateStaffInfoOptions) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { clearAuth } = useAuthStore();

  return useMutation<StaffDetail, Error, UpdateStaffInfoPayload>({
    mutationFn: (payload: UpdateStaffInfoPayload) =>
      staffDetailService.updateStaffInfo(restaurantId, staffId, payload),
    onSuccess: (updatedStaff) => {
      // Synchronize cache immediately with server truth
      queryClient.setQueryData([STAFF_DETAIL_QUERY_KEY, restaurantId, staffId], updatedStaff);

      // Invalidate queries to ensure consistent state
      queryClient.invalidateQueries({
        queryKey: [STAFF_DETAIL_QUERY_KEY, restaurantId, staffId],
      });

      toast.success(STAFF_MESSAGES.STAFF_UPDATE_SUCCESS);
      onSuccess?.(updatedStaff);
    },
    onError: (err: Error) => {
      let status: number | undefined;
      let errorMessage = err.message || STAFF_MESSAGES.STAFF_UPDATE_ERROR;

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
