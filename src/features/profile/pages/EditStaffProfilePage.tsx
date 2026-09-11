import { HTTPError } from "ky";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import { EditStaffProfileForm } from "../components/EditStaffProfileForm";
import { StaffProfileErrorState } from "../components/StaffProfileErrorState";
import { StaffProfileSkeleton } from "../components/StaffProfileSkeleton";
import { PROFILE_MESSAGES } from "../constants/profile.constants";
import { useUpdateStaffProfile } from "../hooks/use-update-staff-profile";
import { useStaffProfile } from "../hooks/useStaffProfile";
import type { UpdateStaffProfileDto } from "../types/profile.types";

export default function EditStaffProfilePage() {
  return (
    <ErrorBoundary>
      <EditStaffProfileContent />
    </ErrorBoundary>
  );
}

export function EditStaffProfileContent() {
  const navigate = useNavigate();
  const { profile, isLoading, isError, error, refetch, isFetching } = useStaffProfile();
  const updateStaffProfileMutation = useUpdateStaffProfile();

  const handleUpdate = async (payload: UpdateStaffProfileDto) => {
    if (!profile) return;

    try {
      await updateStaffProfileMutation.mutateAsync({
        restaurantId: profile.restaurantId,
        staffId: profile.id,
        payload,
      });

      toast.success(PROFILE_MESSAGES.STAFF_UPDATE_SUCCESS);
      navigate("/staff/profile");
    } catch (err: unknown) {
      let status: number | undefined;

      if (err instanceof HTTPError && err.response) {
        status = err.response.status;
      } else if (typeof err === "object" && err !== null && "status" in err) {
        status = (err as { status: number }).status;
      }

      if (status === 401) {
        // Session expired handled by mutation hook and auth store
        return;
      }

      if (status === 403) {
        toast.error(PROFILE_MESSAGES.STAFF_FORBIDDEN);
      } else if (status === 404) {
        toast.error(PROFILE_MESSAGES.STAFF_NOT_FOUND);
      } else if (status === 400) {
        const errorMsg =
          err instanceof Error && err.message
            ? err.message
            : "Invalid profile data provided. Please check the fields.";
        toast.error(errorMsg);
      } else {
        toast.error(PROFILE_MESSAGES.STAFF_UPDATE_FAILED);
      }
    }
  };

  const handleCancel = () => {
    navigate("/staff/profile");
  };

  if (isLoading) {
    return <StaffProfileSkeleton />;
  }

  if (isError) {
    return (
      <StaffProfileErrorState
        message={error?.message || PROFILE_MESSAGES.FETCH_ERROR}
        onRetry={() => refetch()}
        isRetrying={isFetching}
      />
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <EditStaffProfileForm
      profile={profile}
      onSubmit={handleUpdate}
      onCancel={handleCancel}
      isSubmitting={updateStaffProfileMutation.isPending}
    />
  );
}
