/**
 * Staff Menu Item Table Component
 * High-density tabular representation using the reusable DataTable component.
 */

import { Clock, Tag, Utensils } from "lucide-react";
import { useMemo } from "react";
import { type Column, DataTable } from "@/components/common/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import type { StaffMenuItem, StaffMenuSortOption } from "../types/staff-menu-item.types";

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
}

export function StaffMenuItemTable({
  items,
  isLoading = false,
  sortBy = "displayOrder",
  sortOrder = "asc",
  onSort,
  page = 1,
  limit = 12,
  totalCount = 0,
  totalPages = 0,
  onPageChange,
  onLimitChange,
  onResetFilters,
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
            <div className="size-9 shrink-0 rounded-xl bg-[#faf7f5] border border-[#eddcd4] flex items-center justify-center text-[#9a3412]">
              <Utensils className="size-4" />
            </div>
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
                  <strong className="text-[#9a3412]">₹{v.price}</strong>
                </span>
              ))}
            </div>
          );
        },
      },
      {
        key: "isAvailable",
        header: "Stock Status",
        cell: ({ row: item }) => (
          <div className="space-y-1">
            {item.isAvailable ? (
              <Badge
                variant="outline"
                className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border-emerald-200 flex items-center gap-1.5 w-fit"
              >
                <span className="size-1.5 rounded-full bg-emerald-500" />
                In Stock
              </Badge>
            ) : (
              <div className="space-y-0.5">
                <Badge
                  variant="outline"
                  className="rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-bold text-rose-700 border-rose-200 flex items-center gap-1.5 w-fit"
                >
                  <span className="size-1.5 rounded-full bg-rose-500" />
                  86'd / Out
                </Badge>
                {item.autoResetAt && (
                  <p className="text-[10px] text-neutral-500 flex items-center gap-1 font-medium">
                    <Clock className="size-2.5 text-neutral-400" />
                    Reset:{" "}
                    {new Date(item.autoResetAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                )}
              </div>
            )}
          </div>
        ),
      },
    ],
    [onSort],
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
