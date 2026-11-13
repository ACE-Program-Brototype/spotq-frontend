/**
 * ViewProfilePage Component
 * Displays the authenticated customer's profile details including hero card,
 * personal details, and contact info.
 */

import { AlertCircle, Edit3, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { CUSTOMER_ROUTES } from "@/app/router/routes.constants";
import { Button } from "@/components/ui/button";
import { CustomerSidebar } from "../components/CustomerSidebar";
import { ProfileHeroCard } from "../components/ProfileHeroCard";
import { ProfileInfoCards } from "../components/ProfileInfoCards";
import { ProfileSkeleton } from "../components/ProfileSkeleton";
import { PROFILE_MESSAGES } from "../constants/profile.constants";
import { useCustomerProfile } from "../hooks/use-customer-profile";

export function ViewProfilePage() {
  const { data: profile, isLoading, isError, error, refetch, isFetching } = useCustomerProfile();

  return (
    <div className="flex w-full flex-col gap-4 sm:gap-6">
      <div className="flex w-full flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 items-start">
        <CustomerSidebar profile={profile} />

        <div className="flex flex-1 w-full flex-col gap-4 sm:gap-6 min-w-0">
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col gap-0.5 sm:gap-1 min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-neutral-900 truncate">
                {PROFILE_MESSAGES.MY_PROFILE}
              </h1>
              <p className="text-[11px] sm:text-sm font-medium text-neutral-500 truncate">
                {PROFILE_MESSAGES.PROFILE_HEADER_SUBTITLE}
              </p>
            </div>

            <Link
              to={CUSTOMER_ROUTES.PROFILE.EDIT}
              aria-label={PROFILE_MESSAGES.EDIT_PROFILE}
              className="inline-flex items-center shrink-0 bg-[#ff6b00] hover:bg-[#e86100] text-white rounded-xl sm:rounded-2xl font-bold gap-1.5 sm:gap-2 px-3.5 py-2 sm:px-5 sm:py-2.5 shadow-xs transition-all active:scale-98 text-xs sm:text-sm cursor-pointer"
            >
              <Edit3 className="size-3.5 sm:size-4" />
              <span>{PROFILE_MESSAGES.EDIT_PROFILE}</span>
            </Link>
          </div>

          {isLoading ? (
            <ProfileSkeleton />
          ) : isError ? (
            <div className="flex flex-col items-center justify-center rounded-2xl sm:rounded-3xl bg-white p-6 sm:p-12 text-center border border-red-100 shadow-xs gap-3 sm:gap-4">
              <div className="flex size-12 sm:size-14 items-center justify-center rounded-xl sm:rounded-2xl bg-red-50 text-red-600 border border-red-100">
                <AlertCircle className="size-6 sm:size-7" />
              </div>
              <div className="flex flex-col gap-1 max-w-md">
                <h3 className="text-base sm:text-lg font-bold text-neutral-900">
                  {PROFILE_MESSAGES.FETCH_FAILED}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-500">
                  {error?.message || PROFILE_MESSAGES.FETCH_FAILED_DESCRIPTION}
                </p>
              </div>
              <Button
                type="button"
                onClick={() => refetch()}
                disabled={isFetching}
                className="mt-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold px-4 py-2 sm:px-5 sm:py-2.5 gap-2 cursor-pointer"
              >
                <RefreshCw className={`size-3.5 ${isFetching ? "animate-spin" : ""}`} />
                <span>{isFetching ? PROFILE_MESSAGES.RETRYING : PROFILE_MESSAGES.RETRY}</span>
              </Button>
            </div>
          ) : profile ? (
            <div className="flex flex-col gap-4 sm:gap-6">
              <ProfileHeroCard profile={profile} />
              <ProfileInfoCards profile={profile} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default ViewProfilePage;
