import { RotateCcw, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface CustomerRestaurantEmptyStateProps {
  isFiltered: boolean;
  onResetFilters: () => void;
}

export function CustomerRestaurantEmptyState({
  isFiltered,
  onResetFilters,
}: CustomerRestaurantEmptyStateProps) {
  return (
    <div
      data-testid="restaurant-empty-state"
      className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl border border-dashed border-neutral-300 bg-neutral-50/50"
    >
      <div className="flex size-14 items-center justify-center rounded-2xl bg-orange-100/60 text-[#ff6b00] mb-3">
        <UtensilsCrossed className="size-7" />
      </div>
      <h3 className="text-base font-bold text-neutral-900">No restaurants found</h3>
      <p className="mt-1 max-w-sm text-xs text-neutral-500">
        {isFiltered
          ? "We couldn't find any restaurants matching your current search or category filter. Try clearing filters."
          : "No active restaurants are currently available. Please check back later."}
      </p>
      {isFiltered && (
        <Button
          size="sm"
          variant="outline"
          onClick={onResetFilters}
          className="mt-4 gap-1.5 rounded-xl text-xs font-semibold border-neutral-300 hover:bg-neutral-100 cursor-pointer"
        >
          <RotateCcw className="size-3.5" />
          <span>Reset All Filters</span>
        </Button>
      )}
    </div>
  );
}
