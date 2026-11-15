import { CheckCircle2, ShoppingBag, Users } from "lucide-react";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  CUSTOMER_NAVIGATION_LABELS,
  CUSTOMER_QUEUE_BUTTON_LABELS,
  CUSTOMER_RESTAURANT_SECTIONS,
  RESTAURANT_PLAN_TYPES,
} from "@/features/restaurants/constants/customer-restaurant.constants";
import type {
  CustomerRestaurantDetails,
  CustomerRestaurantMenuCategory,
} from "@/features/restaurants/types/customer-restaurant.types";
import { cn } from "@/lib/utils/cn";

interface RestaurantMenuNavigationProps {
  categories: CustomerRestaurantMenuCategory[];
  restaurant: CustomerRestaurantDetails;
  activeId: string;
  onActiveChange: (id: string) => void;
  onJoinQueueClick?: () => void;
  isJoinedThisQueue?: boolean;
  isJoinedOtherQueue?: boolean;
}

export function RestaurantMenuNavigation({
  categories,
  restaurant,
  activeId,
  onActiveChange,
  onJoinQueueClick,
  isJoinedThisQueue: propIsJoinedThisQueue,
  isJoinedOtherQueue: propIsJoinedOtherQueue,
}: RestaurantMenuNavigationProps) {
  const planType = restaurant.subscriptionType ?? restaurant.type;
  const showQueueButton = planType === RESTAURANT_PLAN_TYPES.QUEUE_PRO;
  const isRestaurantOpen = (restaurant.isOpened ?? restaurant.settings?.isOpened) !== false;
  const isJoinedThisQueue =
    propIsJoinedThisQueue ?? Boolean(restaurant.queue?.hasJoinedThisRestaurantQueue);
  const isJoinedOtherQueue =
    propIsJoinedOtherQueue ?? (Boolean(restaurant.queue?.hasJoinedAnyQueue) && !isJoinedThisQueue);
  const queueButtonLabel = !isRestaurantOpen
    ? CUSTOMER_QUEUE_BUTTON_LABELS.RESTAURANT_CLOSED
    : isJoinedThisQueue
      ? CUSTOMER_QUEUE_BUTTON_LABELS.JOINED_THIS_QUEUE
      : isJoinedOtherQueue
        ? CUSTOMER_QUEUE_BUTTON_LABELS.CANT_JOIN_QUEUE
        : CUSTOMER_QUEUE_BUTTON_LABELS.JOIN_QUEUE;
  const scrollTo = useCallback((id: string) => {
    onActiveChange(id);
    if (typeof document !== "undefined") {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [onActiveChange]);

  return (
    <aside className="h-fit space-y-3 lg:sticky lg:top-24">
      <div className="rounded-2xl border border-stone-200 bg-white p-3 shadow-sm">
        <p className="px-3 pb-1 pt-2 text-sm font-bold text-stone-900">
          {CUSTOMER_NAVIGATION_LABELS.EXPLORE_MENU}
        </p>
        <p className="px-3 pb-3 text-xs text-stone-400">
          {categories.length}{" "}
          {categories.length === 1
            ? CUSTOMER_NAVIGATION_LABELS.CATEGORY_SINGULAR
            : CUSTOMER_NAVIGATION_LABELS.CATEGORIES_PLURAL}
        </p>
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => scrollTo(category.id)}
            title={category.name}
            className={cn(
              "mb-1 w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition truncate block min-w-0 cursor-pointer",
              activeId === category.id
                ? "bg-[#ff6b00] text-white shadow-xs"
                : "text-stone-600 hover:bg-orange-50 hover:text-[#f26500]",
            )}
          >
            <span className="truncate block">{category.name}</span>
          </button>
        ))}
        <button
          type="button"
          onClick={() => scrollTo(CUSTOMER_RESTAURANT_SECTIONS.OVERVIEW)}
          className={cn(
            "w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition cursor-pointer",
            activeId === CUSTOMER_RESTAURANT_SECTIONS.OVERVIEW
              ? "bg-orange-50 text-[#f26500]"
              : "text-stone-600 hover:bg-stone-50",
          )}
        >
          {CUSTOMER_NAVIGATION_LABELS.OVERVIEW_AND_HOURS}
        </button>
      </div>
      {showQueueButton && (
        <Button
          type="button"
          onClick={onJoinQueueClick}
          disabled={
            !isRestaurantOpen ||
            !restaurant.settings?.acceptsQueue ||
            isJoinedOtherQueue
          }
          className={cn(
            "w-full rounded-xl font-bold text-white shadow-sm transition cursor-pointer",
            isJoinedThisQueue
              ? "bg-emerald-600 hover:bg-emerald-700"
              : "bg-orange-600 hover:bg-orange-700 disabled:bg-stone-300 disabled:cursor-not-allowed",
          )}
        >
          {isJoinedThisQueue ? (
            <CheckCircle2 className="mr-2 size-4" />
          ) : (
            <Users className="mr-2 size-4" />
          )}
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
