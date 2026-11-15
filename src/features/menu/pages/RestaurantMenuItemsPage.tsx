import { AlertCircle, Plus } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { RESTAURANT_ROUTES } from "@/app/router/routes.constants";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { MenuItemFilters } from "@/features/menu/components/MenuItemFilters";
import { MenuItemStatsCards } from "@/features/menu/components/MenuItemStatsCards";
import { MenuItemTable } from "@/features/menu/components/MenuItemTable";
import { MENU_MESSAGES } from "@/features/menu/constants/menu.constants";
import { useDeleteMenuItem } from "@/features/menu/hooks/use-delete-menu-item";
import { useMenuCategories } from "@/features/menu/hooks/use-menu-categories";
import { useMenuItems } from "@/features/menu/hooks/use-menu-items";
import type { MenuItemSummary } from "@/features/menu/types/menu-item.types";

export default function RestaurantMenuItemsPage() {
  const { categories } = useMenuCategories();
  const {
    items,
    stats,
    pagination,
    restaurantId,
    isLoading,
    isError,
    error,
    refetch,
    searchQuery,
    categoryFilter,
    statusFilter,
    vegFilter,
    sortBy,
    sortOrder,
    setSort,
    setPage,
    setLimit,
    setSearchQuery,
    setCategoryFilter,
    setStatusFilter,
    setVegFilter,
    toggleSort,
    resetFilters,
  } = useMenuItems();

  const [itemToDelete, setItemToDelete] = useState<MenuItemSummary | null>(null);

  const deleteMutation = useDeleteMenuItem({
    restaurantId,
    onSuccess: () => {
      setItemToDelete(null);
    },
  });

  const handleConfirmDelete = () => {
    if (!itemToDelete || deleteMutation.isPending) return;
    deleteMutation.mutate(itemToDelete.id);
  };

  const isFiltered = Boolean(
    searchQuery.trim() || categoryFilter !== "ALL" || statusFilter !== "ALL" || vegFilter !== "ALL",
  );

  return (
    <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.15em] text-[#9a3412]">
              Menu Management
            </span>
          </div>
          <div className="flex items-center gap-2.5 sm:gap-3 mt-0.5 sm:mt-1">
            <h1 className="text-xl sm:text-3xl font-bold text-neutral-900">Menu Items</h1>
            <span className="rounded-full bg-[#fef3ec] px-2 py-0.5 text-[11px] sm:text-xs font-semibold text-[#9a3412] border border-[#fae2d3]">
              {stats.totalMenuItems} total
            </span>
          </div>
          <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-neutral-500">
            View, filter, and manage your dishes, beverages, pricing, and availability.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to={RESTAURANT_ROUTES.MENU.CREATE}
            className={cn(
              buttonVariants({ size: "sm" }),
              "rounded-xl bg-[#e8631b] hover:bg-[#d45614] text-white shadow-xs gap-1.5 font-semibold text-xs h-9 sm:h-10 px-3 sm:px-4",
            )}
          >
            <Plus className="size-4" />
            <span>Add Menu Item</span>
          </Link>
        </div>
      </div>

      {/* Error Alert */}
      {isError && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="size-5 shrink-0" />
            <span>{error instanceof Error ? error.message : MENU_MESSAGES.ITEMS_FETCH_ERROR}</span>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="border-rose-300 text-rose-800 hover:bg-rose-100 rounded-xl text-xs"
          >
            Retry
          </Button>
        </div>
      )}

      {/* Summary KPI Cards */}
      <MenuItemStatsCards stats={stats} />

      {/* Main Items Table Container */}
      <div className="rounded-2xl border border-[#eddcd4] bg-white shadow-2xs overflow-hidden">
        {/* Table Filter Toolbar */}
        <MenuItemFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          categories={categories}
          selectedCategoryId={categoryFilter}
          onCategoryChange={setCategoryFilter}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          vegFilter={vegFilter}
          onVegFilterChange={setVegFilter}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={setSort}
          onResetFilters={resetFilters}
          isFiltered={isFiltered}
        />

        {/* Menu Items Data Table (Using Reusable DataTable Component) */}
        <MenuItemTable
          items={items}
          isLoading={isLoading}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={toggleSort}
          pagination={pagination}
          onPageChange={setPage}
          onLimitChange={setLimit}
          onResetFilters={resetFilters}
          onDelete={setItemToDelete}
        />
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        open={Boolean(itemToDelete)}
        onOpenChange={(open) => {
          if (!open && !deleteMutation.isPending) {
            setItemToDelete(null);
          }
        }}
        title={MENU_MESSAGES.DELETE_ITEM_CONFIRM_TITLE}
        description={MENU_MESSAGES.DELETE_ITEM_CONFIRM_DESCRIPTION(itemToDelete?.name)}
        confirmText={MENU_MESSAGES.BTN_DELETE}
        cancelText={MENU_MESSAGES.BTN_CANCEL}
        confirmVariant="destructive"
        isLoading={deleteMutation.isPending}
        loadingText={MENU_MESSAGES.BTN_DELETING}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          if (!deleteMutation.isPending) {
            setItemToDelete(null);
          }
        }}
      />
    </div>
  );
}
