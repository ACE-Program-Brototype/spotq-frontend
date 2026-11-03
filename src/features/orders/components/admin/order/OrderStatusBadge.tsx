import { cn } from "@/lib/utils/cn";
import type { RestaurantOrderStatus } from "../../../types/restaurant-orders.types";

interface OrderStatusBadgeProps {
  status: RestaurantOrderStatus | string;
  size?: "sm" | "md" | "lg";
  className?: string;
  showDot?: boolean;
}

const STATUS_CONFIG: Record<
  string,
  {
    label: string;
    badgeClass: string;
    dotClass: string;
    pulse?: boolean;
  }
> = {
  PLACED: {
    label: "Placed",
    badgeClass: "bg-sky-50 text-sky-700 border-sky-200",
    dotClass: "bg-sky-500",
    pulse: true,
  },
  CONFIRMED: {
    label: "Confirmed",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
    dotClass: "bg-blue-500",
  },
  PREPARING: {
    label: "Preparing",
    badgeClass: "bg-amber-50 text-amber-800 border-amber-200",
    dotClass: "bg-amber-500",
    pulse: true,
  },
  READY: {
    label: "Ready",
    badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-200",
    dotClass: "bg-indigo-500",
  },
  SERVED: {
    label: "Served",
    badgeClass: "bg-teal-50 text-teal-700 border-teal-200",
    dotClass: "bg-teal-500",
  },
  COMPLETED: {
    label: "Completed",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dotClass: "bg-emerald-500",
  },
  CANCELLED: {
    label: "Cancelled",
    badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
    dotClass: "bg-rose-500",
  },
};

export function OrderStatusBadge({
  status,
  size = "sm",
  className,
  showDot = true,
}: OrderStatusBadgeProps) {
  const normalizedStatus = status ? status.toUpperCase() : "PLACED";
  const config = STATUS_CONFIG[normalizedStatus] || {
    label: status,
    badgeClass: "bg-neutral-100 text-neutral-700 border-neutral-200",
    dotClass: "bg-neutral-400",
  };

  const sizeClasses = {
    sm: "px-2.5 py-0.5 text-[11px] font-semibold",
    md: "px-3 py-1 text-xs font-semibold",
    lg: "px-3.5 py-1.5 text-sm font-semibold",
  };

  const dotSizes = {
    sm: "size-1.5",
    md: "size-2",
    lg: "size-2.5",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border transition-all select-none shadow-2xs whitespace-nowrap shrink-0",
        config.badgeClass,
        sizeClasses[size],
        className,
      )}
    >
      {showDot && (
        <span
          className={cn(
            "rounded-full shrink-0",
            dotSizes[size],
            config.dotClass,
            config.pulse && "animate-pulse",
          )}
          aria-hidden="true"
        />
      )}
      <span className="truncate">{config.label}</span>
    </span>
  );
}
