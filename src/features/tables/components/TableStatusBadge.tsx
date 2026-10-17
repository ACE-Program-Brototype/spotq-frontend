import { cn } from "@/lib/utils/cn";
import { TABLE_STATUS_CONFIG } from "../constants/table.constants";
import type { TableStatus } from "../types/table.types";

interface TableStatusBadgeProps {
  status: TableStatus;
  size?: "sm" | "md" | "lg";
  className?: string;
  showDot?: boolean;
}

export function TableStatusBadge({
  status,
  size = "sm",
  className,
  showDot = true,
}: TableStatusBadgeProps) {
  const config = TABLE_STATUS_CONFIG[status] || {
    label: status,
    badgeClass: "bg-neutral-100 text-neutral-600 border-neutral-300",
    dotClass: "bg-neutral-400",
  };

  const sizeClasses = {
    sm: "px-2.5 py-0.5 text-xs font-bold",
    md: "px-3 py-1 text-xs font-bold",
    lg: "px-3.5 py-1.5 text-sm font-bold",
  };

  const dotSizes = {
    sm: "size-1.5",
    md: "size-2",
    lg: "size-2.5",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border transition-all select-none shadow-2xs",
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
      <span>{config.label}</span>
    </span>
  );
}
