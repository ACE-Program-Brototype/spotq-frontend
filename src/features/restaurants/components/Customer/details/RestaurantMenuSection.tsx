import { Search, Utensils } from "lucide-react";
import { useMemo, useState } from "react";
import type {
  CustomerRestaurantMenuCategory,
  CustomerRestaurantMenuItem,
} from "@/features/restaurants/types/customer-restaurant-details.types";
import {
  type CustomizationResult,
  MenuItemCustomizationModal,
} from "./MenuItemCustomizationModal";
import { MenuItemCard } from "./MenuItemCard";

export interface RestaurantMenuSectionProps {
  categories: CustomerRestaurantMenuCategory[];
  onAddToCart?: (result: CustomizationResult) => void;
}

export function RestaurantMenuSection({
  categories,
  onAddToCart,
}: RestaurantMenuSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [vegOnly, setVegOnly] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState<string>(
    categories[0]?.id ?? "",
  );
  const [customizingItem, setCustomizingItem] = useState<CustomerRestaurantMenuItem | null>(
    null,
  );

  // Filtered categories and dishes
  const filteredCategories = useMemo(() => {
    return categories
      .map((category) => {
        const matchingItems = category.items.filter((item) => {
          const matchesSearch =
            !searchQuery.trim() ||
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.description &&
              item.description.toLowerCase().includes(searchQuery.toLowerCase()));

          const matchesVeg = !vegOnly || item.isVegetarian;

          return matchesSearch && matchesVeg;
        });

        return {
          ...category,
          items: matchingItems,
        };
      })
      .filter((cat) => cat.items.length > 0);
  }, [categories, searchQuery, vegOnly]);

  const handleSelectItem = (item: CustomerRestaurantMenuItem) => {
    // If the item has variants or addons, open modal for customization
    if ((item.variants && item.variants.length > 0) || (item.addons && item.addons.length > 0)) {
      setCustomizingItem(item);
    } else {
      // Direct add to cart
      onAddToCart?.({
        item,
        selectedVariant: null,
        selectedAddons: [],
        quantity: 1,
        totalPrice: item.price,
      });
    }
  };

  const scrollToCategory = (categoryId: string) => {
    setActiveCategoryId(categoryId);
    const element = document.getElementById(`category-${categoryId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (!categories || categories.length === 0) {
    return (
      <div className="py-16 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400 mb-3">
          <Utensils className="size-6" />
        </div>
        <h3 className="font-bold text-neutral-800 text-base">Menu is being updated</h3>
        <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
          This restaurant hasn't published its online menu yet. Please check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Search Bar & Veg-Only Filter Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dishes in menu..."
            className="h-10 w-full rounded-xl border border-neutral-200 bg-neutral-50/60 pl-10 pr-4 text-xs sm:text-sm text-neutral-800 placeholder:text-neutral-400 transition-all focus:border-[#ff6b00] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#ff6b00]/30"
          />
        </div>

        {/* Veg-only switch toggle */}
        <label className="flex items-center gap-2.5 rounded-xl border border-neutral-200 bg-white px-3.5 py-2 cursor-pointer select-none text-xs font-semibold text-neutral-700 shadow-2xs hover:bg-neutral-50">
          <div
            className={`flex size-4 items-center justify-center rounded-sm border ${
              vegOnly ? "border-emerald-600 bg-emerald-600" : "border-neutral-300 bg-white"
            }`}
          >
            {vegOnly && <div className="size-1.5 rounded-full bg-white" />}
          </div>
          <span>Veg Only</span>
          <input
            type="checkbox"
            checked={vegOnly}
            onChange={(e) => setVegOnly(e.target.checked)}
            className="sr-only"
          />
        </label>
      </div>

      {/* 2. Sticky Horizontal Category Navigation Pills */}
      <div className="sticky top-28 z-20 -mx-4 px-4 sm:mx-0 sm:px-0 py-2.5 bg-white/95 backdrop-blur-xs border-b border-neutral-100 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2">
          {categories.map((category) => {
            const isActive = activeCategoryId === category.id;
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => scrollToCategory(category.id)}
                className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                  isActive
                    ? "bg-neutral-900 text-white shadow-xs"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                {category.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Category Groups and Dish Lists */}
      {filteredCategories.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-sm font-semibold text-neutral-600">
            No dishes found matching your filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setVegOnly(false);
            }}
            className="mt-2 text-xs font-bold text-[#ff6b00] hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          {filteredCategories.map((category) => (
            <section
              key={category.id}
              id={`category-${category.id}`}
              className="scroll-mt-44 space-y-3"
            >
              {/* Category Header */}
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-neutral-900 tracking-tight">
                  {category.name}
                  <span className="ml-2 text-xs font-semibold text-neutral-400">
                    ({category.items.length})
                  </span>
                </h2>
                {category.description && (
                  <p className="text-xs text-neutral-500 mt-0.5">{category.description}</p>
                )}
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {category.items.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    onSelect={handleSelectItem}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* 4. Customization Modal Slot */}
      <MenuItemCustomizationModal
        item={customizingItem}
        isOpen={Boolean(customizingItem)}
        onClose={() => setCustomizingItem(null)}
        onConfirm={(result) => onAddToCart?.(result)}
      />
    </div>
  );
}
