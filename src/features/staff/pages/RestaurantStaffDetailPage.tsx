import { useState } from "react";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import {
  StaffDetailInfoCard,
  StaffDetailOverviewCard,
} from "@/features/staff/components/StaffDetailCards";
import { StaffDetailErrorState } from "@/features/staff/components/StaffDetailErrorState";
import { StaffDetailHeader } from "@/features/staff/components/StaffDetailHeader";
import { StaffDetailSkeleton } from "@/features/staff/components/StaffDetailSkeleton";
import { STAFF_MESSAGES } from "@/features/staff/constants/staff.constants";
import { useStaffDetail } from "@/features/staff/hooks/use-staff-detail";

export default function RestaurantStaffDetailPage() {
  return (
    <ErrorBoundary>
      <StaffDetailContent />
    </ErrorBoundary>
  );
}

function StaffDetailContent() {
  const { staff, isLoading, isError, error, isForbidden, isNotFound, refetch } = useStaffDetail();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [uiStatus, setUiStatus] = useState<string | null>(null);

  // Active / Inactive button is UI-only in this story
  const handleToggleStatus = () => {
    if (!staff) return;
    const currentStatus = uiStatus || staff.status;
    const nextStatus = currentStatus.toUpperCase() === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    setUiStatus(nextStatus);
  };

  // Remove staff button is UI-only in this story
  const handleConfirmDelete = () => {
    setIsDeleteModalOpen(false);
  };

  // 1. Loading State
  if (isLoading) {
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

  const effectiveStaff = {
    ...staff,
    status: uiStatus || staff.status,
  };

  // 5. Successful Staff Details View
  return (
    <div className="space-y-6 max-w-5xl mx-auto w-full pb-10">
      {/* Header section with breadcrumbs and actions */}
      <StaffDetailHeader
        staff={effectiveStaff}
        onToggleStatus={handleToggleStatus}
        onRequestDelete={() => setIsDeleteModalOpen(true)}
      />

      {/* Main details grid: Overview card + Information card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <StaffDetailOverviewCard staff={effectiveStaff} />
        </div>
        <div className="lg:col-span-2">
          <StaffDetailInfoCard staff={effectiveStaff} />
        </div>
      </div>

      {/* Delete / Remove Confirmation Dialog (UI-only in this story) */}
      <ConfirmDialog
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title={STAFF_MESSAGES.STAFF_DELETE_CONFIRM_TITLE}
        description={STAFF_MESSAGES.STAFF_DELETE_CONFIRM_DESCRIPTION}
        confirmText="Remove Staff"
        cancelText="Cancel"
        confirmVariant="destructive"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
}
