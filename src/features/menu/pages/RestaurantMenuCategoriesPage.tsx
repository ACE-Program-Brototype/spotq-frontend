/**
 * Restaurant Menu Categories Page
 * Displays existing menu category cards with an Edit action to open the Edit Category Form.
 */

import { Layers, Plus, RefreshCw } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button.variants";
import { cn } from "@/lib/utils/cn";
import { CategoryCard } from "@/features/menu/components/CategoryCard";
import { CategoryListSkeleton } from "@/features/menu/components/CategoryListSkeleton";
import { CreateCategoryModal } from "@/features/menu/components/CreateCategoryModal";
import { EditCategoryModal } from "@/features/menu/components/EditCategoryModal";
import { EmptyState, ErrorState } from "@/features/menu/components/MenuPageStateUI";
import { useMenuCategories } from "@/features/menu/hooks/use-menu-categories";
import type { MenuCategory } from "@/features/menu/types/menu-category.types";

export default function RestaurantMenuCategoriesPage() {
  const { categories, restaurantId, isLoading, isError, refetch } = useMenuCategories();

  // Modal State
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleEditClick = (category: MenuCategory) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedCategory(null);
  };

  const renderContent = () => {
    if (isLoading) return <CategoryListSkeleton />;

    if (isError) {
      return (
        <ErrorState
          title="Failed to load categories"
          description="We encountered a problem loading your categories. Please check your connection and try again."
          onRetry={refetch}
        />
      );
    }

    if (categories.length === 0) {
      return (
        <EmptyState
          icon={<Layers className="size-6 text-[#e8631b]" />}
          title="No categories found"
          description="No menu categories are currently available for this restaurant."
          createLabel="Create Category"
          onCreateClick={() => setIsCreateModalOpen(true)}
        />
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 min-w-0">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} onEdit={handleEditClick} />
        ))}
      </div>
    );
  };

  return (
    <div className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8 bg-[#faf7f5]/40 min-h-full min-w-0 max-w-full overflow-x-hidden">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#f3e6de] pb-6 min-w-0">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Menu Categories</h1>
            <span className="rounded-full bg-[#fef3ec] px-2.5 py-0.5 text-xs font-semibold text-[#9a3412] border border-[#fae2d3]">
              {categories.length} total
            </span>
          </div>
          <p className="text-sm text-neutral-500 mt-1">
            Manage your restaurant menu categories, ordering, and availability.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
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

          <Button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className={cn(
              buttonVariants({ size: "sm" }),
              "rounded-xl bg-[#e8631b] hover:bg-[#d45614] text-white shadow-xs gap-1.5 font-semibold text-xs",
            )}
          >
            <Plus className="size-4" />
            <span>Create Category</span>
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      {renderContent()}

      {/* Edit Category Modal */}
      <EditCategoryModal
        isOpen={isEditModalOpen}
        category={selectedCategory}
        restaurantId={restaurantId}
        onClose={handleCloseModal}
      />

      {/* Create Category Modal */}
      <CreateCategoryModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        restaurantId={restaurantId}
      />
    </div>
  );
}
