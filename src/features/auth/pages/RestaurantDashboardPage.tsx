import { useQuery } from "@tanstack/react-query";
import { ArrowRight, CheckCircle2, CreditCard, Sparkles } from "lucide-react";
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
    queryFn: subscriptionApi.fetchRestaurantStatus,
    retry: 1,
  });

  const isSubscriptionActive = statusData?.isSubscriptionActive ?? false;
  const isApproved = statusData?.verificationStatus === "APPROVED";
  const needsSubscription = isApproved && !isSubscriptionActive;

  return (
    <div className="min-h-screen bg-neutral-100 px-6 py-12 text-neutral-900">
      <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-lg sm:p-10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
              Restaurant dashboard
            </p>
            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
              Welcome, {statusData?.restaurantName || restaurantEmail}
            </h1>
          </div>
          <button
            type="button"
            onClick={() => navigate("/restaurant/email/verification", { replace: false })}
            className="rounded-lg border border-neutral-300 px-4 py-2 font-medium text-neutral-700 hover:bg-neutral-100"
          >
            Back to email
          </button>
        </div>

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

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5">
            <p className="text-sm text-neutral-500">Account status</p>
            <p className="mt-2 text-xl font-semibold text-neutral-900">
              {statusData?.verificationStatus ?? "Active"}
            </p>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5">
            <p className="text-sm text-neutral-500">Subscription</p>
            {isSubscriptionActive ? (
              <div className="mt-2 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <span className="text-xl font-semibold text-neutral-900">
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
