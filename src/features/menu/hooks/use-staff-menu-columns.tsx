import { Clock, Eye, Loader2, Power, PowerOff, Tag } from "lucide-react";
import { useMemo } from "react";
import type { Column } from "@/components/common/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { StaffMenuItemThumbnail } from "../components/StaffMenuItemThumbnail";
import type { StaffMenuItem, StaffMenuSortOption } from "../types/staff-menu-item.types";

export interface UseStaffMenuColumnsOptions {
  onSort?: (key: StaffMenuSortOption) => void;
  onToggleAvailability?: (item: StaffMenuItem) => void;
  onViewDetails?: (item: StaffMenuItem) => void;
  pendingItemIds?: Set<string>;
  togglingItemId?: string | null;
}

export function useStaffMenuColumns({
  onSort,
  onToggleAvailability,
  onViewDetails,
  pendingItemIds,
  togglingItemId,
}: UseStaffMenuColumnsOptions = {}): Column<StaffMenuItem>[] {
  return useMemo<Column<StaffMenuItem>[]>(
    () => [
      {
        key: "name",
        sortKey: "name",
        header: "Item & SKU",
        sortable: Boolean(onSort),
        cell: ({ row: item }) => (
          <div className="flex items-start gap-3 py-1">
            <StaffMenuItemThumbnail image={item.image ?? item.imageUrl} name={item.name} />
            <div className="min-w-0">
              <p
                className={cn(
                  "font-bold text-sm leading-tight truncate",
                  item.isAvailable
                    ? "text-neutral-900"
                    : "text-neutral-600 line-through decoration-rose-300",
                )}
              >
                {item.name}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                {item.sku ? (
                  <span className="font-mono text-[10px] text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded">
                    {item.sku}
                  </span>
                ) : (
                  <span className="text-[10px] text-neutral-400 font-mono">
                    ID: {item.id.slice(0, 8)}...
                  </span>
                )}
                {item.description && (
                  <span className="text-[11px] text-neutral-400 truncate max-w-[200px] hidden md:inline">
                    • {item.description}
                  </span>
                )}
              </div>
            </div>
          </div>
        ),
      },
      {
        key: "category",
        sortKey: "displayOrder",
        header: "Category",
        sortable: Boolean(onSort),
        cell: ({ row: item }) => (
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-lg bg-[#fef3ec] px-2 py-0.5 text-xs font-semibold text-[#9a3412] border border-[#fae2d3]">
              <Tag className="size-3 text-[#e8631b]" />
              {item.categoryName || "Unassigned"}
            </span>
            <span className="text-[10px] text-neutral-400 font-mono">#{item.displayOrder}</span>
          </div>
        ),
      },
      {
        key: "basePrice",
        sortKey: "price",
        header: "Base Price",
        sortable: Boolean(onSort),
        cell: ({ row: item }) => (
          <span className="text-xs font-bold text-[#9a3412]">
            ₹{typeof item.basePrice === "number" ? item.basePrice.toFixed(2) : item.basePrice}
          </span>
        ),
      },
      {
        key: "variants",
        header: "Portions / Variants",
        cell: ({ row: item }) => {
          if (!item.hasVariants || !item.variants || item.variants.length === 0) {
            return <span className="text-xs text-neutral-400">Single portion</span>;
          }

          return (
            <div className="flex flex-wrap gap-1 max-w-[200px]">
              {item.variants.map((v) => (
                <span
                  key={v.id}
                  className={cn(
                    "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border",
                    v.isAvailable
                      ? "bg-neutral-50 text-neutral-700 border-neutral-200"
                      : "bg-rose-50 text-rose-700 border-rose-200 line-through",
                  )}
                >
                  {v.name}
                  <span className="opacity-60">₹{v.price}</span>
                </span>
              ))}
            </div>
          );
        },
      },
      {
        key: "isAvailable",
        sortKey: "isAvailable",
        header: "Live Status",
        sortable: Boolean(onSort),
        cell: ({ row: item }) => {
          const isPending = pendingItemIds?.has(item.id) || togglingItemId === item.id;

          return (
            <div className="flex flex-col gap-1 items-start">
              <Badge
                variant="outline"
                className={cn(
                  "px-2.5 py-0.5 text-xs font-semibold rounded-full border flex items-center gap-1.5 w-fit",
                  item.isAvailable
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-rose-50 text-rose-700 border-rose-200",
                )}
              >
                <span
                  className={cn(
                    "size-1.5 rounded-full shrink-0",
                    item.isAvailable ? "bg-emerald-500" : "bg-rose-500",
                  )}
                />
                {isPending ? "Updating..." : item.isAvailable ? "In Stock" : "86'd (Unavailable)"}
              </Badge>

              {!item.isAvailable && item.autoResetAt && (
                <span className="inline-flex items-center gap-1 text-[10px] text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded">
                  <Clock className="size-2.5" />
                  Resets tomorrow
                </span>
              )}
              {!item.isAvailable && item.unavailabilityReason && (
                <span className="text-[10px] text-neutral-400 max-w-[140px] truncate">
                  Reason: {item.unavailabilityReason}
                </span>
              )}
            </div>
          );
        },
      },
      {
        key: "actions",
        header: "Quick Actions",
        className: "text-right",
        cell: ({ row: item }) => {
          const isPending = pendingItemIds?.has(item.id) || togglingItemId === item.id;

          return (
            <div className="flex items-center justify-end gap-2">
              {onToggleAvailability && (
                <Button
                  size="sm"
                  variant="outline"
                  aria-label={`Toggle ${item.name} availability`}
                  disabled={isPending || item.isActive === false}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleAvailability(item);
                  }}
                  className={cn(
                    "h-8 px-2.5 text-xs font-medium rounded-lg border transition-colors",
                    item.isAvailable
                      ? "border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300"
                      : "border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300",
                  )}
                >
                  {isPending ? (
                    <Loader2 className="size-3.5 animate-spin mr-1 text-neutral-500" />
                  ) : item.isAvailable ? (
                    <PowerOff className="size-3.5 mr-1" />
                  ) : (
                    <Power className="size-3.5 mr-1" />
                  )}
                  {item.isAvailable ? "86 Item" : "Mark In Stock"}
                </Button>
              )}

              {onViewDetails && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onViewDetails(item)}
                  className="h-8 w-8 p-0 text-neutral-500 hover:text-neutral-900 rounded-lg hover:bg-neutral-100"
                  aria-label={`View details for ${item.name}`}
                >
                  <Eye className="size-4" />
                </Button>
              )}
            </div>
          );
        },
      },
    ],
    [onSort, onToggleAvailability, onViewDetails, pendingItemIds, togglingItemId],
  );
}
