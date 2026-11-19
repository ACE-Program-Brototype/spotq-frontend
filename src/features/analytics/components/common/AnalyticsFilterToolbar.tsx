import { Calendar, Filter, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  MONTH_NAMES,
  ORDER_STATUS_FILTER_LABELS,
  RESTAURANT_ANALYTICS_INTERVAL_LABELS,
} from "@/features/analytics/constants/restaurant-analytics.constants";
import {
  ANALYTICS_PERIODS,
  type AnalyticsPeriod,
  ORDER_STATUS_FILTERS,
  type OrderStatusFilter,
} from "@/features/analytics/types/restaurant-analytics.types";
import { cn } from "@/lib/utils/cn";

export interface AnalyticsFilterToolbarProps {
  interval: AnalyticsPeriod;
  day?: number;
  month: number;
  year: number;
  status: OrderStatusFilter;
  onIntervalChange: (interval: AnalyticsPeriod) => void;
  onDayChange?: (day: number) => void;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
  onStatusChange: (status: OrderStatusFilter) => void;
  onReset?: () => void;
  className?: string;
}

export function AnalyticsFilterToolbar({
  interval,
  day,
  month,
  year,
  status,
  onIntervalChange,
  onDayChange,
  onMonthChange,
  onYearChange,
  onStatusChange,
  onReset,
  className,
}: AnalyticsFilterToolbarProps) {
  const currentYear = new Date().getFullYear();
  const yearOptions = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1];

  const daysInSelectedMonth = new Date(year, month, 0).getDate();
  const dayOptions = Array.from({ length: daysInSelectedMonth }, (_, i) => i + 1);

  return (
    <div
      className={cn(
        "flex flex-col md:flex-row md:items-center md:justify-between gap-1.5 md:gap-3 p-2 sm:p-2.5 md:p-3 sm:md:p-4 rounded-xl md:rounded-2xl border border-[#eddcd4] bg-white shadow-2xs w-full max-w-full",
        className,
      )}
    >
      {/* Line 2 on mobile: Today and other (Single horizontal row on sm, compact inline on md+) */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-[#faf7f5] border border-[#eddcd4] w-full md:w-fit">
        {(Object.keys(ANALYTICS_PERIODS) as Array<keyof typeof ANALYTICS_PERIODS>).map((key) => {
          const periodValue = ANALYTICS_PERIODS[key];
          const isSelected = interval === periodValue;
          return (
            <button
              key={periodValue}
              type="button"
              onClick={() => onIntervalChange(periodValue)}
              className={cn(
                "flex-1 md:flex-initial h-7 sm:h-8 md:h-auto px-1 sm:px-2 md:px-2.5 md:py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-all text-center flex items-center justify-center truncate",
                isSelected
                  ? "bg-white text-[#9a3412] shadow-2xs border border-[#eddcd4]"
                  : "text-neutral-600 hover:text-neutral-900",
              )}
            >
              {RESTAURANT_ANALYTICS_INTERVAL_LABELS[key]}
            </button>
          );
        })}
      </div>

      {/* Line 3 on mobile: nov, year, all (Month, Year, Order Status, Reset in ONE line on sm; spacious on md+) */}
      <div className="flex items-center md:flex-wrap md:justify-end gap-1 sm:gap-1.5 md:gap-2.5 w-full md:w-auto">
        {/* Day Select (when DAY) */}
        {interval === ANALYTICS_PERIODS.DAY && onDayChange && (
          <div className="flex items-center gap-1 md:gap-1.5 shrink-0">
            <span className="hidden md:inline text-[11px] font-bold text-neutral-500 uppercase tracking-wider shrink-0">
              Day:
            </span>
            <select
              value={day ?? 1}
              onChange={(e) => onDayChange(Number(e.target.value))}
              aria-label="Select day"
              className="h-7 sm:h-8 md:h-8 w-14 md:w-auto shrink-0 rounded-lg sm:rounded-xl border border-[#eddcd4] bg-[#faf7f5] px-1 md:px-2.5 text-[11px] sm:text-xs font-semibold text-neutral-800 hover:border-[#9a3412] focus:outline-hidden focus:ring-1 focus:ring-[#9a3412]"
            >
              {dayOptions.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Month Select */}
        {interval !== ANALYTICS_PERIODS.YEAR && (
          <div className="flex items-center gap-1 md:gap-1.5 flex-1 md:flex-initial min-w-0">
            <Calendar className="hidden md:inline size-3.5 text-[#9a3412] shrink-0" />
            <select
              value={month}
              onChange={(e) => onMonthChange(Number(e.target.value))}
              aria-label="Select month"
              className="h-7 sm:h-8 md:h-8 w-full md:w-auto rounded-lg sm:rounded-xl border border-[#eddcd4] bg-[#faf7f5] px-1.5 sm:px-2 text-[11px] sm:text-xs font-semibold text-neutral-800 hover:border-[#9a3412] focus:outline-hidden focus:ring-1 focus:ring-[#9a3412] truncate"
            >
              {MONTH_NAMES.map((name, idx) => (
                <option key={name} value={idx + 1}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Year Select */}
        <select
          value={year}
          onChange={(e) => onYearChange(Number(e.target.value))}
          aria-label="Select year"
          className="h-7 sm:h-8 md:h-8 w-16 sm:w-20 md:w-auto shrink-0 rounded-lg sm:rounded-xl border border-[#eddcd4] bg-[#faf7f5] px-1 sm:px-2 md:px-2.5 text-[11px] sm:text-xs font-semibold text-neutral-800 hover:border-[#9a3412] focus:outline-hidden focus:ring-1 focus:ring-[#9a3412]"
        >
          {yearOptions.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        {/* Order Status */}
        <div className="flex items-center gap-1 md:gap-1.5 md:pl-2 md:border-l border-[#eddcd4] flex-1 md:flex-initial min-w-0">
          <Filter className="hidden md:inline size-3.5 text-neutral-400 shrink-0" />
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value as OrderStatusFilter)}
            aria-label="Filter order status"
            className="h-7 sm:h-8 md:h-8 w-full md:w-auto rounded-lg sm:rounded-xl border border-[#eddcd4] bg-[#faf7f5] px-1.5 sm:px-2 text-[11px] sm:text-xs font-semibold text-neutral-800 hover:border-[#9a3412] focus:outline-hidden focus:ring-1 focus:ring-[#9a3412] truncate"
          >
            {(Object.keys(ORDER_STATUS_FILTERS) as Array<keyof typeof ORDER_STATUS_FILTERS>).map(
              (key) => (
                <option key={key} value={ORDER_STATUS_FILTERS[key]}>
                  {ORDER_STATUS_FILTER_LABELS[key]}
                </option>
              ),
            )}
          </select>
        </div>

        {/* Reset Action */}
        {onReset && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-7 sm:h-8 md:h-8 px-1.5 sm:px-2 md:px-2.5 text-xs font-medium text-neutral-500 hover:text-neutral-900 shrink-0 gap-1"
            title="Reset to default filters"
          >
            <RotateCcw className="size-3.5 text-neutral-500" />
            <span className="hidden min-[420px]:inline text-[11px] md:text-xs">Reset</span>
          </Button>
        )}
      </div>
    </div>
  );
}
