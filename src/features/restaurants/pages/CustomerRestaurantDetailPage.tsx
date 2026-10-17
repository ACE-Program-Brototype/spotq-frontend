import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { RestaurantDetailErrorState } from "../components/Customer/details/RestaurantDetailErrorState";
import { RestaurantDetailSkeleton } from "../components/Customer/details/RestaurantDetailSkeleton";
import { RestaurantHeroHeader } from "../components/Customer/details/RestaurantHeroHeader";
import { MenuItemCard } from "../components/Customer/details/MenuItemCard";
import {
  type CustomizationResult,
  MenuItemCustomizationModal,
} from "../components/Customer/details/MenuItemCustomizationModal";
import type { CustomerRestaurantMenuItem } from "../types/customer-restaurant-details.types";
import { useCustomerRestaurantDetails } from "../hooks/useCustomerRestaurantDetails";

export default function CustomerRestaurantDetailPage() {
  const { restaurantId } = useParams<{ restaurantId: string }>();

  // TanStack Query hook 
  const { restaurant, isLoading, isError, refetch } = useCustomerRestaurantDetails(restaurantId);

  // Active Category & Item Customization State
  const [activeCategoryId, setActiveCategoryId] = useState<string>("main-course");
  const [customizingItem, setCustomizingItem] = useState<CustomerRestaurantMenuItem | null>(null);

  // Sync active category when restaurant menu loads
  useEffect(() => {
    if (restaurant?.menu && restaurant.menu.length > 0) {
      const firstWithItems =
        restaurant.menu.find((m) => m.items && m.items.length > 0) || restaurant.menu[0];
      if (firstWithItems) {
        setActiveCategoryId(firstWithItems.id);
      }
    }
  }, [restaurant]);

  // 1. Loading Skeleton State
  if (isLoading) {
    return <RestaurantDetailSkeleton />;
  }

  // 2. Error / Not Found State
  if (isError || !restaurant) {
    return (
      <RestaurantDetailErrorState
        message={
          !restaurantId
            ? "Invalid restaurant ID specified."
            : "We couldn't retrieve the details for this restaurant. Please check the URL or try again later."
        }
        onRetry={() => refetch()}
      />
    );
  }

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategoryId(categoryId);
    const element = document.getElementById(`category-${categoryId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleAddToCart = (result: CustomizationResult) => {
    toast.success(`Added ${result.item.name} to cart!`, {
      description: result.selectedVariant
        ? `${result.selectedVariant.name} • ₹${result.totalPrice.toFixed(2)}`
        : `₹${result.totalPrice.toFixed(2)}`,
    });
    console.log("Item added to cart:", result);
  };

  return (
    <div className="min-h-screen bg-neutral-50/50 pb-28">
      {/* 1. Hero Header Banner matching Figma */}
      <RestaurantHeroHeader
        restaurant={restaurant}
        onShare={() => {
          if (navigator.share) {
            navigator.share({
              title: restaurant.restaurantName,
              url: window.location.href,
            });
          }
        }}
      />

      {/* 2. Main Two-Column Layout matching Figma */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
          {/* Left Column: Categories Navigation Card + Join Queue */}
          <aside className="w-full lg:w-64 shrink-0 lg:sticky lg:top-24 space-y-4">
            {/* Menu Categories Card */}
            <div className="rounded-2xl border border-neutral-200/90 bg-white p-5 shadow-2xs">
              <h2 className="text-base font-bold text-[#ff6b00]">Menu Categories</h2>
              <p className="text-xs text-neutral-400 mb-4 font-medium">Quick navigation</p>

              {restaurant.menu.some((c) => c.items && c.items.length > 0) ? (
                <nav className="flex flex-col space-y-1">
                  {restaurant.menu
                    .filter((category) => category.items && category.items.length > 0)
                    .map((category) => {
                      const isActive = activeCategoryId === category.id;
                      return (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => handleCategoryClick(category.id)}
                          className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${isActive
                            ? "bg-[#ff6b00] text-white shadow-xs"
                            : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
                            }`}
                        >
                          {category.name}
                        </button>
                      );
                    })}
                </nav>
              ) : (
                <p className="text-xs text-neutral-400 italic">No categories available yet</p>
              )}
            </div>

            {/* Blue Join Queue Button matching Figma */}
            {restaurant.settings?.acceptsQueue && (
              <button
                type="button"
                onClick={() => {
                  console.log("Join live queue clicked for", restaurant.id);
                }}
                className="w-full h-12 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold text-sm shadow-sm transition-all active:scale-[0.99] flex items-center justify-center cursor-pointer"
              >
                Join Queue
              </button>
            )}
          </aside>

          {/* Right Column: Categorized Dishes matching Figma */}
          <main className="flex-1 min-w-0 space-y-10 w-full">
            {restaurant.menu.every((c) => !c.items || c.items.length === 0) ? (
              <div className="rounded-2xl border border-dashed border-neutral-200 bg-white p-12 text-center">
                <p className="text-base font-bold text-neutral-800">Menu Coming Soon</p>
                <p className="text-xs text-neutral-400 mt-1">
                  This restaurant is currently updating their digital menu offerings.
                </p>
              </div>
            ) : (
              restaurant.menu.map((category) => {
                if (!category.items || category.items.length === 0) return null;

                return (
                  <section
                    key={category.id}
                    id={`category-${category.id}`}
                    className="space-y-4 scroll-mt-28"
                  >
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
                      {category.name}
                    </h2>

                    <div className="space-y-4">
                      {category.items.map((item) => (
                        <MenuItemCard
                          key={item.id}
                          item={item}
                          onSelect={(selectedItem) => {
                            setCustomizingItem(selectedItem);
                          }}
                        />
                      ))}
                    </div>
                  </section>
                );
              })
            )}
          </main>
        </div>
      </div>

      {/* 3. Slide-over Right Customization Drawer matching Figma Image 2 */}
      <MenuItemCustomizationModal
        item={customizingItem}
        isOpen={Boolean(customizingItem)}
        onClose={() => setCustomizingItem(null)}
        onConfirm={handleAddToCart}
      />
    </div>
  );
}
