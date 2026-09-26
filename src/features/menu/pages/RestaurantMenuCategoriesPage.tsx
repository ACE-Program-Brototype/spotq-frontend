/**
 * Restaurant Menu Categories Page
 * Displays existing menu category cards with an Edit action to open the Edit Category Form.
 */

import { AlertCircle, Layers, RefreshCw } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CategoryCard } from "../components/CategoryCard";
import { CategoryListSkeleton } from "../components/CategoryListSkeleton";
import { EditCategoryModal } from "../components/EditCategoryModal";
import { useMenuCategories } from "../hooks/use-menu-categories";
import type { MenuCategory } from "../types/menu-category.types";

export default function RestaurantMenuCategoriesPage() {
  const { categories, restaurantId, isLoading, isError, refetch } = useMenuCategories();

  // Edit Modal State
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditClick = (category: MenuCategory) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedCategory(null);
  };

  return (
    <div className="flex-1 space-y-6 p-6 sm:p-8 bg-[#faf7f5]/40 min-h-full">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#f3e6de] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Menu Categories</h1>
            <span className="rounded-full bg-[#fef3ec] px-2.5 py-0.5 text-xs font-semibold text-[#9a3412] border border-[#fae2d3]">
              {categories.length} total
            </span>
          </div>
          <p className="text-sm text-neutral-500 mt-1">
            Manage your restaurant menu categories, ordering, and availability.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading}
            className="rounded-xl border-[#eddcd4] bg-white text-neutral-700 hover:bg-[#faf7f5] text-xs font-medium"
          >
            <RefreshCw className={`size-3.5 mr-1.5 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <CategoryListSkeleton />
      ) : isError ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-8 text-center space-y-3">
          <AlertCircle className="size-8 text-rose-500 mx-auto" />
          <h3 className="text-base font-bold text-neutral-900">Failed to load categories</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            We encountered a problem loading your menu categories. Please check your connection and
            try again.
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={() => refetch()}
            className="rounded-xl border-rose-300 text-rose-700 hover:bg-rose-100/50 text-xs"
          >
            Try Again
          </Button>
        </div>
      ) : categories.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#eddcd4] bg-white p-12 text-center space-y-3">
          <div className="size-12 rounded-2xl bg-[#fef3ec] text-[#e8631b] flex items-center justify-center mx-auto border border-[#fae2d3]">
            <Layers className="size-6" />
          </div>
          <h3 className="text-base font-bold text-neutral-900">No categories found</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            No menu categories are currently available for this restaurant.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} onEdit={handleEditClick} />
          ))}
        </div>
      )}

      {/* Edit Category Modal */}
      <EditCategoryModal
        isOpen={isEditModalOpen}
        category={selectedCategory}
        restaurantId={restaurantId}
        onClose={handleCloseModal}
      />
    </div>
  );
}
