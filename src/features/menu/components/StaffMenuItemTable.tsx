/**
 * Staff Menu Item Table Component
 * High-density tabular representation using the reusable DataTable component.
 */

import { Clock, Loader2, Power, PowerOff, Tag, Utensils } from "lucide-react";
import { useMemo, useState } from "react";
import { type Column, DataTable } from "@/components/common/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import type { StaffMenuItem, StaffMenuSortOption } from "../types/staff-menu-item.types";

function StaffMenuItemThumbnail({ image, name }: { image?: string | null; name: string }) {
  const [hasError, setHasError] = useState(false);

  if (image && !hasError) {
    return (
      <div className="size-10 shrink-0 rounded-xl overflow-hidden bg-[#faf7f5] border border-[#eddcd4] flex items-center justify-center">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={() => setHasError(true)}
        />
      </div>
    );
  }

  return (
    <div className="size-10 shrink-0 rounded-xl bg-[#faf7f5] border border-[#eddcd4] flex items-center justify-center text-[#9a3412]">
      <Utensils className="size-4" />
    </div>
  );
}

export interface StaffMenuItemTableProps {
  items: StaffMenuItem[];
  isLoading?: boolean;
  sortBy?: StaffMenuSortOption;
  sortOrder?: "asc" | "desc";
  onSort?: (key: StaffMenuSortOption) => void;
  page?: number;
  limit?: number;
  totalCount?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  onResetFilters?: () => void;
  onToggleAvailability?: (item: StaffMenuItem) => void;
  togglingItemId?: string | null;
}

export function StaffMenuItemTable({
  items,
  isLoading = false,
  sortBy = "createdAt",
  sortOrder = "desc",
  onSort,
  page = 1,
  limit = 12,
  totalCount = 0,
  totalPages = 0,
  onPageChange,
  onLimitChange,
  onResetFilters,
  onToggleAvailability,
  togglingItemId,
}: StaffMenuItemTableProps) {
  const columns = useMemo<Column<StaffMenuItem>[]>(
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
            <div className="flex flex-wrap gap-1 max-w-[260px]">
              {item.variants.map((v) => (
                <span
                  key={v.id}
                  className={cn(
                    "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium border",
                    v.isAvailable
                      ? "bg-[#faf7f5] border-[#eddcd4] text-neutral-800"
                      : "bg-rose-50/50 border-rose-200 text-neutral-400 line-through",
                  )}
                >
                  <span>{v.name}</span>
                  <strong className="text-[#9a3412]">
                    ₹{typeof v.price === "number" ? v.price.toFixed(2) : v.price}
                  </strong>
                </span>
              ))}
            </div>
          );
        },
      },
      {
        key: "isAvailable",
        header: "Stock Status",
        cell: ({ row: item }) => {
          const isItemToggling = togglingItemId === item.id;

          return (
            <div className="space-y-1">
              {onToggleAvailability ? (
                <button
                  type="button"
                  disabled={isItemToggling}
                  onClick={() => onToggleAvailability(item)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold border transition-all cursor-pointer shadow-2xs select-none active:scale-95",
                    item.isAvailable
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300"
                      : "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 hover:border-rose-300",
                    isItemToggling && "opacity-75 cursor-not-allowed",
                  )}
                  aria-label={
                    item.isAvailable
                      ? `Mark ${item.name} as out of stock`
                      : `Mark ${item.name} as in stock`
                  }
                  title={
                    item.isAvailable
                      ? "Click to 86 / mark out of stock"
                      : "Click to restore / mark in stock"
                  }
                >
                  {isItemToggling ? (
                    <Loader2 className="size-3 animate-spin" />
                  ) : (
                    <span
                      className={cn(
                        "size-1.5 rounded-full",
                        item.isAvailable ? "bg-emerald-500" : "bg-rose-500",
                      )}
                    />
                  )}
                  <span>{item.isAvailable ? "In Stock" : "86'd / Out"}</span>
                </button>
              ) : item.isAvailable ? (
                <Badge
                  variant="outline"
                  className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border-emerald-200 flex items-center gap-1.5 w-fit"
                >
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  In Stock
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-bold text-rose-700 border-rose-200 flex items-center gap-1.5 w-fit"
                >
                  <span className="size-1.5 rounded-full bg-rose-500" />
                  86'd / Out
                </Badge>
              )}

              {!item.isAvailable && item.autoResetAt && (
                <p className="text-[10px] text-neutral-500 flex items-center gap-1 font-medium pl-1">
                  <Clock className="size-2.5 text-neutral-400" />
                  Reset:{" "}
                  {new Date(item.autoResetAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              )}
            </div>
          );
        },
      },
      {
        key: "actions",
        header: "Actions",
        align: "right",
        cell: ({ row: item }) => {
          const isItemToggling = togglingItemId === item.id;

          if (!onToggleAvailability) return null;

          return (
            <div className="flex items-center justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isItemToggling}
                onClick={() => onToggleAvailability(item)}
                className={cn(
                  "h-8 px-3 rounded-xl text-xs font-semibold border gap-1.5 shadow-2xs transition-all cursor-pointer active:scale-95",
                  item.isAvailable
                    ? "border-rose-200 bg-rose-50/60 text-rose-700 hover:bg-rose-100 hover:text-rose-800"
                    : "border-emerald-200 bg-emerald-50/60 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800",
                )}
                aria-label={`Toggle ${item.name} availability`}
              >
                {isItemToggling ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : item.isAvailable ? (
                  <PowerOff className="size-3.5 text-rose-600" />
                ) : (
                  <Power className="size-3.5 text-emerald-600" />
                )}
                <span>{item.isAvailable ? "86 Item" : "Restore"}</span>
              </Button>
            </div>
          );
        },
      },
    ],
    [onSort, onToggleAvailability, togglingItemId],
  );

  return (
    <DataTable
      data={items}
      columns={columns}
      isLoading={isLoading}
      sortBy={sortBy}
      sortOrder={sortOrder}
      onSort={onSort ? (key) => onSort(key as StaffMenuSortOption) : undefined}
      getRowId={(item) => item.id}
      getRowTestId={(item) => `staff-menu-item-row-${item.id}`}
      testId="staff-menu-item-table"
      theme="restaurant"
      headerClassName="bg-[#faf7f5] text-neutral-700 border-b border-[#eddcd4]"
      emptyTitle="No staff menu items found"
      emptyDescription="No dishes match the active search or category filters."
      emptyAction={
        onResetFilters ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onResetFilters}
            className="rounded-xl border-[#eddcd4] text-xs font-semibold"
          >
            Clear Filters
          </Button>
        ) : undefined
      }
      pagination={
        totalPages > 0 && onPageChange
          ? {
              currentPage: page,
              totalPages,
              totalItems: totalCount,
              pageSize: limit,
              onPageChange,
              onPageSizeChange: onLimitChange,
              pageSizeOptions: [10, 12, 24, 48],
            }
          : undefined
      }
    />
  );
}
