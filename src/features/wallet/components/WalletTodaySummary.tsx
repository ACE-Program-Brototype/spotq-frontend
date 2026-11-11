import { CreditCard } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export function WalletTodaySummary({
  todayCreditsPaise,
  todayRefundsPaise,
  withdrawnPaise,
  pendingPayoutsCount,
}: {
  todayCreditsPaise: number;
  todayRefundsPaise: number;
  withdrawnPaise: number;
  pendingPayoutsCount: number;
}) {
  return (
    <section
      aria-label="Today's wallet summary"
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      <SummaryCard
        title="Today's credits"
        amount={todayCreditsPaise}
        note="Wallet credits received today"
        tone="green"
      />
      <SummaryCard
        title="Today's refunds"
        amount={todayRefundsPaise}
        note="Refunds issued today"
        tone="orange"
      />
      <SummaryCard
        title="Today's withdrawals"
        amount={withdrawnPaise}
        note={`${pendingPayoutsCount} pending payout${pendingPayoutsCount === 1 ? "" : "s"}`}
        tone="orange"
      />
    </section>
  );
}

function SummaryCard({
  title,
  amount,
  note,
  tone,
}: {
  title: string;
  amount: number;
  note: string;
  tone: "green" | "orange";
}) {
  return (
    <article className="rounded-2xl border border-[#eddcd4] bg-white p-5 shadow-xs sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-neutral-600">{title}</p>
          <p className="mt-3 text-2xl font-bold tabular-nums text-neutral-900">
            {formatCurrency(amount / 100)}
          </p>
          <p className="mt-1 text-xs text-neutral-500">{note}</p>
        </div>
        <span
          className={`rounded-xl p-2.5 ${tone === "green" ? "bg-emerald-50 text-emerald-700" : "bg-orange-50 text-orange-700"}`}
        >
          <CreditCard className="size-5" />
        </span>
      </div>
    </article>
  );
}
