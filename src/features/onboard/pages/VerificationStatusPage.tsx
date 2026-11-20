import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { RESTAURANT_ROUTES } from "@/app/router/routes.constants";
import { useRestaurantLogout } from "@/features/auth/hooks/useRestaurantLogout";
import {
  getRestaurantVerificationStatus,
  type VerificationStatus,
} from "@/features/auth/services/auth.service";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { VerificationApprovedView } from "@/features/onboard/components/VerificationApprovedView";
import { VerificationRejectedView } from "@/features/onboard/components/VerificationRejectedView";
import { VerificationUnderReviewView } from "@/features/onboard/components/VerificationUnderReviewView";
import {
  ONBOARDING_MESSAGES,
  ONBOARDING_STATUS,
  ONBOARDING_TIMINGS,
  ONBOARDING_VERIFICATION_STATUS,
} from "@/features/onboard/constants/onboard.constants";

export default function VerificationStatusPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { handleLogout, isLoading: isLoggingOut } = useRestaurantLogout();
  const [status, setStatus] = useState<VerificationStatus>(
    ONBOARDING_VERIFICATION_STATUS.UNDER_REVIEW,
  );
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (status === ONBOARDING_VERIFICATION_STATUS.VERIFIED) {
      const redirectTimer = setTimeout(() => {
        navigate(RESTAURANT_ROUTES.SUBSCRIPTION, { replace: true });
      }, ONBOARDING_TIMINGS.REDIRECT_DELAY_MS);
      return () => clearTimeout(redirectTimer);
    }
  }, [status, navigate]);

  const restaurantEmail = user?.email || ONBOARDING_MESSAGES.DEFAULT_EMAIL_PLACEHOLDER;
  const restaurantId = user?.restaurantId || user?.id || user?._id;

  const fetchStatus = useCallback(
    async (isManualRefresh = false) => {
      if (isManualRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      try {
        const response = await getRestaurantVerificationStatus(restaurantId);
        if (response?.data) {
          const fetchedStatus = response.data.status;
          setStatus(fetchedStatus);
          if (response.data.rejectionReason) {
            setRejectionReason(response.data.rejectionReason);
          }
          if (fetchedStatus === ONBOARDING_VERIFICATION_STATUS.VERIFIED) {
            const currentUser = useAuthStore.getState().user;
            if (currentUser && currentUser.status !== ONBOARDING_VERIFICATION_STATUS.VERIFIED) {
              useAuthStore.getState().setUser({
                ...currentUser,
                status: ONBOARDING_VERIFICATION_STATUS.VERIFIED,
                onboardingStatus: ONBOARDING_STATUS.COMPLETED,
              });
            }
            toast.success(ONBOARDING_MESSAGES.APPROVED_REDIRECTING);
          } else if (isManualRefresh) {
            toast.info(ONBOARDING_MESSAGES.STATUS_REFRESHED(fetchedStatus));
          }
        }
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : ONBOARDING_MESSAGES.FETCH_STATUS_FAILED;
        toast.error(errorMsg);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [restaurantId],
  );

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const handleGoToSubscription = () => {
    navigate(RESTAURANT_ROUTES.SUBSCRIPTION, { replace: true });
  };

  const handleEditApplication = () => {
    navigate(RESTAURANT_ROUTES.ONBOARDING.BUSINESS_INFORMATION);
  };

  const handleCheckStatus = () => {
    fetchStatus(true);
  };

  const handleSignOut = () => {
    handleLogout();
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[360px] w-full max-w-xl items-center justify-center rounded-3xl border border-neutral-200 bg-white p-8 shadow-xs">
        <div className="flex flex-col items-center gap-3">
          <svg
            className="h-8 w-8 animate-spin text-orange-500"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          <p className="text-sm font-medium text-neutral-600">Loading verification status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl space-y-6">
      <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white p-6 shadow-xs sm:p-8">
        {status === ONBOARDING_VERIFICATION_STATUS.VERIFIED && (
          <VerificationApprovedView onProceedToSubscription={handleGoToSubscription} />
        )}

        {status === ONBOARDING_VERIFICATION_STATUS.REJECTED && (
          <VerificationRejectedView
            rejectionReason={rejectionReason}
            onEditApplication={handleEditApplication}
            onSignOut={handleSignOut}
            isLoggingOut={isLoggingOut}
          />
        )}

        {(status === ONBOARDING_VERIFICATION_STATUS.SUBMITTED ||
          status === ONBOARDING_VERIFICATION_STATUS.UNDER_REVIEW) && (
          <VerificationUnderReviewView
            status={status}
            restaurantEmail={restaurantEmail}
            isRefreshing={isRefreshing}
            onCheckStatus={handleCheckStatus}
            onSignOut={handleSignOut}
            isLoggingOut={isLoggingOut}
          />
        )}
      </div>
    </div>
  );
}
