import { Bike, Utensils } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { OrderSectionResultDto } from "../../types/restaurant-analytics.types";

export interface ChannelDistributionCardProps {
  orders: OrderSectionResultDto;
  className?: string;
}

export function ChannelDistributionCard({ orders, className }: ChannelDistributionCardProps) {
  if (orders.status !== "AVAILABLE") {
    return null;
  }

  const total = orders.totalOrderCount;
  const dineIn = orders.dineInCount;
  const takeaway = orders.takeawayCount;

  const dineInPercent = total > 0 ? Math.round((dineIn / total) * 100) : 0;
  const takeawayPercent = total > 0 ? Math.round((takeaway / total) * 100) : 0;

  return (
    <div
      className={cn(
        "rounded-2xl border border-[#eddcd4] bg-white p-5 sm:p-6 shadow-2xs",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-neutral-900">Dining Channels</h3>
          <p className="text-xs text-neutral-500 mt-0.5">Dine-in table orders vs takeaway orders</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#faf7f5] border border-[#eddcd4] text-neutral-700">
          {total.toLocaleString()} total
        </span>
      </div>

      {/* Progress Split Bar */}
      <div className="mt-5">
        <div className="h-3 w-full rounded-full bg-neutral-100 overflow-hidden flex">
          <div
            style={{ width: `${dineInPercent}%` }}
            className="bg-[#9a3412] transition-all duration-500"
            title={`Dine-in: ${dineInPercent}%`}
          />
          <div
            style={{ width: `${takeawayPercent}%` }}
            className="bg-sky-500 transition-all duration-500"
            title={`Takeaway: ${takeawayPercent}%`}
          />
        </div>
      </div>

      {/* Channel Cards */}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4">
        {/* Dine-In */}
        <div className="p-3.5 rounded-xl border border-[#eddcd4] bg-[#faf7f5] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#fef3ec] text-[#9a3412] border border-[#fae2d3]">
              <Utensils className="size-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-neutral-800">Dine-In</p>
              <p className="text-[11px] text-neutral-500">{dineInPercent}% of orders</p>
            </div>
          </div>
          <span className="text-sm sm:text-base font-extrabold text-neutral-900">
            {dineIn.toLocaleString()}
          </span>
        </div>

        {/* Takeaway */}
        <div className="p-3.5 rounded-xl border border-sky-100 bg-sky-50/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sky-100 text-sky-700 border border-sky-200">
              <Bike className="size-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-sky-950">Takeaway</p>
              <p className="text-[11px] text-sky-600">{takeawayPercent}% of orders</p>
            </div>
          </div>
          <span className="text-sm sm:text-base font-extrabold text-sky-950">
            {takeaway.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
