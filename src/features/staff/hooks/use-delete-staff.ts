import { useMutation, useQueryClient } from "@tanstack/react-query";
import { HTTPError } from "ky";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { STAFF_ENDPOINTS, STAFF_MESSAGES } from "@/features/staff/constants/staff.constants";
import { STAFF_DETAIL_QUERY_KEY } from "@/features/staff/hooks/use-staff-detail";
import { staffDetailService } from "@/features/staff/services/staff-detail.service";

export interface UseDeleteStaffOptions {
  restaurantId: string;
  staffId: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useDeleteStaff({
  restaurantId,
  staffId,
  onSuccess,
  onError,
}: UseDeleteStaffOptions) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { clearAuth } = useAuthStore();

  return useMutation<void, Error, void>({
    mutationFn: () => staffDetailService.deleteStaff(restaurantId, staffId),
    onSuccess: () => {
      // Evict this staff detail query from cache
      queryClient.removeQueries({
        queryKey: [STAFF_DETAIL_QUERY_KEY, restaurantId, staffId],
      });

      // Invalidate the staff listing cache
      queryClient.invalidateQueries({
        queryKey: [STAFF_ENDPOINTS.STAFF_LIST],
      });

      toast.success(STAFF_MESSAGES.STAFF_DELETE_SUCCESS);
      navigate("/restaurant/staff");
      onSuccess?.();
    },
    onError: (err: Error) => {
      let status: number | undefined;
      let errorMessage = err.message || STAFF_MESSAGES.STAFF_DELETE_ERROR;

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
