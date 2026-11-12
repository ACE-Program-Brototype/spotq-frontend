/**
 * Platform Admin Payment Status Badge Component
 * Renders consistent, accessible status indicators for payment lifecycle states:
 * PAID, PENDING, REFUNDED, FAILED.
 */

import { AlertCircle, CheckCircle2, Clock, RotateCcw } from "lucide-react";
import type { AdminOrderPaymentStatus } from "@/features/orders/types/admin-orders.types";
import { cn } from "@/lib/utils/cn";

interface AdminPaymentStatusBadgeProps {
  status: AdminOrderPaymentStatus | string;
  size?: "sm" | "md";
  className?: string;
  showIcon?: boolean;
}

const PAYMENT_STATUS_CONFIG: Record<
  string,
  {
    label: string;
    badgeClass: string;
    icon: typeof CheckCircle2;
    iconClass: string;
  }
> = {
  PAID: {
    label: "Paid",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: CheckCircle2,
    iconClass: "text-emerald-600",
  },
  PENDING: {
    label: "Pending",
    badgeClass: "bg-amber-50 text-amber-800 border-amber-200",
    icon: Clock,
    iconClass: "text-amber-600",
  },
  REFUNDED: {
    label: "Refunded",
    badgeClass: "bg-purple-50 text-purple-700 border-purple-200",
    icon: RotateCcw,
    iconClass: "text-purple-600",
  },
  FAILED: {
    label: "Failed",
    badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
    icon: AlertCircle,
    iconClass: "text-rose-600",
  },
};

export function AdminPaymentStatusBadge({
  status,
  size = "sm",
  className,
  showIcon = true,
}: AdminPaymentStatusBadgeProps) {
  const normalized = (status ?? "PENDING").toUpperCase();
  const config = PAYMENT_STATUS_CONFIG[normalized] ?? {
    label: status || "Unknown",
    badgeClass: "bg-neutral-100 text-neutral-700 border-neutral-200",
    icon: Clock,
    iconClass: "text-neutral-500",
  };

  const Icon = config.icon;

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[11px] font-semibold gap-1",
    md: "px-2.5 py-1 text-xs font-semibold gap-1.5",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border transition-all select-none shadow-2xs whitespace-nowrap shrink-0",
        config.badgeClass,
        sizeClasses[size],
        className,
      )}
      data-testid={`payment-status-badge-${normalized.toLowerCase()}`}
    >
      {showIcon && <Icon className="size-3 shrink-0" />}
      <span>{config.label}</span>
    </span>
  );
}
