import { Eye, Pencil, Sparkles, Trash2, Utensils } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { RESTAURANT_ROUTES } from "@/app/router/routes.constants";
import { type Column, DataTable } from "@/components/common/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { usePresignedUrl } from "@/hooks/usePresignedUrl";
import type {
  MenuItemPagination,
  MenuItemSortBy,
  MenuItemSortOrder,
  MenuItemSummary,
} from "@/features/menu/types/menu-item.types";

function MenuItemThumbnail({ image, name }: { image: string | null; name: string }) {
  const { data: presignedUrl, isLoading } = usePresignedUrl(image);
  const [hasError, setHasError] = useState(false);

  const displayUrl = presignedUrl || image;

  if (isLoading) {
    return (
      <div className="size-7.5 sm:size-9 shrink-0 rounded-md sm:rounded-lg overflow-hidden bg-[#faf7f5] border border-[#eddcd4] flex items-center justify-center">
        <Skeleton className="h-full w-full" />
      </div>
    );
  }

  if (displayUrl && !hasError) {
    return (
      <div className="size-7.5 sm:size-9 shrink-0 rounded-md sm:rounded-lg overflow-hidden bg-[#faf7f5] border border-[#eddcd4] flex items-center justify-center">
        <img
          src={displayUrl}
          alt={name}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={() => setHasError(true)}
        />
      </div>
    );
  }

  return (
    <div className="size-7.5 sm:size-9 shrink-0 rounded-md sm:rounded-lg overflow-hidden bg-[#faf7f5] border border-[#eddcd4] flex items-center justify-center text-[#e8631b]">
      <Utensils className="size-3.5 sm:size-4" />
    </div>
  );
}

export interface MenuItemTableProps {
  items: MenuItemSummary[];
  isLoading?: boolean;
  sortBy?: MenuItemSortBy;
  sortOrder?: MenuItemSortOrder;
  onSort?: (key: MenuItemSortBy) => void;
  pagination?: MenuItemPagination;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  onResetFilters?: () => void;
  onEdit?: (item: MenuItemSummary) => void;
  onDelete?: (item: MenuItemSummary) => void;
}

export function MenuItemTable({
  items,
  isLoading = false,
  sortBy = "createdAt",
  sortOrder = "desc",
  onSort,
  pagination,
  onPageChange,
  onLimitChange,
  onResetFilters,
  onEdit,
  onDelete,
}: MenuItemTableProps) {
  const normalizedSortOrder = sortOrder?.toLowerCase() === "asc" ? "asc" : "desc";

  const columns = useMemo<Column<MenuItemSummary>[]>(
    () => [
      {
        key: "name",
        sortKey: "name",
        header: "Item & Details",
        sortable: Boolean(onSort),
        width: "32%",
        className: "py-2 sm:py-2.5 px-1.5 sm:px-3 min-w-0 overflow-hidden",
        headerClassName: "h-8.5 sm:h-10 py-1.5 sm:py-2 px-1.5 sm:px-3 text-[10px] sm:text-xs select-none",
        cell: ({ row: item }) => (
          <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
            <MenuItemThumbnail image={item.image} name={item.name} />

            {/* Name & Badges */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1 min-w-0">
                <p
                  className="font-bold text-xs sm:text-sm text-neutral-900 leading-tight truncate block max-w-full"
                  title={item.name}
                >
                  {item.name}
                </p>
                {item.isFeatured && (
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-50 px-1 py-0.2 sm:px-1.5 sm:py-0.5 text-[9px] font-bold text-amber-700 border border-amber-200 shrink-0">
                    <Sparkles className="size-2 text-amber-500" />
                    Featured
                  </span>
                )}
              </div>
            </div>
          </div>
        ),
      },
      {
        key: "category",
        header: "Category",
        width: "18%",
        className: "py-2 sm:py-2.5 px-1.5 sm:px-2.5 min-w-0 overflow-hidden",
        headerClassName: "h-8.5 sm:h-10 py-1.5 sm:py-2 px-1.5 sm:px-2.5 text-[10px] sm:text-xs select-none",
        cell: ({ row: item }) => (
          <span
            className="text-[11px] sm:text-xs font-medium text-neutral-700 truncate block max-w-full"
            title={item.categoryName || "Unassigned"}
          >
            {item.categoryName || "Unassigned"}
          </span>
        ),
      },
      {
        key: "price",
        sortKey: "price",
        header: "Price",
        sortable: Boolean(onSort),
        width: "12%",
        className: "py-2 sm:py-2.5 px-1.5 sm:px-2.5 whitespace-nowrap min-w-0",
        headerClassName: "h-8.5 sm:h-10 py-1.5 sm:py-2 px-1.5 sm:px-2.5 text-[10px] sm:text-xs select-none",
        cell: ({ row: item }) => (
          <span className="text-[11px] sm:text-xs font-bold text-neutral-900 whitespace-nowrap">
            ₹{typeof item.price === "number" ? item.price.toFixed(2) : item.price}
          </span>
        ),
      },
      {
        key: "dietary",
        header: "Dietary",
        width: "12%",
        className: "py-2 sm:py-2.5 px-1 sm:px-2 whitespace-nowrap min-w-0",
        headerClassName: "h-8.5 sm:h-10 py-1.5 sm:py-2 px-1 sm:px-2 text-[10px] sm:text-xs select-none",
        cell: ({ row: item }) =>
          item.isVegetarian ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-1.5 py-0.5 sm:px-2 sm:py-0.5 text-[9px] sm:text-[10px] font-semibold text-emerald-700 border border-emerald-200 whitespace-nowrap">
              <span className="size-1 sm:size-1.5 rounded-full bg-emerald-500" />
              Veg
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-1.5 py-0.5 sm:px-2 sm:py-0.5 text-[9px] sm:text-[10px] font-semibold text-rose-700 border border-rose-200 whitespace-nowrap">
              <span className="size-1 sm:size-1.5 rounded-full bg-rose-500" />
              Non-Veg
            </span>
          ),
      },
      {
        key: "isAvailable",
        header: "Availability",
        width: "14%",
        className: "py-2 sm:py-2.5 px-1 sm:px-2 whitespace-nowrap min-w-0",
        headerClassName: "h-8.5 sm:h-10 py-1.5 sm:py-2 px-1 sm:px-2 text-[10px] sm:text-xs select-none",
        cell: ({ row: item }) =>
          item.isAvailable ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-1.5 py-0.5 sm:px-2 sm:py-0.5 text-[9px] sm:text-[10px] font-semibold text-emerald-700 border border-emerald-200 whitespace-nowrap">
              <span className="size-1 sm:size-1.5 rounded-full bg-emerald-500" />
              In Stock
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-1.5 py-0.5 sm:px-2 sm:py-0.5 text-[9px] sm:text-[10px] font-semibold text-neutral-600 border border-neutral-200 whitespace-nowrap">
              <span className="size-1 sm:size-1.5 rounded-full bg-neutral-400" />
              Out of Stock
            </span>
          ),
      },
      {
        key: "actions",
        header: "Actions",
        align: "right",
        width: "12%",
        className: "py-1.5 sm:py-2.5 px-1 sm:px-2.5 text-right whitespace-nowrap min-w-0",
        headerClassName: "h-8.5 sm:h-10 py-1.5 sm:py-2 px-1 sm:px-2.5 text-right text-[10px] sm:text-xs select-none",
        cell: ({ row: item }) => (
          <div className="flex items-center justify-end gap-0.5 sm:gap-1">
            <Link
              to={RESTAURANT_ROUTES.MENU.DETAIL(item.id)}
              className="rounded-lg p-1 sm:p-1.5 text-neutral-400 hover:text-[#e8631b] hover:bg-[#fef3ec] transition-colors"
              aria-label={`View details for ${item.name}`}
              title="View menu item"
            >
              <Eye className="size-3.5 sm:size-4" />
            </Link>

            {onEdit ? (
              <button
                type="button"
                onClick={() => onEdit(item)}
                className="rounded-lg p-1 sm:p-1.5 text-neutral-400 hover:text-[#e8631b] hover:bg-[#fef3ec] transition-colors cursor-pointer"
                aria-label={`Edit ${item.name}`}
                title="Edit menu item"
              >
                <Pencil className="size-3.5 sm:size-4" />
              </button>
            ) : (
              <Link
                to={RESTAURANT_ROUTES.MENU.EDIT(item.id)}
                className="rounded-lg p-1 sm:p-1.5 text-neutral-400 hover:text-[#e8631b] hover:bg-[#fef3ec] transition-colors"
                aria-label={`Edit ${item.name}`}
                title="Edit menu item"
              >
                <Pencil className="size-3.5 sm:size-4" />
              </Link>
            )}

            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(item)}
                className="rounded-lg p-1 sm:p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                aria-label={`Delete ${item.name}`}
                title="Delete menu item"
              >
                <Trash2 className="size-3.5 sm:size-4" />
              </button>
            )}
          </div>
        ),
      },
    ],
    [onSort, onEdit, onDelete],
  );

  return (
    <div className="min-w-0" data-testid="menu-item-table-container">
      <DataTable
        data={items}
        columns={columns}
        isLoading={isLoading}
        sortBy={sortBy}
        sortOrder={normalizedSortOrder}
        onSort={onSort ? (key) => onSort(key as MenuItemSortBy) : undefined}
        getRowId={(item) => item.id}
        getRowTestId={(item) => `menu-item-row-${item.id}`}
        testId="menu-item-table"
        theme="admin"
        containerClassName="overflow-x-auto min-w-0 overscroll-x-contain"
        tableClassName="w-full min-w-[560px] sm:min-w-full table-fixed"
        className="w-full text-xs sm:text-sm"
        headerClassName="bg-[#fffcf9] text-neutral-600 border-b border-[#eddcd4] select-none"
        emptyTitle="No menu items found"
        emptyDescription="No dishes or beverages match the selected filter criteria."
        emptyAction={
          onResetFilters ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onResetFilters}
              className="rounded-xl border-[#eddcd4] text-xs font-medium"
            >
              Reset Filters
            </Button>
          ) : undefined
        }
        pagination={
          pagination && onPageChange
            ? {
                currentPage: pagination.page,
                totalPages: pagination.totalPages,
                totalItems: pagination.total,
                pageSize: pagination.limit,
                onPageChange,
                onPageSizeChange: onLimitChange,
                pageSizeOptions: [10, 20, 50],
              }
            : undefined
        }
      />
    </div>
  );
}

export default MenuItemTable;
