import { useQuery } from "@tanstack/react-query";
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Users } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { RESTAURANT_ROUTES } from "@/app/router/routes.constants";
import { Button } from "@/components/ui/button";
import { subscriptionService } from "@/features/subscription/services/subscription.service";

interface LocationState {
  planCode?: string;
  planName?: string;
  subscriptionId?: string;
  periodEnd?: string;
}

export default function SubscriptionSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as LocationState) || {};

  const { data: statusData } = useQuery({
    queryKey: ["restaurant-status"],
    queryFn: () => subscriptionService.fetchRestaurantStatus(),
    staleTime: 30 * 1000,
  });

  const rawPlanCode = state.planCode || statusData?.subscriptionPlanCode;
  const planName =
    state.planName ||
    (rawPlanCode
      ? rawPlanCode
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(" ")
      : "SpotQ Pro Plan");

  const rawDate = state.periodEnd || statusData?.subscriptionEndsAt;
  const formattedPeriodEnd = rawDate
    ? new Date(rawDate).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <div className="min-h-screen bg-neutral-50 px-4 py-12 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-xl">
        <div className="rounded-3xl border border-neutral-200 bg-white p-8 sm:p-10 shadow-sm text-center">
          {/* Celebratory Icon */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-6">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">Active</p>
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-neutral-900">
            Subscription Activated!
          </h1>
          <p className="mt-2 text-sm text-neutral-600">
            Your restaurant account is now fully active with SpotQ Pro features.
          </p>

          {/* Subscription Summary Card */}
          <div className="mt-8 rounded-2xl border border-neutral-100 bg-[#faf7f5] p-6 text-left space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200/60 pb-3">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                Current Plan
              </span>
              <span className="text-sm font-bold text-neutral-900 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-orange-600" />
                {planName}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-neutral-200/60 pb-3">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                Status
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                Active
              </span>
            </div>

            {formattedPeriodEnd && (
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                  Valid Until
                </span>
                <span className="text-sm font-medium text-neutral-800">{formattedPeriodEnd}</span>
              </div>
            )}
          </div>

          {/* Value Props / Features Unlocked */}
          <div className="mt-6 text-left">
            <p className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3">
              Unlocked Features
            </p>
            <div className="space-y-2.5">
              <div className="flex items-start gap-2.5 text-sm text-neutral-700">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Real-time queue and table management</span>
              </div>
              <div className="flex items-start gap-2.5 text-sm text-neutral-700">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Contactless digital QR ordering and menus</span>
              </div>
              <div className="flex items-start gap-2.5 text-sm text-neutral-700">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>24/7 priority onboarding and technical support</span>
              </div>
            </div>
          </div>

          {/* Navigation Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button
              type="button"
              onClick={() => navigate(RESTAURANT_ROUTES.DASHBOARD, { replace: true })}
              className="w-full sm:flex-1 gap-2 bg-orange-600 text-white hover:bg-orange-700"
            >
              Go to Dashboard
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(RESTAURANT_ROUTES.STAFF.ROOT)}
              className="w-full sm:flex-1 gap-2 border-neutral-300 text-neutral-700 hover:bg-neutral-100"
            >
              <Users className="h-4 w-4 text-neutral-500" />
              Manage Staff
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
