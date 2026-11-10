import { SearchX, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SUBSCRIBER_MESSAGES } from "../constants/subscriber.constants";

export interface SubscriberEmptyStateProps {
  isFiltered?: boolean;
  onResetFilters?: () => void;
}

export function SubscriberEmptyState({
  isFiltered = false,
  onResetFilters,
}: SubscriberEmptyStateProps) {
  if (isFiltered) {
    return (
      <div
        className="flex flex-col items-center justify-center p-12 text-center"
        data-testid="subscriber-filtered-empty-state"
      >
        <div className="flex size-14 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-4">
          <SearchX className="size-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-900">
          {SUBSCRIBER_MESSAGES.FILTERED_EMPTY_TITLE}
        </h3>
        <p className="mt-1 text-sm text-slate-500 max-w-sm">
          {SUBSCRIBER_MESSAGES.FILTERED_EMPTY_DESCRIPTION}
        </p>
        {onResetFilters && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onResetFilters}
            className="mt-4 rounded-xl"
            data-testid="reset-filters-btn"
          >
            {SUBSCRIBER_MESSAGES.CLEAR_FILTERS}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div
      className="flex flex-col items-center justify-center p-12 text-center"
      data-testid="subscriber-empty-state"
    >
      <div className="flex size-14 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-4">
        <Users className="size-6" />
      </div>
      <h3 className="text-base font-semibold text-slate-900">{SUBSCRIBER_MESSAGES.EMPTY_TITLE}</h3>
      <p className="mt-1 text-sm text-slate-500 max-w-sm">
        {SUBSCRIBER_MESSAGES.EMPTY_DESCRIPTION}
      </p>
    </div>
  );
}
