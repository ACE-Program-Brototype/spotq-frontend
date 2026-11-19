import { type LucideIcon, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface AnalyticsMetricCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  subtitle: string;
  trendPercentage?: number | null;
  trendText?: string;
  iconClassName?: string;
  iconBgClassName?: string;
  className?: string;
}

export function AnalyticsMetricCard({
  label,
  value,
  icon: Icon,
  subtitle,
  trendPercentage,
  trendText,
  iconClassName,
  iconBgClassName,
  className,
}: AnalyticsMetricCardProps) {
  const hasGrowth = typeof trendPercentage === "number";
  const isPositive = hasGrowth && trendPercentage > 0;
  const isNegative = hasGrowth && trendPercentage < 0;
  const isNeutral = hasGrowth && trendPercentage === 0;

  return (
    <div
      className={cn(
        "flex flex-col justify-center md:justify-between rounded-xl md:rounded-2xl border border-[#eddcd4] bg-white px-2.5 py-1.5 md:p-4 sm:md:p-5 shadow-2xs transition-all hover:shadow-xs",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-1 md:gap-2">
        <p
          className="text-[10px] sm:text-[11px] md:text-xs font-bold uppercase tracking-wider text-neutral-500 truncate"
          title={label}
        >
          {label}
        </p>
        <div
          className={cn(
            "flex size-5 sm:size-5.5 md:size-8 sm:md:size-9 shrink-0 items-center justify-center rounded-md md:rounded-xl border border-[#eddcd4] bg-[#faf7f5] text-[#9a3412]",
            iconBgClassName,
            iconClassName,
          )}
        >
          <Icon className="size-3 md:size-4 sm:md:size-4.5" />
        </div>
      </div>

      <div className="mt-0.5 md:mt-3">
        <p className="text-sm sm:text-base md:text-xl sm:md:text-2xl lg:text-3xl font-bold md:font-extrabold tracking-tight text-neutral-900 leading-tight md:leading-normal truncate">
          {value}
        </p>

        <div className="mt-0.5 md:mt-2 flex flex-wrap items-center gap-1 md:gap-1.5 text-[9px] sm:text-[10px] md:text-xs leading-tight">
          {hasGrowth && (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 md:gap-1 px-1 py-0.2 md:px-2 md:py-0.5 rounded-sm md:rounded-full font-semibold text-[9px] md:text-[11px] shrink-0",
                isPositive && "bg-emerald-50 text-emerald-700 border border-emerald-200/60",
                isNegative && "bg-rose-50 text-rose-700 border border-rose-200/60",
                isNeutral && "bg-neutral-100 text-neutral-600 border border-neutral-200",
              )}
            >
              {isPositive && <TrendingUp className="size-2.5 md:size-3" />}
              {isNegative && <TrendingDown className="size-2.5 md:size-3" />}
              <span>{isPositive ? `+${trendPercentage}%` : `${trendPercentage}%`}</span>
            </span>
          )}

          {trendText && (
            <span className="text-neutral-500 font-medium text-[9px] sm:text-[10px] md:text-[11px] truncate">
              {trendText}
            </span>
          )}

          {subtitle && !trendText && (
            <span className="text-neutral-400 truncate text-[9px] sm:text-[10px] md:text-[11px]">
              {subtitle}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
