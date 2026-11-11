import { CheckCircle2, IndianRupee, Percent } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatCurrency } from "@/lib/utils/currency";
import type { RevenueMetricDto } from "../../types/restaurant-analytics.types";

export interface RevenueBreakdownCardProps {
  revenue: RevenueMetricDto;
  totalOrders?: number;
  className?: string;
}

export function RevenueBreakdownCard({
  revenue,
  totalOrders = 0,
  className,
}: RevenueBreakdownCardProps) {
  const { netSalesRupees, discountRupees, totalBillAmountRupees } = revenue;

  const netPercent =
    totalBillAmountRupees > 0 ? Math.round((netSalesRupees / totalBillAmountRupees) * 100) : 100;
  const discountPercent =
    totalBillAmountRupees > 0 ? Math.round((discountRupees / totalBillAmountRupees) * 100) : 0;

  const aov = totalOrders > 0 ? netSalesRupees / totalOrders : 0;

  return (
    <div
      className={cn(
        "rounded-2xl border border-[#eddcd4] bg-white p-5 sm:p-6 shadow-2xs",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-neutral-900">Revenue Realization</h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Breakdown from gross billed amounts to net realized revenue
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
          <CheckCircle2 className="size-3.5" />
          <span>{netPercent}% Realized</span>
        </div>
      </div>

      {/* Visual Composition Stack */}
      <div className="mt-5 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-neutral-600">
          <span>Net Realized ({netPercent}%)</span>
          <span>Discounts ({discountPercent}%)</span>
        </div>
        <div className="h-3.5 w-full rounded-full bg-neutral-100 overflow-hidden flex">
          <div
            style={{ width: `${netPercent}%` }}
            className="bg-emerald-600 transition-all duration-500"
            title={`Net Revenue: ${netPercent}%`}
          />
          <div
            style={{ width: `${discountPercent}%` }}
            className="bg-amber-500 transition-all duration-500"
            title={`Discounts: ${discountPercent}%`}
          />
        </div>
      </div>

      {/* Financial Bridge Cards */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="p-4 rounded-xl border border-[#eddcd4] bg-[#faf7f5]">
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-600">
            <IndianRupee className="size-3.5 text-[#9a3412]" />
            <span>Gross Total Bill</span>
          </div>
          <p className="mt-1.5 text-lg sm:text-xl font-bold text-neutral-900">
            {formatCurrency(totalBillAmountRupees)}
          </p>
          <p className="mt-1 text-[11px] text-neutral-400">Total customer orders value</p>
        </div>

        <div className="p-4 rounded-xl border border-amber-200/80 bg-amber-50/30">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-800">
            <Percent className="size-3.5 text-amber-600" />
            <span>Discounts Absorbed</span>
          </div>
          <p className="mt-1.5 text-lg sm:text-xl font-bold text-amber-950">
            -{formatCurrency(discountRupees)}
          </p>
          <p className="mt-1 text-[11px] text-amber-700/80">{discountPercent}% of bill deducted</p>
        </div>

        <div className="p-4 rounded-xl border border-emerald-200/80 bg-emerald-50/40">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
            <CheckCircle2 className="size-3.5 text-emerald-600" />
            <span>Net Revenue Received</span>
          </div>
          <p className="mt-1.5 text-lg sm:text-xl font-bold text-emerald-950">
            {formatCurrency(netSalesRupees)}
          </p>
          <p className="mt-1 text-[11px] text-emerald-700/80">
            Average {formatCurrency(aov)} / order
          </p>
        </div>
      </div>
    </div>
  );
}
