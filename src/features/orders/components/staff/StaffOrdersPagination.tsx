import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StaffOrdersPaginationProps {
  currentPage: number;
  totalPages: number;
  totalOrders: number;
  limit: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

export function StaffOrdersPagination({
  currentPage,
  totalPages,
  totalOrders,
  limit,
  onPageChange,
  disabled = false,
}: StaffOrdersPaginationProps) {
  if (totalOrders === 0) return null;

  const startOrderIndex = (currentPage - 1) * limit + 1;
  const endOrderIndex = Math.min(currentPage * limit, totalOrders);

  const canGoPrevious = currentPage > 1 && !disabled;
  const canGoNext = currentPage < totalPages && !disabled;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 text-xs text-neutral-500">
      <p>
        Showing <span className="font-semibold text-neutral-800">{startOrderIndex}</span> to{" "}
        <span className="font-semibold text-neutral-800">{endOrderIndex}</span> of{" "}
        <span className="font-semibold text-neutral-800">{totalOrders}</span> orders
      </p>

      <div className="flex items-center gap-1.5">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canGoPrevious}
          className="h-8 px-2.5 rounded-lg border-neutral-200 text-neutral-700 hover:bg-neutral-50 text-xs font-medium gap-1"
        >
          <ChevronLeft className="size-3.5" />
          <span>Previous</span>
        </Button>

        <span className="px-2 text-xs font-semibold text-neutral-700">
          Page {currentPage} of {Math.max(1, totalPages)}
        </span>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canGoNext}
          className="h-8 px-2.5 rounded-lg border-neutral-200 text-neutral-700 hover:bg-neutral-50 text-xs font-medium gap-1"
        >
          <span>Next</span>
          <ChevronRight className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}
