import { ArrowDownToLine, ArrowDownUp, Clock3, Wallet } from "lucide-react";

import type { FinanceSummary as FinanceSummaryData } from "../types/finance.types";
import { formatPaise } from "../utils/finance-display.utils";
import { FinanceMetricCard } from "./FinanceMetricCard";

export function FinanceSummary({
  summary,
  loading,
  error,
}: {
  summary: FinanceSummaryData | null;
  loading: boolean;
  error: string;
}) {
  return (
    <section aria-label="Finance summary">
      {error && (
        <p
          role="alert"
          className="mb-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800"
        >
          {error}
        </p>
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
