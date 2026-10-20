import { cn } from "@/lib/utils/cn";
import { TABLE_STATUS_CONFIG } from "../constants/table.constants";
import type { TableStatus } from "../types/table.types";

interface TableStatusBadgeProps {
  status: TableStatus;
  size?: "sm" | "md" | "lg";
  className?: string;
  showDot?: boolean;
  useShortLabel?: boolean;
}

export function TableStatusBadge({
  status,
  size = "sm",
  className,
  showDot = true,
  useShortLabel = false,
}: TableStatusBadgeProps) {
  const config = TABLE_STATUS_CONFIG[status] || {
    label: status,
    shortLabel: status,
    badgeClass: "bg-neutral-100 text-neutral-600 border-neutral-300",
    dotClass: "bg-neutral-400",
  };

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[11px] sm:text-xs font-bold",
    md: "px-2.5 py-1 text-xs font-bold",
    lg: "px-3.5 py-1.5 text-sm font-bold",
  };

  const dotSizes = {
    sm: "size-1.5",
    md: "size-2",
    lg: "size-2.5",
  };

  const displayLabel = useShortLabel && config.shortLabel ? config.shortLabel : config.label;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 sm:gap-1.5 rounded-full border transition-all select-none shadow-2xs whitespace-nowrap shrink-0",
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
            status === "AVAILABLE" && "animate-pulse",
          )}
          aria-hidden="true"
        />
      )}
      <span className="truncate">{displayLabel}</span>
    </span>
  );
}
