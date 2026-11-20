/**
 * Staff Menu Stats Cards Component
 * KPI cards for staff showing Total Dishes, In Stock items, and Out of Stock items.
 * Responsive design with compact 3-in-1 line layout on mobile viewports.
 */

import { CheckCircle2, UtensilsCrossed, XCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface StaffMenuStatsCardsProps {
  totalItems: number;
  availableItems: number;
  outOfStockItems: number;
  className?: string;
}

export function StaffMenuStatsCards({
  totalItems,
  availableItems,
  outOfStockItems,
  className,
}: StaffMenuStatsCardsProps) {
  const cards = [
    {
      title: "Total Dishes",
      value: totalItems,
      icon: UtensilsCrossed,
      color: "text-[#9a3412]",
      bg: "bg-[#fef3ec]",
      border: "border-[#fae2d3]",
      description: "Total dishes in catalog",
    },
    {
      title: "In Stock",
      value: availableItems,
      icon: CheckCircle2,
      color: "text-emerald-700",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      description: "Available items on active page",
    },
    {
      title: "Out of Stock",
      value: outOfStockItems,
      icon: XCircle,
      color: "text-rose-700",
      bg: "bg-rose-50",
      border: "border-rose-200",
      description: "Unavailable items on active page",
    },
  ];

  return (
    <div className={cn("grid grid-cols-3 gap-2 sm:gap-3.5", className)}>
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className={cn(
              "flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3.5 rounded-xl sm:rounded-2xl border p-2 sm:p-4 bg-white shadow-2xs transition-all min-w-0",
              card.border,
            )}
          >
            <div
              className={cn(
                "flex size-7 sm:size-11 shrink-0 items-center justify-center rounded-lg sm:rounded-xl",
                card.bg,
                card.color,
              )}
            >
              <Icon className="size-3.5 sm:size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p
                className="text-[10px] sm:text-xs font-semibold text-neutral-500 truncate"
                title={card.title}
              >
                {card.title}
              </p>
              <p className="text-base sm:text-2xl font-extrabold text-neutral-900 leading-tight mt-0.5 sm:mt-1">
                {card.value}
              </p>
              <p className="text-[10px] text-neutral-400 mt-0.5 hidden sm:block truncate">
                {card.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
