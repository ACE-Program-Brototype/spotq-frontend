import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatCurrency } from "@/lib/utils/currency";
import type { OrderStatusBreakdownResultDto } from "../../types/restaurant-analytics.types";

export interface OrderStatusDistributionCardProps {
  breakdown: OrderStatusBreakdownResultDto;
  className?: string;
}

export function OrderStatusDistributionCard({
  breakdown,
  className,
}: OrderStatusDistributionCardProps) {
  if (breakdown.status !== "AVAILABLE") {
    return null;
  }

  const { totalOrdersTracked, distribution } = breakdown;

  return (
    <div
      className={cn(
        "rounded-2xl border border-[#eddcd4] bg-white p-5 sm:p-6 shadow-2xs",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-neutral-900">Order Fulfillment</h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Success vs cancellation rates and financial value
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#faf7f5] border border-[#eddcd4] text-neutral-700">
          {totalOrdersTracked.toLocaleString()} tracked
        </span>
      </div>

      <div className="mt-5 space-y-4">
        {distribution.map((item) => {
          const isCompleted = item.status === "COMPLETED";
          const isCancelled = item.status === "CANCELLED";

          return (
            <div
              key={item.status}
              className="p-4 rounded-xl border border-[#eddcd4] bg-[#faf7f5] space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isCompleted && <CheckCircle2 className="size-4 text-emerald-600" />}
                  {isCancelled && <XCircle className="size-4 text-rose-600" />}
                  <span className="text-xs sm:text-sm font-bold text-neutral-800">
                    {isCompleted
                      ? "Completed Orders"
                      : isCancelled
                        ? "Cancelled Orders"
                        : item.status}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs sm:text-sm font-extrabold text-neutral-900">
                    {item.count.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-neutral-500 ml-1.5">({item.percentage}%)</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-2 w-full rounded-full bg-neutral-200 overflow-hidden">
                <div
                  style={{ width: `${Math.min(100, item.percentage)}%` }}
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    isCompleted && "bg-emerald-500",
                    isCancelled && "bg-rose-500",
                    !isCompleted && !isCancelled && "bg-[#9a3412]",
                  )}
                />
              </div>

              {/* Amount and Subtitle */}
              <div className="flex items-center justify-between text-xs pt-0.5">
                <span className="text-neutral-500 text-[11px]">
                  {isCompleted ? "Realized Value" : "Unfulfilled Value"}
                </span>
                <span
                  className={cn(
                    "font-bold text-xs",
                    isCompleted && "text-emerald-700",
                    isCancelled && "text-rose-700",
                  )}
                >
                  {formatCurrency(item.amountRupees)}
                </span>
              </div>
            </div>
          );
        })}

        {distribution.length === 0 && (
          <div className="text-center py-6 text-xs text-neutral-400">
            No order distribution data for this period.
          </div>
        )}
      </div>
    </div>
  );
}
