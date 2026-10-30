import { ShoppingBag, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import type {
  CustomerRestaurantDetails,
  CustomerRestaurantMenuCategory,
} from "../../types/customer-restaurant.types";

interface RestaurantMenuNavigationProps {
  categories: CustomerRestaurantMenuCategory[];
  restaurant: CustomerRestaurantDetails;
  activeId: string;
  onActiveChange: (id: string) => void;
}

export function RestaurantMenuNavigation({
  categories,
  restaurant,
  activeId,
  onActiveChange,
}: RestaurantMenuNavigationProps) {
  const showQueueButton = restaurant.type === "QUEUE_PRO";
  const queueButtonLabel = restaurant.queue?.hasJoinedThisRestaurantQueue
    ? "Joined this queue"
    : restaurant.queue?.hasJoinedAnyQueue
      ? "Can't join queue"
      : "Join Queue";
  const scrollTo = (id: string) => {
    onActiveChange(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <aside className="h-fit space-y-3 lg:sticky lg:top-24">
      <div className="rounded-2xl border border-stone-200 bg-white p-3 shadow-sm">
        <p className="px-3 pb-1 pt-2 text-sm font-bold text-stone-900">Explore menu</p>
        <p className="px-3 pb-3 text-xs text-stone-400">
          {categories.length} {categories.length === 1 ? "category" : "categories"}
        </p>
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => scrollTo(category.id)}
            className={`mb-1 w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition ${activeId === category.id ? "bg-[#ff6b00] text-white" : "text-stone-600 hover:bg-orange-50 hover:text-[#f26500]"}`}
          >
            {category.name}
          </button>
        ))}
        <button
          type="button"
          onClick={() => scrollTo("overview")}
          className={`w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold ${activeId === "overview" ? "bg-orange-50 text-[#f26500]" : "text-stone-600 hover:bg-stone-50"}`}
        >
          Overview &amp; hours
        </button>
      </div>
      {showQueueButton && (
        <Button
          disabled={!restaurant.settings?.acceptsQueue || restaurant.queue?.hasJoinedAnyQueue}
          className="w-full rounded-xl bg-blue-600 font-bold text-white hover:bg-blue-700 disabled:bg-stone-300"
        >
          <Users className="mr-2 size-4" />
          {queueButtonLabel}
        </Button>
      )}
      <div className="rounded-2xl bg-orange-50 p-4 text-sm text-stone-700">
        <ShoppingBag className="mb-2 size-5 text-[#f26500]" />
        <p className="font-bold">Order your favorites</p>
        <p className="mt-1 text-xs leading-5 text-stone-500">
          Add a dish to start building your order.
        </p>
      </div>
    </aside>
  );
}
