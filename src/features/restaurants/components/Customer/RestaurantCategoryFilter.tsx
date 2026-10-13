import { CUSTOMER_CUISINE_CATEGORIES } from "../../constants/customer-restaurant.constants";
import { cn } from "@/lib/utils/cn";

export interface RestaurantCategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export function RestaurantCategoryFilter({
  selectedCategory,
  onSelectCategory,
}: RestaurantCategoryFilterProps) {
  return (
    <div
      data-testid="restaurant-category-filter"
      className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none"
    >
      {CUSTOMER_CUISINE_CATEGORIES.map((category) => {
        const isSelected = selectedCategory === category;
        return (
          <button
            key={category}
            type="button"
            onClick={() => onSelectCategory(category)}
            className={cn(
              "rounded-full px-4 py-1.5 text-xs font-semibold whitespace-nowrap transition-all border shadow-2xs cursor-pointer",
              isSelected
                ? "bg-[#ff6b00] text-white border-[#ff6b00] shadow-xs"
                : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300",
            )}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
