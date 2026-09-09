import { ChevronRight, Pencil } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import { Button } from "@/components/ui/button";
import {
  StaffPersonalDetailsCard,
  StaffProfileOverviewCard,
} from "../components/StaffProfileCards";
import { StaffProfileErrorState } from "../components/StaffProfileErrorState";
import { StaffProfileSkeleton } from "../components/StaffProfileSkeleton";
import { PROFILE_MESSAGES } from "../constants/profile.constants";
import { useStaffProfile } from "../hooks/useStaffProfile";

export default function StaffProfilePage() {
  return (
    <ErrorBoundary>
      <StaffProfileContent />
    </ErrorBoundary>
  );
}

function StaffProfileContent() {
  const navigate = useNavigate();
  const { profile, isLoading, isError, error, refetch, isFetching } = useStaffProfile();

  const handleEditProfile = () => {
    navigate("/staff/profile/edit");
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto w-full pb-10">
      {/* Header section with Breadcrumb & Action buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          {/* Breadcrumb Navigation */}
          <nav
            aria-label="Breadcrumbs"
            className="flex items-center gap-1.5 text-xs text-neutral-500 mb-1.5"
          >
            <Link to="/staff/dashboard" className="hover:text-neutral-900 transition-colors">
              Dashboard
            </Link>
            <ChevronRight className="size-3 text-neutral-400" />
            <span className="font-bold text-[#9a3412]">Staff Profile</span>
          </nav>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
            Staff Profile
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1 font-medium">
            {PROFILE_MESSAGES.PAGE_SUBTITLE}
          </p>
        </div>

        {/* Top-Right Action Button */}
        <div className="flex items-center self-start sm:self-auto">
          <Button
            type="button"
            onClick={handleEditProfile}
            className="bg-[#9a3412] hover:bg-[#7c2d12] text-white rounded-xl px-5 py-2 text-sm font-bold h-10 shadow-sm transition-all inline-flex items-center gap-2"
          >
            <Pencil className="size-4" />
            <span>Edit Profile</span>
          </Button>
        </div>
      </div>

      {/* Conditional Rendering: Loading, Error, or Profile Content */}
      {isLoading ? (
        <StaffProfileSkeleton />
      ) : isError ? (
        <StaffProfileErrorState
          message={error?.message || PROFILE_MESSAGES.FETCH_ERROR}
          onRetry={() => refetch()}
          isRetrying={isFetching}
        />
      ) : profile ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Staff Overview */}
          <div className="lg:col-span-4">
            <StaffProfileOverviewCard profile={profile} />
          </div>

          {/* Right Column: Personal Details */}
          <div className="lg:col-span-8">
            <StaffPersonalDetailsCard profile={profile} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
