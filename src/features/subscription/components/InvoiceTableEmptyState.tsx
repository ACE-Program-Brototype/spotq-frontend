import { FileX2, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SUBSCRIPTION_HISTORY_MESSAGES } from "@/features/subscription/constants/subscription-history.constants";

export interface InvoiceTableEmptyStateProps {
  isFiltered: boolean;
  onResetFilter: () => void;
}

export function InvoiceTableEmptyState({ isFiltered, onResetFilter }: InvoiceTableEmptyStateProps) {
  if (isFiltered) {
    return (
      <div
        className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#f3e6de] bg-white px-6 py-12 text-center"
        data-testid="invoice-table-filter-empty"
      >
        <div className="flex size-12 items-center justify-center rounded-full bg-[#fef3ec] text-[#ea580c] mb-3">
          <FileX2 className="size-6" aria-hidden="true" />
        </div>
        <h3 className="text-base font-semibold text-neutral-900">
          {SUBSCRIPTION_HISTORY_MESSAGES.FILTER_EMPTY_TITLE}
        </h3>
        <p className="mt-1 max-w-sm text-sm text-neutral-500">
          {SUBSCRIPTION_HISTORY_MESSAGES.FILTER_EMPTY_DESCRIPTION}
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onResetFilter}
          className="mt-4 border-[#f3e6de] text-[#9a3412] hover:bg-[#fef3ec]"
          data-testid="reset-filter-button"
        >
          {SUBSCRIPTION_HISTORY_MESSAGES.RESET_FILTER_BUTTON}
        </Button>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#f3e6de] bg-white px-6 py-12 text-center"
      data-testid="invoice-table-empty"
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-[#fef3ec] text-[#ea580c] mb-3">
        <Receipt className="size-6" aria-hidden="true" />
      </div>
      <h3 className="text-base font-semibold text-neutral-900">
        {SUBSCRIPTION_HISTORY_MESSAGES.EMPTY_TITLE}
      </h3>
      <p className="mt-1 max-w-sm text-sm text-neutral-500">
        {SUBSCRIPTION_HISTORY_MESSAGES.EMPTY_DESCRIPTION}
      </p>
    </div>
  );
}
