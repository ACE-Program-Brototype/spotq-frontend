import { Pagination } from "@/components/common/Pagination";
import { cn } from "@/lib/utils/cn";
import type { DataTablePaginationProps } from "./DataTable.types";

export function DataTablePagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize = 10,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange,
  showFirstLast = false,
  siblingCount = 1,
  theme = "admin",
  disabled = false,
  className,
}: DataTablePaginationProps) {
  return (
    <div
      data-testid="data-table-pagination"
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border/80 bg-[#fffcf9]/60 px-4 py-3 select-none",
        className,
      )}
    >
      {/* Page Size Selector */}
      {pageSizeOptions && pageSizeOptions.length > 0 && onPageSizeChange ? (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            disabled={disabled}
            aria-label="Select number of rows per page"
            className="h-8 rounded-lg border border-border/80 bg-background px-2 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 cursor-pointer"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      {/* Main Page Navigation */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pageSize}
        siblingCount={siblingCount}
        showFirstLast={showFirstLast}
        theme={theme}
        disabled={disabled}
        onPageChange={onPageChange}
        className="p-0 border-0 bg-transparent flex-1 justify-end"
      />
    </div>
  );
}
