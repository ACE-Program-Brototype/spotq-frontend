import { AlertCircle, LogIn, LogOut, RotateCcw, Sparkles, User } from "lucide-react";
import { Link } from "react-router-dom";

import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Pagination } from "@/components/common/Pagination";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { getUserDisplayName, getUserInitials } from "@/features/auth/utils/user.utils";
import { CustomerRestaurantEmptyState } from "../components/Customer/CustomerRestaurantEmptyState";
import { CustomerRestaurantFilters } from "../components/Customer/CustomerRestaurantFilters";
import { RestaurantCard } from "../components/Customer/RestaurantCard";
import { RestaurantCardSkeleton } from "../components/Customer/RestaurantCardSkeleton";
import { RestaurantCategoryFilter } from "../components/Customer/RestaurantCategoryFilter";
import {
  CUSTOMER_RESTAURANT_DEFAULTS,
  RESTAURANT_SKELETON_KEYS,
} from "../constants/customer-restaurant.constants";
import { useCustomerRestaurants } from "../hooks/useCustomerRestaurants";

export function HomePage() {
  const { user } = useAuthStore();
  const { handleLogout, isLoading: isLoggingOut } = useLogout();

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

  // Authenticated user presentation helpers
  const displayName = getUserDisplayName(user);
  const initials = getUserInitials(user);

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8" data-testid="customer-home-page">
      {/* ── 1. Top User / Session Banner ── */}
      <div className="flex items-center justify-between gap-3 rounded-xl sm:rounded-2xl border border-neutral-200/80 bg-neutral-50/80 p-2.5 sm:p-4 shadow-2xs">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <Avatar className="size-8.5 sm:size-10 bg-[#ff6b00] text-white font-bold border border-neutral-200 shrink-0">
            <AvatarFallback className="bg-[#ff6b00] text-white text-xs font-bold">
              {user ? initials : <User className="size-4" />}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-xs sm:text-sm font-bold text-neutral-900 truncate">
                {user ? displayName || "Customer" : "Guest Visitor"}
              </span>
              <span className="rounded-md bg-neutral-200/80 px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold text-neutral-700 uppercase tracking-wider shrink-0">
                {user?.role ?? "GUEST"}
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-neutral-500 truncate">
              {user?.email ?? "Sign in to save favorites and track your waitlists"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {user ? (
            <ConfirmDialog
              trigger={
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={isLoggingOut}
                  className="h-7.5 sm:h-8.5 px-2.5 sm:px-3 gap-1 sm:gap-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold shadow-xs cursor-pointer"
                >
                  <LogOut className="size-3 sm:size-3.5" />
                  <span>{isLoggingOut ? "..." : "Logout"}</span>
                </Button>
              }
              title="Sign Out"
              description={`Are you sure you want to end your session, ${displayName || "Customer"}?`}
              confirmText="Sign Out"
              confirmVariant="destructive"
              isLoading={isLoggingOut}
              onConfirm={handleLogout}
            />
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-1 h-7.5 sm:h-8.5 px-2.5 sm:px-3 rounded-lg sm:rounded-xl bg-[#ff6b00] hover:bg-[#e05e00] text-white text-[11px] sm:text-xs font-bold shadow-xs transition-colors shrink-0"
            >
              <LogIn className="size-3 sm:size-3.5" />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </div>

      {/* ── 2. Hero & Category Filter Bar ── */}
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
