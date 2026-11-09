import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RESTAURANT_ROUTES } from "@/app/router/routes.constants";
import { useAuthStore } from "@/features/auth/store/auth.store";
import type { User } from "@/features/auth/types/auth.types";
import { RenewalModal } from "@/features/subscription/components/RenewalModal";
import { SubscriptionExpiryBanner } from "@/features/subscription/components/SubscriptionExpiryBanner";
import { SubscriptionOverviewCard } from "@/features/subscription/components/SubscriptionOverviewCard";
import {
  RESTAURANT_DASHBOARD_TEXTS,
  RESTAURANT_VERIFICATION_STATUSES,
  SUBSCRIPTION_QUERY_KEYS,
} from "@/features/subscription/constants/subscription.constants";
import { subscriptionService } from "@/features/subscription/services/subscription.service";

export default function RestaurantDashboardPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, clearAuth, setUser } = useAuthStore();
  const [isRenewalModalOpen, setIsRenewalModalOpen] = useState(false);

  const restaurantEmail = user?.email || RESTAURANT_DASHBOARD_TEXTS.DEFAULT_RESTAURANT_NAME;

  const {
    data: statusData,
    isLoading: isLoadingStatus,
    isError: isStatusError,
  } = useQuery({
    queryKey: SUBSCRIPTION_QUERY_KEYS.RESTAURANT_STATUS,
    queryFn: () => subscriptionService.fetchRestaurantStatus(),
    retry: 1,
  });

  const isSubscriptionActive = statusData?.isSubscriptionActive ?? false;

  const {
    data: plans = [],
    isLoading: isLoadingPlans,
    isError: isPlansError,
    refetch: refetchPlans,
  } = useQuery({
    queryKey: SUBSCRIPTION_QUERY_KEYS.PLANS,
    queryFn: () => subscriptionService.fetchPlans(),
    enabled: isRenewalModalOpen,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const userStatus = user?.status ?? statusData?.verificationStatus;
  const isApprovedOrActive =
    userStatus === RESTAURANT_VERIFICATION_STATUSES.APPROVED ||
    userStatus === RESTAURANT_VERIFICATION_STATUSES.ACTIVE ||
    userStatus === RESTAURANT_VERIFICATION_STATUSES.VERIFIED;
  const needsSubscription = isApprovedOrActive && !isSubscriptionActive && !isStatusError;

  useEffect(() => {
    if (statusData?.verificationStatus && user) {
      if (user.status !== statusData.verificationStatus) {
        setUser({
          ...user,
          status: statusData.verificationStatus as User["status"],
          onboardingStatus: "COMPLETED",
        });
      }
    }
  }, [statusData, user, setUser]);

  useEffect(() => {
    if (!isLoadingStatus && needsSubscription) {
      navigate(RESTAURANT_ROUTES.SUBSCRIPTION, { replace: true });
    }
  }, [isLoadingStatus, needsSubscription, navigate]);

  if (!isLoadingStatus && needsSubscription) {
    return null;
  }

  const handleLogout = () => {
    clearAuth();
    queryClient.clear();
    navigate(RESTAURANT_ROUTES.LOGIN, { replace: true });
  };

  return (
    <div className="space-y-6 max-w-full">
      <div className="rounded-2xl border border-[#eddcd4] bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#9a3412]">
              {RESTAURANT_DASHBOARD_TEXTS.BADGE}
            </p>
            <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-neutral-900">
              {`${RESTAURANT_DASHBOARD_TEXTS.WELCOME_PREFIX}${statusData?.restaurantName || restaurantEmail}`}
            </h1>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="self-start sm:self-auto rounded-xl border border-[#eddcd4] px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-[#faf7f5] transition-colors"
          >
            Logout
          </button>
        </div>

        <SubscriptionExpiryBanner
          statusData={statusData}
          isLoading={isLoadingStatus}
          isError={isStatusError}
          onRenewClick={() => setIsRenewalModalOpen(true)}
        />

        <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2">
          <div className="rounded-xl border border-[#eddcd4] bg-[#faf7f5]/60 p-5">
            <p className="text-xs font-medium text-neutral-500">
              {RESTAURANT_DASHBOARD_TEXTS.ACCOUNT_STATUS_LABEL}
            </p>
            <p className="mt-2 text-xl font-bold text-neutral-900">
              {user?.status ??
                statusData?.verificationStatus ??
                RESTAURANT_DASHBOARD_TEXTS.DEFAULT_ACTIVE_STATUS}
            </p>
          </div>

          <SubscriptionOverviewCard
            statusData={statusData}
            plans={plans}
            isLoading={isLoadingStatus}
            isError={isStatusError}
            onRenewClick={() => setIsRenewalModalOpen(true)}
            onSubscribeClick={() => navigate(RESTAURANT_ROUTES.SUBSCRIPTION)}
          />
        </div>
      </div>

      <RenewalModal
        open={isRenewalModalOpen}
        onOpenChange={setIsRenewalModalOpen}
        statusData={statusData}
        plans={plans}
        isLoadingPlans={isLoadingPlans}
        isPlansError={isPlansError}
        onRetryPlans={() => {
          refetchPlans();
        }}
      />
    </div>
  );
}
