import { Eye, Pencil, Sparkles, Trash2, Utensils } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { RESTAURANT_ROUTES } from "@/app/router/routes.constants";
import { Pagination } from "@/components/common/Pagination";
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
      <div className="size-9 sm:size-11 shrink-0 rounded-lg sm:rounded-xl overflow-hidden bg-[#faf7f5] border border-[#eddcd4] flex items-center justify-center">
        <Skeleton className="h-full w-full" />
      </div>
    );
  }

  if (displayUrl && !hasError) {
    return (
      <div className="size-9 sm:size-11 shrink-0 rounded-lg sm:rounded-xl overflow-hidden bg-[#faf7f5] border border-[#eddcd4] flex items-center justify-center">
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
    <div className="size-9 sm:size-11 shrink-0 rounded-lg sm:rounded-xl overflow-hidden bg-[#faf7f5] border border-[#eddcd4] flex items-center justify-center text-[#e8631b]">
      <Utensils className="size-4 sm:size-5" />
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
        className: "py-2.5 sm:py-3.5 px-2.5 sm:px-4",
        headerClassName: "py-2.5 sm:py-3 px-2.5 sm:px-4 text-[10px] sm:text-xs",
        cell: ({ row: item }) => (
          <div className="flex items-center gap-2 sm:gap-3.5 min-w-0">
            <MenuItemThumbnail image={item.image} name={item.name} />

            {/* Name & Badges */}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <p className="font-bold text-xs sm:text-sm text-neutral-900 leading-snug truncate">{item.name}</p>
                {item.isFeatured && (
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-50 px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold text-amber-700 border border-amber-200">
                    <Sparkles className="size-2 sm:size-2.5 text-amber-500" />
                    Featured
                  </span>
                )}
              </div>
              <p className="text-[10px] sm:text-[11px] text-neutral-400 font-mono truncate">
                ID: {item.id.length > 12 ? `${item.id.slice(0, 12)}...` : item.id}
              </p>
            </div>
          </div>
        ),
      },
      {
        key: "category",
        header: "Category",
        className: "py-2.5 sm:py-3.5 px-2 sm:px-4 whitespace-nowrap",
        headerClassName: "py-2.5 sm:py-3 px-2 sm:px-4 text-[10px] sm:text-xs",
        cell: ({ row: item }) => (
          <span className="text-xs font-medium text-neutral-700">
            {item.categoryName || "Unassigned"}
          </span>
        ),
      },
      {
        key: "price",
        sortKey: "price",
        header: "Price",
        sortable: Boolean(onSort),
        className: "py-2.5 sm:py-3.5 px-2 sm:px-4 whitespace-nowrap",
        headerClassName: "py-2.5 sm:py-3 px-2 sm:px-4 text-[10px] sm:text-xs",
        cell: ({ row: item }) => (
          <span className="text-xs sm:text-sm font-bold text-neutral-900">
            ₹{typeof item.price === "number" ? item.price.toFixed(2) : item.price}
          </span>
        ),
      },
      {
        key: "dietary",
        header: "Dietary",
        className: "py-2.5 sm:py-3.5 px-2 sm:px-4 whitespace-nowrap",
        headerClassName: "py-2.5 sm:py-3 px-2 sm:px-4 text-[10px] sm:text-xs",
        cell: ({ row: item }) =>
          item.isVegetarian ? (
            <span className="inline-flex items-center gap-1 sm:gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-[11px] font-semibold text-emerald-700 border border-emerald-200">
              <span className="size-1.5 sm:size-2 rounded-full bg-emerald-500" />
              Veg
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 sm:gap-1.5 rounded-full bg-rose-50 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-[11px] font-semibold text-rose-700 border border-rose-200">
              <span className="size-1.5 sm:size-2 rounded-full bg-rose-500" />
              Non-Veg
            </span>
          ),
      },
      {
        key: "isAvailable",
        header: "Availability",
        className: "py-2.5 sm:py-3.5 px-2 sm:px-4 whitespace-nowrap",
        headerClassName: "py-2.5 sm:py-3 px-2 sm:px-4 text-[10px] sm:text-xs",
        cell: ({ row: item }) =>
          item.isAvailable ? (
            <span className="inline-flex items-center gap-1 sm:gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-[11px] font-semibold text-emerald-700 border border-emerald-200">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              In Stock
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 sm:gap-1.5 rounded-full bg-neutral-100 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-[11px] font-semibold text-neutral-600 border border-neutral-200">
              <span className="size-1.5 rounded-full bg-neutral-400" />
              Out of Stock
            </span>
          ),
      },
      {
        key: "actions",
        header: "Actions",
        align: "right",
        className: "py-2 sm:py-3.5 px-1.5 sm:px-4 text-right whitespace-nowrap",
        headerClassName: "py-2 sm:py-3 px-1.5 sm:px-4 text-right text-[10px] sm:text-xs",
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
    <div className="space-y-4 min-w-0" data-testid="menu-item-table-container">
      {/* ── Desktop & Tablet View (>= sm) ── */}
      <div className="hidden sm:block">
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
          containerClassName="overflow-x-auto min-w-0"
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

      {/* ── Mobile View (< sm) ── */}
      <div className="sm:hidden p-3 space-y-2.5 bg-[#faf7f5]/30">
        {isLoading ? (
          /* Mobile Loading Skeleton Cards */
          <div className="space-y-2.5">
            {[1, 2, 3].map((skeletonId) => (
              <div
                key={skeletonId}
                className="rounded-2xl border border-[#eddcd4] bg-white p-3.5 shadow-2xs space-y-3"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="size-10 rounded-xl bg-neutral-200 shrink-0" />
                  <div className="flex-1 space-y-1.5 min-w-0">
                    <Skeleton className="h-4 w-32 rounded-md bg-neutral-200" />
                    <Skeleton className="h-3 w-20 rounded-md bg-neutral-100" />
                  </div>
                  <Skeleton className="h-5 w-14 rounded-md bg-neutral-200" />
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[#f3e6de]">
                  <Skeleton className="h-5 w-24 rounded-full bg-neutral-100" />
                  <Skeleton className="h-7 w-20 rounded-xl bg-neutral-100" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          /* Mobile Empty State */
          <div className="rounded-2xl border border-[#eddcd4] bg-white p-6 text-center space-y-3 shadow-2xs">
            <div className="size-10 rounded-full bg-[#fef3ec] text-[#e8631b] flex items-center justify-center mx-auto border border-[#fae2d3]">
              <Utensils className="size-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-neutral-900">No menu items found</h3>
              <p className="text-xs text-neutral-500">
                No dishes or beverages match the selected filter criteria.
              </p>
            </div>
            {onResetFilters && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onResetFilters}
                className="rounded-xl border-[#eddcd4] text-xs font-semibold"
              >
                Reset Filters
              </Button>
            )}
          </div>
        ) : (
          /* Mobile Menu Item Cards List */
          <div className="space-y-2.5" data-testid="menu-item-mobile-list">
            {items.map((item) => (
              <div
                key={item.id}
                data-testid={`menu-item-card-${item.id}`}
                className="rounded-2xl border border-[#eddcd4] bg-white p-3.5 shadow-2xs space-y-2.5 transition-all hover:border-[#e8631b]/40"
              >
                {/* Top Row: Thumbnail + Item Details + Price */}
                <div className="flex items-start gap-3 min-w-0">
                  <MenuItemThumbnail image={item.image} name={item.name} />

                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="text-sm font-bold text-neutral-900 leading-snug truncate">
                        {item.name}
                      </h4>
                      {item.isFeatured && (
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-50 px-1.5 py-0.5 text-[9px] font-bold text-amber-700 border border-amber-200">
                          <Sparkles className="size-2.5 text-amber-500" />
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-500 font-medium truncate">
                      {item.categoryName || "Unassigned"}
                    </p>
                    <p className="text-[10px] text-neutral-400 font-mono truncate">
                      ID: {item.id.length > 12 ? `${item.id.slice(0, 12)}...` : item.id}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-sm font-black text-neutral-900">
                      ₹{typeof item.price === "number" ? item.price.toFixed(2) : item.price}
                    </span>
                  </div>
                </div>

                {/* Bottom Row: Badges + Action Buttons */}
                <div className="flex items-center justify-between pt-2.5 border-t border-[#f3e6de] gap-2">
                  {/* Badges */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {item.isVegetarian ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
                        <span className="size-1.5 rounded-full bg-emerald-500" />
                        Veg
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-700 border border-rose-200">
                        <span className="size-1.5 rounded-full bg-rose-500" />
                        Non-Veg
                      </span>
                    )}

                    {item.isAvailable ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
                        <span className="size-1.5 rounded-full bg-emerald-500" />
                        In Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold text-neutral-600 border border-neutral-200">
                        <span className="size-1.5 rounded-full bg-neutral-400" />
                        Out of Stock
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <Link
                      to={RESTAURANT_ROUTES.MENU.DETAIL(item.id)}
                      className="rounded-lg p-1.5 text-neutral-400 hover:text-[#e8631b] hover:bg-[#fef3ec] transition-colors"
                      aria-label={`View details for ${item.name}`}
                      title="View menu item"
                    >
                      <Eye className="size-4" />
                    </Link>

                    {onEdit ? (
                      <button
                        type="button"
                        onClick={() => onEdit(item)}
                        className="rounded-lg p-1.5 text-neutral-400 hover:text-[#e8631b] hover:bg-[#fef3ec] transition-colors cursor-pointer"
                        aria-label={`Edit ${item.name}`}
                        title="Edit menu item"
                      >
                        <Pencil className="size-4" />
                      </button>
                    ) : (
                      <Link
                        to={RESTAURANT_ROUTES.MENU.EDIT(item.id)}
                        className="rounded-lg p-1.5 text-neutral-400 hover:text-[#e8631b] hover:bg-[#fef3ec] transition-colors"
                        aria-label={`Edit ${item.name}`}
                        title="Edit menu item"
                      >
                        <Pencil className="size-4" />
                      </Link>
                    )}

                    {onDelete && (
                      <button
                        type="button"
                        onClick={() => onDelete(item)}
                        className="rounded-lg p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        aria-label={`Delete ${item.name}`}
                        title="Delete menu item"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Mobile Pagination */}
            {pagination && onPageChange && pagination.totalPages > 1 && (
              <div className="pt-2">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  totalItems={pagination.total}
                  pageSize={pagination.limit}
                  onPageChange={onPageChange}
                  theme="admin"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MenuItemTable;
