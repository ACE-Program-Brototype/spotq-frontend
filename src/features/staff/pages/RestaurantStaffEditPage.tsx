import { ArrowLeft, ChevronRight, UserCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StaffDetailOverviewCard } from "@/features/staff/components/StaffDetailCards";
import { StaffDetailErrorState } from "@/features/staff/components/StaffDetailErrorState";
import { StaffDetailSkeleton } from "@/features/staff/components/StaffDetailSkeleton";
import { StaffEditForm } from "@/features/staff/components/StaffEditForm";
import { STAFF_MESSAGES } from "@/features/staff/constants/staff.constants";
import { useStaffDetail } from "@/features/staff/hooks/use-staff-detail";

export default function RestaurantStaffEditPage() {
  return (
    <ErrorBoundary>
      <StaffEditContent />
    </ErrorBoundary>
  );
}

function StaffEditContent() {
  const navigate = useNavigate();
  const { staff, isLoading, isError, error, isForbidden, isNotFound, refetch } = useStaffDetail();

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

  const handleCancel = () => {
    navigate(`/restaurant/staff/${staff.id}`);
  };

  const handleSuccess = () => {
    navigate(`/restaurant/staff/${staff.id}`);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto w-full pb-10">
      {/* Breadcrumbs & Back Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <nav
          aria-label="Breadcrumbs"
          className="flex items-center gap-1.5 text-xs text-neutral-500 font-medium"
        >
          <Link to="/restaurant/dashboard" className="hover:text-neutral-900 transition-colors">
            Home
          </Link>
          <ChevronRight className="size-3 text-neutral-400" />
          <Link to="/restaurant/staff" className="hover:text-neutral-900 transition-colors">
            Staff
          </Link>
          <ChevronRight className="size-3 text-neutral-400" />
          <Link
            to={`/restaurant/staff/${staff.id}`}
            className="hover:text-neutral-900 transition-colors"
          >
            {staff.fullName}
          </Link>
          <ChevronRight className="size-3 text-neutral-400" />
          <span className="font-bold text-[#9a3412]">Edit Information</span>
        </nav>

        <button
          type="button"
          onClick={handleCancel}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          Cancel and Return
        </button>
      </div>

      {/* Page Title */}
      <div className="pt-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
          Edit Staff Information
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-neutral-500">
          Update employee contact records while preserving role designation and permissions.
        </p>
      </div>

      {/* Main Grid: Overview card + Edit Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <StaffDetailOverviewCard staff={staff} />
        </div>

        <div className="lg:col-span-2">
          <Card className="rounded-2xl border-[#eddcd4] bg-white shadow-2xs">
            <CardHeader className="pb-3 border-b border-[#eddcd4]/60">
              <CardTitle className="flex items-center gap-2 text-base font-bold text-neutral-900">
                <UserCheck className="size-4 text-[#e8631b]" />
                <span>Staff Profile Details</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="pt-5">
              <StaffEditForm staff={staff} onCancel={handleCancel} onSuccess={handleSuccess} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
