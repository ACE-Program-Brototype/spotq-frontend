import { AlertCircle, Edit3, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CustomerSidebar } from "../components/CustomerSidebar";
import { ProfileDeliveryAddressCard } from "../components/ProfileDeliveryAddressCard";
import { ProfileHeroCard } from "../components/ProfileHeroCard";
import { ProfileInfoCards } from "../components/ProfileInfoCards";
import { ProfileSkeleton } from "../components/ProfileSkeleton";
import { useCustomerProfile } from "../hooks/use-customer-profile";

export function ViewProfilePage() {
  const { data: profile, isLoading, isError, error, refetch, isFetching } = useCustomerProfile();

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex w-full flex-col lg:flex-row gap-8 items-start">
        {/* Customer Sidebar (Desktop / Tablet) */}
        <CustomerSidebar profile={profile} />

        {/* Main Content Area */}
        <div className="flex flex-1 w-full flex-col gap-6 min-w-0">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
                My Profile
              </h1>
              <p className="text-xs sm:text-sm font-medium text-neutral-500">
                Manage your personal information and account settings
              </p>
            </div>

            <Link
              to="/profile/edit"
              aria-label="Edit Profile"
              className="inline-flex items-center self-start sm:self-auto bg-[#ff6b00] hover:bg-[#e86100] text-white rounded-2xl font-bold gap-2 px-5 py-2.5 shadow-xs transition-all active:scale-98 text-sm"
            >
              <Edit3 className="size-4" />
              <span>Edit Profile</span>
            </Link>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <ProfileSkeleton />
          ) : isError ? (
            /* Error State */
            <div className="flex flex-col items-center justify-center rounded-3xl bg-white p-8 sm:p-12 text-center border border-red-100 shadow-xs gap-4">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 border border-red-100">
                <AlertCircle className="size-7" />
              </div>
              <div className="flex flex-col gap-1 max-w-md">
                <h3 className="text-lg font-bold text-neutral-900">Failed to load profile</h3>
                <p className="text-xs sm:text-sm text-neutral-500">
                  {error?.message ||
                    "We encountered an issue retrieving your profile information. Please try again."}
                </p>
              </div>
              <Button
                type="button"
                onClick={() => refetch()}
                disabled={isFetching}
                className="mt-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold px-5 py-2.5 gap-2"
              >
                <RefreshCw className={`size-3.5 ${isFetching ? "animate-spin" : ""}`} />
                <span>{isFetching ? "Retrying..." : "Retry"}</span>
              </Button>
            </div>
          ) : profile ? (
            /* Success State */
            <div className="flex flex-col gap-6">
              {/* Profile Hero Card */}
              <ProfileHeroCard profile={profile} />

              {/* 4 Info Cards */}
              <ProfileInfoCards profile={profile} />

              {/* Delivery Address & Map Visual */}
              <ProfileDeliveryAddressCard profile={profile} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default ViewProfilePage;
