/**
 * Staff Menu Items Page
 * Dedicated operational menu catalog for restaurant staff.
 * Provides real-time 86'd stock monitoring, category mapping, multi-attribute search, and sorting.
 */

import { AlertCircle, ChefHat, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StaffMenuItemFilters } from "../components/StaffMenuItemFilters";
import { StaffMenuItemSkeleton } from "../components/StaffMenuItemSkeleton";
import { StaffMenuItemTable } from "../components/StaffMenuItemTable";
import { StaffMenuStatsCards } from "../components/StaffMenuStatsCards";
import { MENU_MESSAGES } from "../constants/menu.constants";
import { useMenuCategories } from "../hooks/use-menu-categories";
import { useStaffMenuItems } from "../hooks/use-staff-menu-items";

export default function StaffMenuItemsPage() {
  const { categories } = useMenuCategories();
  const {
    items,
    totalCount,
    totalPages,
    availableCount,
    outOfStockCount,
    isLoading,
    isError,
    error,
    refetch,
    page,
    limit,
    searchQuery,
    categoryFilter,
    availabilityFilter,
    sortBy,
    sortOrder,
    setPage,
    setLimit,
    setSearchQuery,
    setCategoryFilter,
    setAvailabilityFilter,
    toggleSort,
    resetFilters,
  } = useStaffMenuItems();

  const isFiltered = Boolean(
    searchQuery.trim() || categoryFilter !== "ALL" || availabilityFilter !== "ALL",
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-1 sm:px-2">
      {/* Top Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#9a3412]">
              Menu Management
            </span>
          </div>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">Menu Items</h1>
            <span className="rounded-full bg-[#fef3ec] px-2.5 py-0.5 text-xs font-bold text-[#9a3412] border border-[#fae2d3]">
              {totalCount} Total Items
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-neutral-500">
            {MENU_MESSAGES.STAFF_MENU_SUBTITLE}
          </p>
        </div>
      </div>

      {/* Error Alert with Retry Action */}
      {isError && (
        <div
          data-testid="staff-menu-error-alert"
          className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="size-5 shrink-0" />
            <span>
              {error instanceof Error ? error.message : MENU_MESSAGES.STAFF_ITEMS_FETCH_ERROR}
            </span>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="border-rose-300 text-rose-800 hover:bg-rose-100 rounded-xl text-xs font-semibold"
          >
            Try Again
          </Button>
        </div>
      )}

      {/* KPI Metrics Banner */}
      <StaffMenuStatsCards
        totalItems={totalCount}
        availableItems={availableCount}
        outOfStockItems={outOfStockCount}
      />

      {/* Toolbar Filters */}
      <StaffMenuItemFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categories={categories}
        selectedCategoryId={categoryFilter}
        onCategoryChange={setCategoryFilter}
        availabilityFilter={availabilityFilter}
        onAvailabilityChange={setAvailabilityFilter}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={toggleSort}
        onResetFilters={resetFilters}
        isFiltered={isFiltered}
        totalCount={totalCount}
      />

      {/* Main Content Area - Table Only */}
      {isLoading ? (
        <StaffMenuItemSkeleton viewMode="table" count={5} />
      ) : items.length === 0 ? (
        /* Empty State */
        <div
          data-testid="staff-menu-empty-state"
          className="rounded-2xl border border-dashed border-[#eddcd4] bg-white p-10 sm:p-14 text-center space-y-4"
        >
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#fef3ec] text-[#e8631b] border border-[#fae2d3]">
            <ChefHat className="size-7" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-base sm:text-lg font-bold text-neutral-900">
              {isFiltered ? "No matching menu items" : "No menu items yet"}
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500">
              {isFiltered
                ? MENU_MESSAGES.NO_STAFF_MENU_ITEMS_DESC
                : "No dishes are currently configured in this restaurant's catalog."}
            </p>
          </div>
          {isFiltered && (
            <div className="flex items-center justify-center gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={resetFilters}
                className="rounded-xl border-[#eddcd4] text-xs font-semibold"
              >
                <RotateCcw className="size-3.5 mr-1.5" />
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      ) : (
        /* Table View */
        <div className="rounded-2xl border border-[#eddcd4] bg-white overflow-hidden shadow-2xs">
          <StaffMenuItemTable
            items={items}
            isLoading={isLoading}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={toggleSort}
            page={page}
            limit={limit}
            totalCount={totalCount}
            totalPages={totalPages}
            onPageChange={setPage}
            onLimitChange={setLimit}
            onResetFilters={resetFilters}
          />
        </div>
      )}
    </div>
  );
}
