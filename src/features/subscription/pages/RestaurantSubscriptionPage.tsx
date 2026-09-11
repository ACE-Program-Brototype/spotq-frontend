import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, HelpCircle, RefreshCw, ShieldCheck, Zap } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { PlanCard } from "@/features/subscription/components/PlanCard";
import { useRazorpayCheckout } from "@/features/subscription/hooks/useRazorpayCheckout";
import { subscriptionService } from "@/features/subscription/services/subscription.service";

export default function RestaurantSubscriptionPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: plans = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["subscription-plans"],
    queryFn: subscriptionService.fetchPlans,
    staleTime: 5 * 60 * 1000,
  });

  // Query current restaurant status and redirect if subscription is already active
  const { data: restaurantStatus } = useQuery({
    queryKey: ["restaurant-status"],
    queryFn: async () => {
      try {
        return await subscriptionService.fetchRestaurantStatus();
      } catch {
        return null;
      }
    },
    staleTime: 30 * 1000,
  });

  useEffect(() => {
    const currentUser = useAuthStore.getState().user;
    if (currentUser && restaurantStatus?.isSubscriptionActive) {
      navigate("/restaurant/dashboard", { replace: true });
    }
  }, [restaurantStatus, navigate]);

  const { startCheckout, isProcessing, selectedPlanId } = useRazorpayCheckout({
    onSuccess: (verificationResult) => {
      // Optimistically seed cache so restaurant dashboard renders active subscription immediately without flicker
      queryClient.setQueryData(
        ["restaurant-status"],
        (old: Record<string, unknown> | undefined) => ({
          ...old,
          isSubscriptionActive: true,
          subscriptionPlanCode: verificationResult.planCode,
        }),
      );

      // Invalidate to fetch fresh authoritative state from backend
      queryClient.invalidateQueries({ queryKey: ["restaurant-status"] });

      // Direct the restaurant admin to dashboard upon successful verification
      navigate("/restaurant/dashboard", { replace: true });
    },
    onAlreadyActive: () => {
      // Invalidate query to pull real authoritative subscription from backend without injecting synthetic data
      queryClient.invalidateQueries({ queryKey: ["restaurant-status"] });
      navigate("/restaurant/dashboard", { replace: true });
    },
  });

  return (
    <div className="min-h-screen bg-neutral-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Verification Success Notice */}
        <div className="mb-10 overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-teal-50 to-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-emerald-100 p-2 text-emerald-600">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-emerald-950">
                Restaurant Verification Approved!
              </h2>
              <p className="mt-1 text-sm text-emerald-800">
                Your restaurant registration and legal documents have been approved by the SpotQ
                team. Please select a subscription plan below to activate your portal and start
                taking live orders.
              </p>
            </div>
          </div>
        </div>

        {/* Page Header */}
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-orange-600">
            SpotQ Subscription Plans
          </p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl">
            Choose the right plan for your restaurant
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-neutral-600 sm:text-lg">
            Streamline your queue management, enhance table turnover, and delight your guests with
            our intelligent restaurant POS & ordering solutions.
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:max-w-4xl lg:mx-auto">
            {[1, 2].map((i) => (
              <div key={i} className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
                <Skeleton className="h-8 w-3/4 rounded-lg" />
                <Skeleton className="mt-3 h-4 w-full rounded-md" />
                <Skeleton className="mt-6 h-12 w-1/2 rounded-lg" />
                <div className="mt-8 space-y-3">
                  <Skeleton className="h-4 w-full rounded-md" />
                  <Skeleton className="h-4 w-5/6 rounded-md" />
                  <Skeleton className="h-4 w-4/6 rounded-md" />
                </div>
                <Skeleton className="mt-8 h-12 w-full rounded-xl" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="mt-12 mx-auto max-w-md rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="font-semibold text-red-900">Failed to load subscription plans</p>
            <p className="mt-1 text-sm text-red-700">
              {error instanceof Error ? error.message : "Please check your network and try again."}
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => refetch()}
              className="mt-4 gap-2 border-red-200 bg-white text-red-800 hover:bg-red-100"
            >
              <RefreshCw className="h-4 w-4" />
              Retry Loading Plans
            </Button>
          </div>
        )}

        {/* Plans Grid */}
        {!isLoading && !isError && (
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:max-w-4xl lg:mx-auto">
            {plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                isPopular={plan.isPopular || plan.code === "QUEUE_PRO"}
                isLoading={isProcessing && selectedPlanId === plan.id}
                disabled={isProcessing}
                onSelect={(id) => startCheckout(id)}
              />
            ))}
          </div>
        )}

        {/* Value Props / Reassurance Bar */}
        <div className="mt-16 border-t border-neutral-200 pt-10">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm border border-neutral-100">
              <Zap className="h-6 w-6 text-orange-500 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-neutral-900">Instant Activation</p>
                <p className="text-xs text-neutral-500">
                  Access dashboard immediately after payment
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm border border-neutral-100">
              <ShieldCheck className="h-6 w-6 text-emerald-500 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-neutral-900">100% Secure Checkout</p>
                <p className="text-xs text-neutral-500">
                  Encrypted Razorpay UPI, Cards & NetBanking
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm border border-neutral-100">
              <HelpCircle className="h-6 w-6 text-indigo-500 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-neutral-900">Dedicated Support</p>
                <p className="text-xs text-neutral-500">
                  24/7 Priority restaurant onboarding assistance
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
