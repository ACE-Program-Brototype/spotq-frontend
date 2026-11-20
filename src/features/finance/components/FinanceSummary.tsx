import { AlertCircle, ArrowDownToLine, ArrowDownUp, Clock3, RotateCcw, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FINANCE_MESSAGES } from "@/features/finance/constants/finance.constants";
import type { FinanceSummary as FinanceSummaryData } from "@/features/finance/types/finance.types";
import { formatPaise } from "@/features/finance/utils/finance-display.utils";
import { cn } from "@/lib/utils/cn";
import { FinanceMetricCard } from "@/features/finance/components/FinanceMetricCard";

interface FinanceSummaryProps {
  summary: FinanceSummaryData | null;
  loading: boolean;
  error?: string | null;
  onRetry?: () => void;
  isRetrying?: boolean;
}

export function FinanceSummary({
  summary,
  loading,
  error,
  onRetry,
  isRetrying = false,
}: FinanceSummaryProps) {
  return (
    <section aria-label="Finance summary">
      {error && (
        <div
          role="alert"
          data-testid="finance-summary-error"
          className="mb-4 flex flex-col gap-3 rounded-2xl border border-rose-200 bg-rose-50/90 p-4 text-sm text-rose-900 sm:flex-row sm:items-center sm:justify-between shadow-xs transition-all"
        >
          <div className="flex items-center gap-2.5">
            <AlertCircle className="size-5 text-rose-600 shrink-0" aria-hidden="true" />
            <span className="font-medium text-rose-900">{error}</span>
          </div>
          {onRetry && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={onRetry}
              disabled={isRetrying}
              className="gap-1.5 rounded-xl border-rose-200 bg-white text-rose-700 hover:bg-rose-100 hover:text-rose-900 shrink-0 font-semibold cursor-pointer"
            >
              <RotateCcw className={cn("size-3.5", isRetrying && "animate-spin")} aria-hidden="true" />
              <span>{isRetrying ? FINANCE_MESSAGES.RETRYING : FINANCE_MESSAGES.RETRY}</span>
            </Button>
          )}
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <FinanceMetricCard
          title="Master balance"
          value={formatPaise(summary?.masterBalancePaise, summary?.currency)}
          caption="Available platform balance"
          icon={Wallet}
          accent="bg-blue-50 text-blue-700"
          loading={loading}
        />
        <FinanceMetricCard
          title="Today's online turnover"
          value={formatPaise(summary?.todayTurnoverPaise, summary?.currency)}
          caption="Customer payments captured today"
          icon={ArrowDownUp}
          accent="bg-emerald-50 text-emerald-700"
          loading={loading}
        />
        <FinanceMetricCard
          title="Tonight's EOD payout pool"
          value={formatPaise(summary?.tonightEodPayoutQueuePaise, summary?.currency)}
          caption="Venues maturing for settlement"
          icon={Clock3}
          accent="bg-purple-50 text-purple-700"
          loading={loading}
        />
        <FinanceMetricCard
          title="Lifetime disbursed"
          value={formatPaise(summary?.lifetimeDisbursedPaise, summary?.currency)}
          caption="All-time net funds settled to restaurants"
          icon={ArrowDownToLine}
          accent="bg-slate-100 text-slate-700"
          loading={loading}
        />
        <FinanceMetricCard
          title="SaaS subscription MRR"
          value={formatPaise(summary?.saasSubscriptionMrrPaise, summary?.currency)}
          caption={`${summary?.activeVenuesCount ?? 0} active B2B plans`}
          icon={Wallet}
          accent="bg-indigo-50 text-indigo-700"
          loading={loading}
        />
      </div>
    </section>
  );
}
