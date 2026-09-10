import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CUSTOMER_MESSAGES } from "../constants/customer.constants";

export interface CustomerEmptyStateProps {
  isFiltered?: boolean;
  onClearFilters?: () => void;
}

export function CustomerEmptyState({
  isFiltered = false,
  onClearFilters,
}: CustomerEmptyStateProps) {
  return (
    <div
      role="status"
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
      data-testid="customer-empty-state"
    >
      <div className="flex size-14 items-center justify-center rounded-2xl bg-slate-100 text-[#1e3a5f] mb-4 shadow-xs">
        <Users className="size-7 text-slate-500" />
      </div>
      <h3 className="text-base font-bold text-slate-900">{CUSTOMER_MESSAGES.EMPTY_TITLE}</h3>
      <p className="mt-1 text-xs text-slate-500 max-w-sm">
        {isFiltered
          ? CUSTOMER_MESSAGES.EMPTY_FILTER_DESCRIPTION
          : CUSTOMER_MESSAGES.EMPTY_DEFAULT_DESCRIPTION}
      </p>
      {isFiltered && onClearFilters && (
        <div className="mt-5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="rounded-xl border-slate-200 text-xs font-semibold hover:bg-slate-50"
          >
            {CUSTOMER_MESSAGES.CLEAR_FILTERS_BUTTON}
          </Button>
        </div>
      )}
    </div>
  );
}

export default CustomerEmptyState;
