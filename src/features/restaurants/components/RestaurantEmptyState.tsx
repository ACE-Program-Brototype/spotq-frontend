import { RotateCcw, Store, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RESTAURANT_MESSAGES } from "../constants/restaurant.constants";

export interface RestaurantEmptyStateProps {
  isFiltered?: boolean;
  onClearFilters?: () => void;
}

export function RestaurantEmptyState({
  isFiltered = false,
  onClearFilters,
}: RestaurantEmptyStateProps) {
  return (
    <div
      role="status"
      className="flex flex-col items-center justify-center py-16 px-4 text-center select-none"
      data-testid="restaurant-empty-state"
    >
      <div className="flex size-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 mb-4 shadow-2xs">
        {isFiltered ? (
          <UtensilsCrossed className="size-7 text-slate-400" />
        ) : (
          <Store className="size-7 text-slate-400" />
        )}
      </div>

      <h3 className="text-base font-bold text-slate-900">
        {isFiltered ? RESTAURANT_MESSAGES.EMPTY_TITLE : RESTAURANT_MESSAGES.EMPTY_TITLE}
      </h3>

      <p className="mt-1 text-xs text-slate-500 max-w-sm">
        {isFiltered ? RESTAURANT_MESSAGES.EMPTY_DESCRIPTION : RESTAURANT_MESSAGES.EMPTY_DEFAULT}
      </p>

      {isFiltered && onClearFilters && (
        <div className="mt-5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="rounded-xl border-slate-200 text-xs font-semibold hover:bg-slate-50 gap-2"
          >
            <RotateCcw className="size-3.5" />
            {RESTAURANT_MESSAGES.CLEAR_FILTERS}
          </Button>
        </div>
      )}
    </div>
  );
}
