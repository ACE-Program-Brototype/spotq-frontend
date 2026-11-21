import { Calendar, Filter } from "lucide-react";
import {
  ANALYTICS_PERIOD_VALUES,
  ANALYTICS_PERIODS,
  BILLING_CYCLES,
  getYearOptions,
  MONTH_OPTIONS,
} from "@/features/dashboard/constants/platform-analytics.constants";
import type {
  BillingCycle,
  PlatformDashboardFilters,
} from "@/features/dashboard/types/platform-analytics.types";

export interface PlatformFilterBarProps {
  filters: PlatformDashboardFilters;
  onFilterChange: (updated: Partial<PlatformDashboardFilters>) => void;
  isLoading?: boolean;
}

export function PlatformFilterBar({
  filters,
  onFilterChange,
  isLoading = false,
}: PlatformFilterBarProps) {
  const yearOptions = getYearOptions();

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3.5 sm:p-4 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Timeline Granularity Pill Toggle */}
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-xs font-semibold text-slate-700">
            <Calendar className="size-3.5 text-slate-500" />
            Timeline:
          </span>
          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5 text-xs font-medium">
            {ANALYTICS_PERIODS.map(({ label, value }) => {
              const isActive = filters.period === value;
              return (
                <button
                  key={value}
                  type="button"
                  disabled={isLoading}
                  onClick={() => onFilterChange({ period: value })}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                    isActive
                      ? "bg-slate-900 text-white shadow-2xs font-semibold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Filters Group: Month, Year, Billing Cycle */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Month Selector (Relevant for DAY, WEEK, MONTH) */}
          {filters.period !== ANALYTICS_PERIOD_VALUES.YEAR && (
            <div className="flex items-center gap-1.5 text-xs">
              <label htmlFor="month-select" className="text-slate-500 font-medium">
                Month:
              </label>
              <select
                id="month-select"
                disabled={isLoading}
                value={filters.month ?? new Date().getMonth() + 1}
                onChange={(e) => onFilterChange({ month: Number(e.target.value) })}
                className="h-8 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-800 shadow-2xs outline-none focus:border-slate-400"
              >
                {MONTH_OPTIONS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Year Selector */}
          <div className="flex items-center gap-1.5 text-xs">
            <label htmlFor="year-select" className="text-slate-500 font-medium">
              Year:
            </label>
            <select
              id="year-select"
              disabled={isLoading}
              value={filters.year ?? new Date().getFullYear()}
              onChange={(e) => onFilterChange({ year: Number(e.target.value) })}
              className="h-8 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-800 shadow-2xs outline-none focus:border-slate-400"
            >
              {yearOptions.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* Billing Cycle Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="flex items-center gap-1 text-slate-500 font-medium">
              <Filter className="size-3 text-slate-400" />
              Cycle:
            </span>
            <select
              id="billing-cycle-select"
              disabled={isLoading}
              value={filters.billingCycle}
              onChange={(e) => onFilterChange({ billingCycle: e.target.value as BillingCycle })}
              className="h-8 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-800 shadow-2xs outline-none focus:border-slate-400"
            >
              {BILLING_CYCLES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
