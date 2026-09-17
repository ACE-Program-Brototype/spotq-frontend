import { useState } from "react";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import { EditStaffModal } from "@/features/staff/components/EditStaffModal";
import {
  StaffDetailInfoCard,
  StaffDetailOverviewCard,
} from "@/features/staff/components/StaffDetailCards";
import { StaffDetailErrorState } from "@/features/staff/components/StaffDetailErrorState";
import { StaffDetailHeader } from "@/features/staff/components/StaffDetailHeader";
import { StaffDetailSkeleton } from "@/features/staff/components/StaffDetailSkeleton";
import { STAFF_MESSAGES } from "@/features/staff/constants/staff.constants";
import { useDeleteStaff } from "@/features/staff/hooks/use-delete-staff";
import { useStaffDetail } from "@/features/staff/hooks/use-staff-detail";
import { useUpdateStaffStatus } from "@/features/staff/hooks/use-update-staff-status";
import type { StaffStatus } from "@/features/staff/types/staff-detail.types";

export default function RestaurantStaffDetailPage() {
  return (
    <ErrorBoundary>
      <StaffDetailContent />
    </ErrorBoundary>
  );
}

function StaffDetailContent() {
  const { staff, isLoading, isPending, isError, error, isForbidden, isNotFound, refetch } =
    useStaffDetail();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const statusMutation = useUpdateStaffStatus({
    restaurantId: staff?.restaurantId || "",
    staffId: staff?.id || "",
  });

  const deleteMutation = useDeleteStaff({
    restaurantId: staff?.restaurantId || "",
    staffId: staff?.id || "",
    onSuccess: () => {
      setIsDeleteModalOpen(false);
    },
  });

  const handleToggleStatus = () => {
    if (!staff || statusMutation.isPending) return;
    const currentStatus = staff.status.toUpperCase();
    const nextStatus: StaffStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    statusMutation.mutate(nextStatus);
  };

  const handleConfirmDelete = () => {
    if (!staff || deleteMutation.isPending) return;
    deleteMutation.mutate();
  };

  // 1. Loading State
  if (isLoading || isPending) {
    return <StaffDetailSkeleton />;
  }

  // 2. Forbidden / Access Denied State
  if (isForbidden) {
    return <StaffDetailErrorState isForbidden />;
  }

  // 3. Not Found State
  if (isNotFound) {
    return <StaffDetailErrorState isNotFound />;
  }

  // 4. General Error State
  if (isError || !staff) {
    return (
      <StaffDetailErrorState
        message={error?.message || STAFF_MESSAGES.FETCH_STAFF_DETAIL_ERROR}
        onRetry={() => refetch()}
      />
    );
  }

  // 5. Successful Staff Details View
  return (
    <div className="space-y-6 max-w-5xl mx-auto w-full pb-10">
      {/* Header section with breadcrumbs and actions */}
      <StaffDetailHeader
        staff={staff}
        onEditStaff={() => setIsEditModalOpen(true)}
        onToggleStatus={handleToggleStatus}
        onRequestDelete={() => setIsDeleteModalOpen(true)}
        isUpdatingStatus={statusMutation.isPending}
        isDeleting={deleteMutation.isPending}
      />

      {/* Main details grid: Overview card + Information card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <StaffDetailOverviewCard staff={staff} />
        </div>
        <div className="lg:col-span-2">
          <StaffDetailInfoCard staff={staff} />
        </div>
      </div>

      {/* Edit Staff Information Modal */}
      <EditStaffModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        staff={staff}
      />

      {/* Delete / Remove Confirmation Dialog */}
      <ConfirmDialog
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title={STAFF_MESSAGES.STAFF_DELETE_CONFIRM_TITLE}
        description={STAFF_MESSAGES.STAFF_DELETE_CONFIRM_DESCRIPTION}
        confirmText={STAFF_MESSAGES.ACTION_REMOVE}
        cancelText={STAFF_MESSAGES.ACTION_CANCEL}
        confirmVariant="destructive"
        isLoading={deleteMutation.isPending}
        loadingText="Removing..."
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
}
