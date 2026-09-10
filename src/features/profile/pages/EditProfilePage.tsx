/**
 * EditProfilePage Component
 * Provides an interface for authenticated customers to edit their profile details.
 * Connects to CustomerSidebar, View Customer Profile query, and Update Customer Profile mutation.
 */

import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CustomerSidebar } from "../components/CustomerSidebar";
import { EditProfileForm } from "../components/EditProfileForm";
import { ProfileSkeleton } from "../components/ProfileSkeleton";
import { PROFILE_MESSAGES } from "../constants/profile.constants";
import { useCustomerProfile } from "../hooks/use-customer-profile";
import { useUpdateCustomerProfile } from "../hooks/use-update-customer-profile";
import type { UpdateCustomerProfileDto } from "../types/profile.types";

export function EditProfilePage() {
  const navigate = useNavigate();
  const { data: profile, isLoading, isError, error, refetch, isFetching } = useCustomerProfile();
  const updateProfileMutation = useUpdateCustomerProfile();

  const handleUpdate = async (payload: UpdateCustomerProfileDto) => {
    try {
      await updateProfileMutation.mutateAsync(payload);
      toast.success(PROFILE_MESSAGES.UPDATE_SUCCESS);
      navigate("/profile");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : PROFILE_MESSAGES.UPDATE_FAILED;
      toast.error(errorMessage);
    }
  };

  const handleCancel = () => {
    navigate("/profile");
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex w-full flex-col lg:flex-row gap-8 items-start">
        <CustomerSidebar profile={profile} />

        <div className="flex flex-1 w-full flex-col gap-6 min-w-0">
          <div className="flex flex-col gap-3">
            <Link
              to="/profile"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-neutral-600 hover:text-neutral-900 transition-colors self-start"
            >
              <ArrowLeft className="size-4" />
              <span>{PROFILE_MESSAGES.BACK_TO_PROFILE}</span>
            </Link>

            <div className="flex flex-col gap-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
                {PROFILE_MESSAGES.EDIT_PROFILE}
              </h1>
              <p className="text-xs sm:text-sm font-medium text-neutral-500">
                {PROFILE_MESSAGES.EDIT_PROFILE_SUBTITLE}
              </p>
            </div>
          </div>

          {isLoading ? (
            <ProfileSkeleton />
          ) : isError ? (
            <div className="flex flex-col items-center justify-center rounded-3xl bg-white p-8 sm:p-12 text-center border border-red-100 shadow-xs gap-4">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 border border-red-100">
                <AlertCircle className="size-7" />
              </div>
              <div className="flex flex-col gap-1 max-w-md">
                <h3 className="text-lg font-bold text-neutral-900">
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
                className="mt-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold px-5 py-2.5 gap-2"
              >
                <RefreshCw className={`size-3.5 ${isFetching ? "animate-spin" : ""}`} />
                <span>{isFetching ? PROFILE_MESSAGES.RETRYING : PROFILE_MESSAGES.RETRY}</span>
              </Button>
            </div>
          ) : profile ? (
            <EditProfileForm
              profile={profile}
              onSubmit={handleUpdate}
              onCancel={handleCancel}
              isSubmitting={updateProfileMutation.isPending}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default EditProfilePage;
