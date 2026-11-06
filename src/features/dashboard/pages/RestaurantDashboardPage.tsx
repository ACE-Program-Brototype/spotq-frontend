import { RenewalModal } from "@features/subscription/components/RenewalModal";
import { SubscriptionExpiryBanner } from "@features/subscription/components/SubscriptionExpiryBanner";
import { SubscriptionOverviewCard } from "@features/subscription/components/SubscriptionOverviewCard";
import { SUBSCRIPTION_QUERY_KEYS } from "@features/subscription/constants/subscription.constants";
import { subscriptionService } from "@features/subscription/services/subscription.service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RESTAURANT_ROUTES } from "@/app/router/routes.constants";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/features/auth/store/auth.store";
import type { User } from "@/features/auth/types/auth.types";

export default function RestaurantDashboardPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, clearAuth } = useAuthStore();
  const [isRenewalModalOpen, setIsRenewalModalOpen] = useState(false);

  const restaurantUser = user as { email?: string; status?: string } | null;
  const restaurantEmail = restaurantUser?.email || user?.email || "restaurant";

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
    enabled: Boolean(
      (isSubscriptionActive || isRenewalModalOpen) &&
        typeof subscriptionService.fetchPlans === "function",
    ),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const userStatus = restaurantUser?.status ?? statusData?.verificationStatus;
  const isApprovedOrActive =
    userStatus === "APPROVED" || userStatus === "ACTIVE" || userStatus === "VERIFIED";
  const needsSubscription = isApprovedOrActive && !isSubscriptionActive && !isStatusError;

  useEffect(() => {
    if (statusData?.verificationStatus) {
      const currentUser = useAuthStore.getState().user;
      if (
        currentUser &&
        statusData.verificationStatus &&
        currentUser.status !== statusData.verificationStatus
      ) {
        useAuthStore.getState().setUser({
          ...currentUser,
          status: statusData.verificationStatus as User["status"],
          onboardingStatus: "COMPLETED",
        });
      }
    }
  }, [statusData]);

  useEffect(() => {
    if (!isLoadingStatus && needsSubscription) {
      navigate(RESTAURANT_ROUTES.SUBSCRIPTION, { replace: true });
    }
  }, [isLoadingStatus, needsSubscription, navigate]);

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
              Restaurant dashboard
            </p>
            <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-neutral-900">
              Welcome, {statusData?.restaurantName || restaurantEmail}
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

        {needsSubscription && !isLoadingStatus && (
          <div className="mt-8 overflow-hidden rounded-2xl border border-orange-300 bg-gradient-to-r from-orange-50 to-amber-50 p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-orange-100 p-2 text-orange-600">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-orange-950">Subscription Required</h3>
                  <p className="mt-0.5 text-sm text-orange-800">
                    Your restaurant is verified! Select a subscription plan to start taking customer
                    orders.
                  </p>
                </div>
              </div>
              <Button
                type="button"
                onClick={() => navigate(RESTAURANT_ROUTES.SUBSCRIPTION)}
                className="gap-2 bg-orange-600 text-white hover:bg-orange-700 shrink-0"
              >
                Choose Plan
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2">
          <div className="rounded-xl border border-[#eddcd4] bg-[#faf7f5]/60 p-5">
            <p className="text-xs font-medium text-neutral-500">Account status</p>
            <p className="mt-2 text-xl font-bold text-neutral-900">
              {restaurantUser?.status ?? statusData?.verificationStatus ?? "Active"}
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
