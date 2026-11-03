import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface OrderMetricCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  subtitle?: string;
  trendText?: string;
  trendDirection?: "up" | "down" | "neutral";
  iconClassName?: string;
  iconBgClassName?: string;
  className?: string;
}

export function OrderMetricCard({
  label,
  value,
  icon: Icon,
  subtitle,
  trendText,
  trendDirection = "neutral",
  iconClassName,
  iconBgClassName,
  className,
}: OrderMetricCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col justify-between rounded-xl sm:rounded-2xl border border-[#eddcd4] bg-white p-3.5 sm:p-4 shadow-2xs transition-all hover:shadow-xs",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <p
          className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-neutral-500 truncate"
          title={label}
        >
          {label}
        </p>
        <div
          className={cn(
            "flex size-7 sm:size-8 shrink-0 items-center justify-center rounded-lg sm:rounded-xl border border-[#eddcd4] bg-[#faf7f5] text-[#9a3412]",
            iconBgClassName,
            iconClassName,
          )}
        >
          <Icon className="size-3.5 sm:size-4" />
        </div>
      </div>

      <div className="mt-2 sm:mt-2.5">
        <p className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight text-neutral-900 truncate">
          {value}
        </p>

        {(trendText || subtitle) && (
          <div className="mt-1 flex flex-wrap items-center gap-1 text-[11px] sm:text-xs">
            {trendText && (
              <span
                className={cn(
                  "inline-flex items-center font-medium truncate",
                  trendDirection === "up" && "text-emerald-600",
                  trendDirection === "down" && "text-rose-600",
                  trendDirection === "neutral" && "text-neutral-500",
                )}
              >
                {trendText}
              </span>
            )}
            {subtitle && <span className="text-neutral-400 truncate">{subtitle}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
