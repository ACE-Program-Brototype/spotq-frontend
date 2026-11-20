import { AlertCircle, RotateCcw, Sparkles } from "lucide-react";

import { Pagination } from "@/components/common/Pagination";
import { Button } from "@/components/ui/button";
import { CustomerRestaurantEmptyState } from "@/features/restaurants/components/Customer/CustomerRestaurantEmptyState";
import { CustomerRestaurantFilters } from "@/features/restaurants/components/Customer/CustomerRestaurantFilters";
import { RestaurantCard } from "@/features/restaurants/components/Customer/RestaurantCard";
import { RestaurantCardSkeleton } from "@/features/restaurants/components/Customer/RestaurantCardSkeleton";
import { RestaurantCategoryFilter } from "@/features/restaurants/components/Customer/RestaurantCategoryFilter";
import {
  CUSTOMER_RESTAURANT_DEFAULTS,
  RESTAURANT_SKELETON_KEYS,
} from "@/features/restaurants/constants/customer-restaurant.constants";
import { useCustomerRestaurants } from "@/features/restaurants/hooks/useCustomerRestaurants";

export function HomePage() {
  const {
    restaurants,
    totalItems,
    totalPages,
    isLoading,
    isError,
    error,
    refetch,
    page,
    searchQuery,
    cityQuery,
    selectedCategory,
    selectedSort,
    isFiltered,
    handleSearchChange,
    handleCityChange,
    handleCategoryChange,
    handleSortChange,
    handlePageChange,
    resetFilters,
  } = useCustomerRestaurants();

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8" data-testid="customer-home-page">
      {/* ── 1. Hero & Category Filter Bar ── */}
      <div className="space-y-2.5 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-1 sm:gap-2">
          <div>
            <div className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-[#ff6b00] mb-0.5 sm:mb-1">
              <Sparkles className="size-3 sm:size-3.5" />
              <span>SpotQ Discovery</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-neutral-900 leading-tight">
              Find your next favorite restaurant
            </h1>
          </div>
          <p className="text-[11px] sm:text-sm text-neutral-500">
            Skip physical lines and track live queue status in real time
          </p>
        </div>

        {/* Cuisine Filter Pills */}
        <RestaurantCategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategoryChange}
        />
      </div>

      {/* ── 3. Search & Sort Toolbar ── */}
      <CustomerRestaurantFilters
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        cityQuery={cityQuery}
        onCityChange={handleCityChange}
        selectedSort={selectedSort}
        onSortChange={handleSortChange}
        isFiltered={isFiltered}
        onResetFilters={resetFilters}
      />

      {/* ── 4. Main Restaurant Grid & States ── */}
      {isLoading ? (
        <div
          data-testid="restaurant-grid-loading"
          className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {RESTAURANT_SKELETON_KEYS.map((key) => (
            <RestaurantCardSkeleton key={key} />
          ))}
        </div>
      ) : isError ? (
        <div
          role="alert"
          className="flex flex-col items-center justify-center py-12 sm:py-16 px-4 text-center rounded-2xl border border-rose-200 bg-rose-50/40"
        >
          <div className="flex size-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 mb-3 shadow-2xs">
            <AlertCircle className="size-6" />
          </div>
          <h3 className="text-base font-bold text-neutral-900">Failed to load restaurants</h3>
          <p className="mt-1 max-w-sm text-xs text-neutral-600">
            {(error as Error)?.message ||
              "An unexpected error occurred while fetching restaurants. Please try again."}
          </p>
          <Button
            size="sm"
            onClick={() => refetch()}
            className="mt-4 gap-1.5 rounded-xl bg-[#ff6b00] hover:bg-[#e05e00] text-white text-xs font-bold cursor-pointer"
          >
            <RotateCcw className="size-3.5" />
            <span>Try Again</span>
          </Button>
        </div>
      ) : !Array.isArray(restaurants) || restaurants.length === 0 ? (
        <CustomerRestaurantEmptyState isFiltered={isFiltered} onResetFilters={resetFilters} />
      ) : (
        <div
          data-testid="restaurant-grid"
          className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {restaurants.map((res) => (
            <RestaurantCard key={res.id} restaurant={res} />
          ))}
        </div>
      )}

      {/* ── 5. Pagination Bar ── */}
      {!isLoading && !isError && Array.isArray(restaurants) && restaurants.length > 0 && (
        <div
          data-testid="restaurant-pagination"
          className="mt-8 rounded-2xl border border-neutral-200/80 bg-white p-2 sm:p-3 shadow-2xs"
        >
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={CUSTOMER_RESTAURANT_DEFAULTS.LIMIT}
            onPageChange={handlePageChange}
            theme="customer"
            showFirstLast={true}
            className="w-full"
          />
        </div>
      )}
    </div>
  );
}

export default HomePage;
