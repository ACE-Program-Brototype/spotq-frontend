/**
 * Staff Menu Stats Cards Component
 * KPI cards for staff showing Total Dishes, In Stock items, and 86'd Out of Stock items.
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
      title: "Total Menu Items",
      value: totalItems,
      icon: UtensilsCrossed,
      color: "text-[#9a3412]",
      bg: "bg-[#fef3ec]",
      border: "border-[#fae2d3]",
      description: "Dishes in active catalog",
    },
    {
      title: "Currently In Stock",
      value: availableItems,
      icon: CheckCircle2,
      color: "text-emerald-700",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      description: "Available for ordering",
    },
    {
      title: "86'd / Out of Stock",
      value: outOfStockItems,
      icon: XCircle,
      color: "text-rose-700",
      bg: "bg-rose-50",
      border: "border-rose-200",
      description: "Temporarily unavailable",
    },
  ];

  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-3 gap-3.5", className)}>
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className={cn(
              "flex items-center gap-3.5 rounded-2xl border p-4 bg-white shadow-2xs transition-all",
              card.border,
            )}
          >
            <div
              className={cn(
                "flex size-11 shrink-0 items-center justify-center rounded-xl",
                card.bg,
                card.color,
              )}
            >
              <Icon className="size-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-500">{card.title}</p>
              <p className="text-xl font-bold text-neutral-900 leading-tight mt-0.5">
                {card.value}
              </p>
              <p className="text-[10px] text-neutral-400 mt-0.5">{card.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
