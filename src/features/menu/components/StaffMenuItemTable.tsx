/**
 * Staff Menu Item Table Component
 * High-density tabular representation using the reusable DataTable component.
 */

import { DataTable } from "@/components/common/table";
import { Button } from "@/components/ui/button";
import { useStaffMenuColumns } from "@/features/menu/hooks/use-staff-menu-columns";
import type { StaffMenuItem, StaffMenuSortOption } from "@/features/menu/types/staff-menu-item.types";

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
  onViewDetails?: (item: StaffMenuItem) => void;
  pendingItemIds?: Set<string>;
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
  onViewDetails,
  pendingItemIds,
  togglingItemId,
}: StaffMenuItemTableProps) {
  const columns = useStaffMenuColumns({
    onSort,
    onToggleAvailability,
    onViewDetails,
    pendingItemIds,
    togglingItemId,
  });

  return (
    <DataTable<StaffMenuItem>
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
      onRowClick={onViewDetails ? (item) => onViewDetails(item) : undefined}
      rowClassName="cursor-pointer hover:bg-[#fef9f6] transition-colors"
      containerClassName="overflow-x-auto min-w-0 overscroll-x-contain"
      tableClassName="w-full min-w-[620px] lg:min-w-full"
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
