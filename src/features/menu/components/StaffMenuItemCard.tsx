/**
 * Staff Menu Item Card Component
 * High-density operational card displaying dish details, variant pricing, and 86'd stock status.
 */

import { AlertTriangle, Clock, Layers, Tag, Utensils } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import type { StaffMenuItem } from "../types/staff-menu-item.types";

export interface StaffMenuItemCardProps {
  item: StaffMenuItem;
  className?: string;
}

export function StaffMenuItemCard({ item, className }: StaffMenuItemCardProps) {
  const isAvailable = item.isAvailable;

  return (
    <div
      data-testid={`staff-menu-item-card-${item.id}`}
      className={cn(
        "group relative flex flex-col justify-between rounded-2xl border p-4 sm:p-5 transition-all shadow-2xs",
        isAvailable
          ? "bg-white border-[#eddcd4] hover:border-[#e8631b]/40 hover:shadow-xs"
          : "bg-neutral-50/80 border-rose-200/80 hover:border-rose-300",
        className,
      )}
    >
      <div className="space-y-3">
        {/* Top Header: Category, SKU & Availability Badge */}
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1 rounded-lg bg-[#fef3ec] px-2 py-0.5 text-[11px] font-semibold text-[#9a3412] border border-[#fae2d3]">
              <Tag className="size-3 text-[#e8631b]" />
              {item.categoryName || "Unassigned"}
            </span>

            {item.sku && (
              <span className="inline-flex items-center gap-0.5 rounded-lg bg-neutral-100 px-2 py-0.5 font-mono text-[10px] text-neutral-600 border border-neutral-200">
                SKU: {item.sku}
              </span>
            )}
          </div>

          {/* Availability Status Badge */}
          {isAvailable ? (
            <Badge
              variant="outline"
              className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border-emerald-200 flex items-center gap-1.5"
            >
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              In Stock
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-bold text-rose-700 border-rose-200 flex items-center gap-1.5"
            >
              <span className="size-2 rounded-full bg-rose-500" />
              86'd / Out of Stock
            </Badge>
          )}
        </div>

        {/* Item Title & Base Price */}
        <div className="flex items-start justify-between gap-3 pt-1">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h3
                className={cn(
                  "text-base font-bold leading-tight truncate",
                  isAvailable
                    ? "text-neutral-900"
                    : "text-neutral-600 line-through decoration-rose-300",
                )}
                title={item.name}
              >
                {item.name}
              </h3>
            </div>
            {item.description && (
              <p className="mt-1 text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                {item.description}
              </p>
            )}
          </div>

          <div className="shrink-0 text-right">
            <span className="text-base sm:text-lg font-black text-[#9a3412]">
              ₹{typeof item.basePrice === "number" ? item.basePrice.toFixed(2) : item.basePrice}
            </span>
            <p className="text-[10px] font-medium text-neutral-400">
              {item.hasVariants ? "Base price" : "Standard"}
            </p>
          </div>
        </div>

        {/* Unavailability reason / Auto-reset notice */}
        {!isAvailable && (
          <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-2.5 text-[11px] text-rose-800 space-y-1">
            {item.unavailabilityReason && (
              <div className="flex items-center gap-1.5 font-medium">
                <AlertTriangle className="size-3.5 shrink-0 text-rose-600" />
                <span>Reason: {item.unavailabilityReason}</span>
              </div>
            )}
            {item.autoResetAt && (
              <div className="flex items-center gap-1.5 text-neutral-600">
                <Clock className="size-3.5 shrink-0 text-neutral-500" />
                <span>
                  Auto-resets:{" "}
                  <strong className="text-neutral-800">
                    {new Date(item.autoResetAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </strong>
                </span>
              </div>
            )}
          </div>
        )}

        {/* Variants Breakdown */}
        {item.hasVariants && item.variants && item.variants.length > 0 && (
          <div className="pt-2 border-t border-[#f3e6de]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-neutral-600 flex items-center gap-1">
                <Layers className="size-3 text-[#e8631b]" />
                Portions & Variants ({item.variants.length})
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {item.variants.map((v) => (
                <div
                  key={v.id}
                  className={cn(
                    "flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs border transition-colors",
                    v.isAvailable
                      ? "bg-[#faf7f5] border-[#eddcd4] text-neutral-800"
                      : "bg-rose-50/40 border-rose-200 text-neutral-500 line-through",
                  )}
                >
                  <div className="flex items-center gap-1 min-w-0">
                    <span className="font-semibold truncate">{v.name}</span>
                    {v.isDefault && (
                      <span className="text-[9px] font-bold uppercase text-[#e8631b] bg-[#fef3ec] px-1 rounded">
                        Default
                      </span>
                    )}
                  </div>
                  <span className="font-bold text-[#9a3412] shrink-0 ml-2">
                    ₹{typeof v.price === "number" ? v.price.toFixed(2) : v.price}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Meta */}
      <div className="mt-3 pt-2.5 border-t border-[#f3e6de] flex items-center justify-between text-[10px] text-neutral-400">
        <span className="flex items-center gap-1">
          <Utensils className="size-3 text-neutral-400" />
          Order priority: #{item.displayOrder}
        </span>
        <span>
          Updated:{" "}
          {new Date(item.updatedAt).toLocaleDateString([], { month: "short", day: "numeric" })}
        </span>
      </div>
    </div>
  );
}
