import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SUBSCRIPTION_FAILURE_TEXTS } from "@/features/subscription/constants/subscription.constants";

interface LocationState {
  errorMessage?: string;
  planCode?: string;
}

export default function SubscriptionFailurePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as LocationState) || {};

  const reason = state.errorMessage || SUBSCRIPTION_FAILURE_TEXTS.DEFAULT_REASON;

  return (
    <div className="min-h-screen bg-neutral-50 px-4 py-12 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-xl">
        <div className="rounded-3xl border border-neutral-200 bg-white p-8 sm:p-10 shadow-sm text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-600 mb-6">
            <AlertCircle className="h-10 w-10" />
          </div>

          <p className="text-xs font-bold uppercase tracking-widest text-rose-600">
            {SUBSCRIPTION_FAILURE_TEXTS.FAILED_BADGE}
          </p>
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-neutral-900">
            {SUBSCRIPTION_FAILURE_TEXTS.TITLE}
          </h1>
          <p className="mt-2 text-sm text-neutral-600">{SUBSCRIPTION_FAILURE_TEXTS.SUBTITLE}</p>

          <div className="mt-8 rounded-2xl border border-neutral-100 bg-[#faf7f5] p-6 text-left space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200/60 pb-3">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                {SUBSCRIPTION_FAILURE_TEXTS.STATUS_LABEL}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-bold text-rose-700 border border-rose-200">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-600" />
                {SUBSCRIPTION_FAILURE_TEXTS.FAILED_BADGE}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                {SUBSCRIPTION_FAILURE_TEXTS.REASON_LABEL}
              </span>
              <span className="text-sm font-medium text-neutral-800 break-words">{reason}</span>
            </div>
          </div>

          <p className="mt-6 text-xs text-neutral-500 text-left">
            {SUBSCRIPTION_FAILURE_TEXTS.SUPPORT_NOTE}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button
              type="button"
              onClick={() => navigate("/restaurant/subscription", { replace: true })}
              className="w-full sm:flex-1 gap-2 bg-orange-600 text-white hover:bg-orange-700"
            >
              <RefreshCw className="h-4 w-4" />
              {SUBSCRIPTION_FAILURE_TEXTS.RETRY_BUTTON}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/restaurant/subscription", { replace: true })}
              className="w-full sm:flex-1 gap-2 border-neutral-300 text-neutral-700 hover:bg-neutral-100"
            >
              <ArrowLeft className="h-4 w-4 text-neutral-500" />
              {SUBSCRIPTION_FAILURE_TEXTS.DASHBOARD_BUTTON}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
