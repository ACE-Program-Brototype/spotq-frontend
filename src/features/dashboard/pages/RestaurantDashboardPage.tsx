import { useQuery } from "@tanstack/react-query";
import { AlertCircle, ArrowRight, CheckCircle2, CreditCard, Sparkles } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { subscriptionApi } from "@/features/subscription/api/subscription.api";

export default function RestaurantDashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const restaurantEmail = user?.email || "restaurant";

  const { data: statusData, isLoading: isLoadingStatus } = useQuery({
    queryKey: ["restaurant-status"],
    queryFn: () => subscriptionApi.fetchRestaurantStatus(),
    retry: 1,
  });

  const isSubscriptionActive = statusData?.isSubscriptionActive ?? false;
  const isApproved = statusData?.verificationStatus === "APPROVED";
  const needsSubscription = isApproved && !isSubscriptionActive;

  const subscriptionEndsAt = statusData?.subscriptionEndsAt
    ? new Date(statusData.subscriptionEndsAt)
    : null;
  const now = new Date();
  const daysRemaining = subscriptionEndsAt
    ? Math.ceil((subscriptionEndsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    : null;
  const isExpiringSoon =
    isSubscriptionActive && daysRemaining !== null && daysRemaining <= 7 && daysRemaining >= 0;

  useEffect(() => {
    if (!isLoadingStatus && needsSubscription) {
      navigate("/restaurant/subscription", { replace: true });
    }
  }, [isLoadingStatus, needsSubscription, navigate]);

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
            onClick={() => navigate("/restaurant/email/verification", { replace: false })}
            className="self-start sm:self-auto rounded-xl border border-[#eddcd4] px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-[#faf7f5] transition-colors"
          >
            Back to email
          </button>
        </div>

        {/* Subscription Expiring Soon Warning Banner */}
        {isExpiringSoon && (
          <div className="mt-8 overflow-hidden rounded-2xl border border-amber-300 bg-gradient-to-r from-amber-50 to-orange-50 p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-amber-100 p-2 text-amber-700">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-amber-950">Subscription Expiring Soon</h3>
                  <p className="mt-0.5 text-sm text-amber-800">
                    Your {statusData?.subscriptionPlanCode?.replace("_", " ") || "current"} plan
                    expires in{" "}
                    {daysRemaining === 0
                      ? "today"
                      : `${daysRemaining} day${daysRemaining === 1 ? "" : "s"}`}
                    . Renew now to avoid service interruption.
                  </p>
                </div>
              </div>
              <Button
                type="button"
                onClick={() => navigate("/restaurant/subscription")}
                className="gap-2 bg-amber-600 text-white hover:bg-amber-700 shrink-0"
              >
                Renew Plan
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Subscription Alert for Verified Restaurant Admins */}
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
                onClick={() => navigate("/restaurant/subscription")}
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
              {statusData?.verificationStatus ?? "Active"}
            </p>
          </div>
          <div className="rounded-xl border border-[#eddcd4] bg-[#faf7f5]/60 p-5">
            <p className="text-xs font-medium text-neutral-500">Subscription</p>
            {isSubscriptionActive ? (
              <div className="mt-2 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <span className="text-xl font-bold text-neutral-900">
                  {statusData?.subscriptionPlanCode?.replace("_", " ") || "Active"}
                </span>
              </div>
            ) : (
              <div className="mt-2 flex items-center justify-between">
                <span className="text-lg font-medium text-amber-700">Inactive</span>
                <button
                  type="button"
                  onClick={() => navigate("/restaurant/subscription")}
                  className="flex items-center gap-1 text-sm font-semibold text-orange-600 hover:underline"
                >
                  <CreditCard className="h-4 w-4" />
                  Subscribe
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
