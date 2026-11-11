import { Inbox, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { STAFF_ORDERS_MESSAGES } from "@/features/orders/constants/staff-orders.constants";

interface StaffOrdersEmptyStateProps {
  hasFilters: boolean;
  onResetFilters: () => void;
}

export function StaffOrdersEmptyState({ hasFilters, onResetFilters }: StaffOrdersEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-dashed border-neutral-200">
      <div className="size-12 rounded-2xl bg-[#fef3ec] text-[#e8631b] flex items-center justify-center mb-4 shadow-xs">
        <Inbox className="size-6" />
      </div>
      <h3 className="text-base font-bold text-neutral-900">
        {hasFilters
          ? STAFF_ORDERS_MESSAGES.EMPTY_ORDERS_TITLE
          : STAFF_ORDERS_MESSAGES.EMPTY_NO_ORDERS_YET}
      </h3>
      <p className="mt-1.5 max-w-sm text-xs sm:text-sm text-neutral-500">
        {hasFilters
          ? STAFF_ORDERS_MESSAGES.EMPTY_ORDERS_DESC
          : "Incoming Queue Pro and Self Pro orders will show up here in real time."}
      </p>

      {hasFilters && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onResetFilters}
          className="mt-5 rounded-xl border-neutral-200 text-xs font-semibold hover:bg-neutral-50 gap-1.5"
        >
          <RotateCcw className="size-3.5" />
          Clear all filters
        </Button>
      )}
    </div>
  );
}
