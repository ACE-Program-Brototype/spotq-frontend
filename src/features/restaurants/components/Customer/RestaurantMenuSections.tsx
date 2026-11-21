import { RestaurantMenuItemCard } from "@/features/restaurants/components/Customer/RestaurantMenuItemCard";
import type {
  CustomerRestaurantDetails,
  CustomerRestaurantMenuCategory,
} from "@/features/restaurants/types/customer-restaurant.types";

interface RestaurantMenuSectionsProps {
  categories: CustomerRestaurantMenuCategory[];
  restaurant: CustomerRestaurantDetails;
}

export function RestaurantMenuSections({ categories, restaurant }: RestaurantMenuSectionsProps) {
  if (!categories.length) {
    return (
      <section className="rounded-2xl border border-dashed border-stone-300 p-10 text-center text-stone-500">
        Menu coming soon
      </section>
    );
  }

  return (
    <>
      {categories.map((category) => (
        <section key={category.id} id={category.id} className="scroll-mt-24 min-w-0 max-w-full">
          <div className="mb-4 flex items-end justify-between gap-3 min-w-0">
            <div className="min-w-0 flex-1">
              <h2
                className="text-xl sm:text-2xl font-extrabold tracking-tight text-stone-900 break-words [overflow-wrap:anywhere] line-clamp-2 min-w-0"
                title={category.name}
              >
                {category.name}
              </h2>
              {category.description && (
                <p
                  className="mt-1 text-sm text-stone-500 break-words [overflow-wrap:anywhere] line-clamp-2 min-w-0"
                  title={category.description}
                >
                  {category.description}
                </p>
              )}
            </div>
            <span className="text-xs text-stone-400 shrink-0">{category.items.length} items</span>
          </div>
          <div className="space-y-4 min-w-0">
            {category.items.map((item) => (
              <RestaurantMenuItemCard key={item.id} item={item} restaurant={restaurant} />
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
