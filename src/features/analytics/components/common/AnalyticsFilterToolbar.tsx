import { Calendar, Filter, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import {
  ORDER_STATUS_FILTER_LABELS,
  RESTAURANT_ANALYTICS_INTERVAL_LABELS,
} from "../../constants/restaurant-analytics.constants";
import {
  ANALYTICS_PERIODS,
  type AnalyticsPeriod,
  ORDER_STATUS_FILTERS,
  type OrderStatusFilter,
} from "../../types/restaurant-analytics.types";

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

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

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
        "flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3.5 p-3.5 sm:p-4 rounded-2xl border border-[#eddcd4] bg-white shadow-2xs",
        className,
      )}
    >
      {/* Interval Selector Toggle */}
      <div className="flex flex-wrap items-center gap-1 p-1 rounded-xl bg-[#faf7f5] border border-[#eddcd4] w-fit">
        {(Object.keys(ANALYTICS_PERIODS) as Array<keyof typeof ANALYTICS_PERIODS>).map((key) => {
          const periodValue = ANALYTICS_PERIODS[key];
          const isSelected = interval === periodValue;
          return (
            <button
              key={periodValue}
              type="button"
              onClick={() => onIntervalChange(periodValue)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
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

      {/* Date & Status Selectors */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
        {/* Day Select (when DAY) */}
        {interval === ANALYTICS_PERIODS.DAY && onDayChange && (
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
              Day:
            </span>
            <select
              value={day ?? 1}
              onChange={(e) => onDayChange(Number(e.target.value))}
              aria-label="Select day"
              className="h-8 rounded-xl border border-[#eddcd4] bg-[#faf7f5] px-2.5 text-xs font-semibold text-neutral-800 hover:border-[#9a3412] focus:outline-hidden focus:ring-1 focus:ring-[#9a3412]"
            >
              {dayOptions.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Month Select (when DAY, WEEK, or MONTH) */}
        {interval !== ANALYTICS_PERIODS.YEAR && (
          <div className="flex items-center gap-1.5">
            <Calendar className="size-3.5 text-[#9a3412] shrink-0" />
            <select
              value={month}
              onChange={(e) => onMonthChange(Number(e.target.value))}
              aria-label="Select month"
              className="h-8 rounded-xl border border-[#eddcd4] bg-[#faf7f5] px-2.5 text-xs font-semibold text-neutral-800 hover:border-[#9a3412] focus:outline-hidden focus:ring-1 focus:ring-[#9a3412]"
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
          className="h-8 rounded-xl border border-[#eddcd4] bg-[#faf7f5] px-2.5 text-xs font-semibold text-neutral-800 hover:border-[#9a3412] focus:outline-hidden focus:ring-1 focus:ring-[#9a3412]"
        >
          {yearOptions.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 pl-1 sm:pl-2 border-l border-[#eddcd4]">
          <Filter className="size-3.5 text-neutral-400 shrink-0" />
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value as OrderStatusFilter)}
            aria-label="Filter order status"
            className="h-8 rounded-xl border border-[#eddcd4] bg-[#faf7f5] px-2.5 text-xs font-semibold text-neutral-800 hover:border-[#9a3412] focus:outline-hidden focus:ring-1 focus:ring-[#9a3412]"
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
            className="h-8 gap-1 px-2.5 text-xs text-neutral-500 hover:text-neutral-900"
            title="Reset to default filters"
          >
            <RotateCcw className="size-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </Button>
        )}
      </div>
    </div>
  );
}
