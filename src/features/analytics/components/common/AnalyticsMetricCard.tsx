import { type LucideIcon, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface AnalyticsMetricCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  subtitle?: string;
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
        "flex flex-col justify-between rounded-xl sm:rounded-2xl border border-[#eddcd4] bg-white p-4 sm:p-5 shadow-2xs transition-all hover:shadow-xs",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <p
          className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-neutral-500 truncate"
          title={label}
        >
          {label}
        </p>
        <div
          className={cn(
            "flex size-8 sm:size-9 shrink-0 items-center justify-center rounded-xl border border-[#eddcd4] bg-[#faf7f5] text-[#9a3412]",
            iconBgClassName,
            iconClassName,
          )}
        >
          <Icon className="size-4 sm:size-4.5" />
        </div>
      </div>

      <div className="mt-3">
        <p className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-neutral-900 truncate">
          {value}
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs">
          {hasGrowth && (
            <span
              className={cn(
                "inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold text-[11px]",
                isPositive && "bg-emerald-50 text-emerald-700 border border-emerald-200/60",
                isNegative && "bg-rose-50 text-rose-700 border border-rose-200/60",
                isNeutral && "bg-neutral-100 text-neutral-600 border border-neutral-200",
              )}
            >
              {isPositive && <TrendingUp className="size-3" />}
              {isNegative && <TrendingDown className="size-3" />}
              <span>{isPositive ? `+${trendPercentage}%` : `${trendPercentage}%`}</span>
            </span>
          )}

          {trendText && (
            <span className="text-neutral-500 font-medium text-[11px]">{trendText}</span>
          )}

          {subtitle && !trendText && (
            <span className="text-neutral-400 truncate text-[11px]">{subtitle}</span>
          )}
        </div>
      </div>
    </div>
  );
}
