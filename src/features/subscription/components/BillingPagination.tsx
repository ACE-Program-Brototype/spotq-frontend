import { Pagination } from "@/components/common/Pagination";
import { cn } from "@/lib/utils/cn";

export interface BillingPaginationProps {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
  className?: string;
}

export function BillingPagination({
  currentPage,
  totalPages,
  totalRecords,
  pageSize = 10,
  onPageChange,
  disabled = false,
  className,
}: BillingPaginationProps) {
  if (totalRecords <= 0 || totalPages <= 1) {
    return null;
  }

  return (
    <div
      className={cn("w-full border-t border-[#f3e6de] bg-[#fffdfb] px-4 py-3 sm:px-6", className)}
      data-testid="billing-pagination"
    >
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalRecords}
        pageSize={pageSize}
        onPageChange={onPageChange}
        theme="restaurant"
        showFirstLast={true}
        disabled={disabled}
      />
    </div>
  );
}
