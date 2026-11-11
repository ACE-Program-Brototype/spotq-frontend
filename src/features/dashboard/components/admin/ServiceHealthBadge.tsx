import { AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface ServiceHealthBadgeProps {
  serviceName: string;
  isAvailable?: boolean;
  className?: string;
  tooltip?: string;
}

export function ServiceHealthBadge({
  serviceName,
  isAvailable = true,
  className,
  tooltip,
}: ServiceHealthBadgeProps) {
  return (
    <div
      title={tooltip || `${serviceName}: ${isAvailable ? "Available" : "Unavailable"}`}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold border transition-colors",
        isAvailable
          ? "bg-emerald-50/80 text-emerald-700 border-emerald-200/70"
          : "bg-rose-50 text-rose-700 border-rose-200/70",
        className,
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          isAvailable ? "bg-emerald-500 animate-pulse" : "bg-rose-500",
        )}
      />
      <span>{serviceName}</span>
      {isAvailable ? (
        <CheckCircle2 className="size-2.5 opacity-60" />
      ) : (
        <AlertCircle className="size-2.5 text-rose-600" />
      )}
    </div>
  );
}
