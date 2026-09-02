import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export interface PaginationProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Current active page (1-based index)
   */
  currentPage: number;

  /**
   * Total number of pages
   */
  totalPages: number;

  /**
   * Page change event handler
   */
  onPageChange: (page: number) => void;

  /**
   * Optional total items count to display entry details (e.g. "Showing 1 to 10 of 45 entries")
   */
  totalItems?: number;

  /**
   * Items per page (used when calculating "Showing X to Y of Z entries")
   */
  pageSize?: number;

  /**
   * Number of adjacent page numbers to show on each side of active page
   * @default 1
   */
  siblingCount?: number;

  /**
   * Whether to show First and Last page jump buttons (<< and >>)
   * @default false
   */
  showFirstLast?: boolean;

  /**
   * Color theme for active page button
   * - 'admin': Blue (#0052cc)
   * - 'restaurant': SpotQ Orange (#ff6b00)
   * - 'customer': SpotQ Orange (#ff6b00)
   * - 'brand': SpotQ Orange (#ff6b00)
   * - 'dark': Dark slate (#1e293b)
   */
  colorTheme?: "admin" | "restaurant" | "customer" | "brand" | "dark";

  /**
   * Whether the pagination controls are disabled (e.g. while data is fetching)
   */
  disabled?: boolean;
}

/**
 * Universal Reusable Pagination component for Admin, Restaurant, Customer, and Staff tables/lists
 */
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize = 10,
  siblingCount = 1,
  showFirstLast = false,
  colorTheme = "admin",
  disabled = false,
  className,
  ...props
}: PaginationProps) {
  // Ensure safe bounds
  const safeCurrent = Math.max(1, Math.min(currentPage, Math.max(1, totalPages)));
  const safeTotal = Math.max(1, totalPages);

  // Generate page numbers array with ellipsis
  const getPageNumbers = (): (number | "dots")[] => {
    const totalNumbers = siblingCount * 2 + 3; // current + siblings + first + last
    const totalBlocks = totalNumbers + 2; // + 2 ellipsis

    if (safeTotal <= totalBlocks) {
      return Array.from({ length: safeTotal }, (_, i) => i + 1);
    }

    const startPage = Math.max(2, safeCurrent - siblingCount);
    const endPage = Math.min(safeTotal - 1, safeCurrent + siblingCount);

    const pages: (number | "dots")[] = [1];

    if (startPage > 2) {
      pages.push("dots");
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < safeTotal - 1) {
      pages.push("dots");
    }

    pages.push(safeTotal);
    return pages;
  };

  const pages = getPageNumbers();

  // Active theme styles
  const activeStyles = {
    admin: "bg-[#0052cc] text-white hover:bg-[#0052cc]/90 shadow-sm",
    restaurant: "bg-spotq-orange text-white hover:bg-spotq-orange/90 shadow-sm",
    customer: "bg-spotq-orange text-white hover:bg-spotq-orange/90 shadow-sm",
    brand: "bg-spotq-orange text-white hover:bg-spotq-orange/90 shadow-sm",
    dark: "bg-slate-900 text-white hover:bg-slate-800 shadow-sm",
  }[colorTheme];

  // Entry range text calculation
  let entriesText: string | null = null;
  if (typeof totalItems === "number") {
    if (totalItems === 0) {
      entriesText = "Showing 0 to 0 of 0 entries";
    } else {
      const from = (safeCurrent - 1) * pageSize + 1;
      const to = Math.min(safeCurrent * pageSize, totalItems);
      entriesText = `Showing ${from} to ${to} of ${totalItems} entries`;
    }
  }

  const isFirstPage = safeCurrent <= 1;
  const isLastPage = safeCurrent >= safeTotal;

  return (
    <nav
      aria-label="Pagination"
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-4 py-3 px-4 text-xs sm:text-sm text-muted-foreground select-none",
        className,
      )}
      {...props}
    >
      {/* Entries Info on Left */}
      <div className="text-xs text-muted-foreground">
        {entriesText ? (
          <span>{entriesText}</span>
        ) : (
          <span>
            Page <strong className="font-semibold text-foreground">{safeCurrent}</strong> of{" "}
            <strong className="font-semibold text-foreground">{safeTotal}</strong>
          </span>
        )}
      </div>

      {/* Pagination Controls on Right */}
      <div className="flex items-center gap-1">
        {showFirstLast && (
          <button
            type="button"
            onClick={() => onPageChange(1)}
            disabled={disabled || isFirstPage}
            aria-label="Go to first page"
            className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            <ChevronsLeft className="size-4" />
          </button>
        )}

        {/* Previous button */}
        <button
          type="button"
          onClick={() => onPageChange(safeCurrent - 1)}
          disabled={disabled || isFirstPage}
          aria-label="Previous page"
          className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-40 disabled:pointer-events-none transition-colors"
        >
          <ChevronLeft className="size-4" />
        </button>

        {/* Page numbers */}
        {pages.map((p, idx) => {
          if (p === "dots") {
            return (
              <span
                // biome-ignore lint/suspicious/noArrayIndexKey: dots represent static separator
                key={`dots-${idx}`}
                className="flex size-8 items-center justify-center text-xs text-muted-foreground"
              >
                …
              </span>
            );
          }

          const isActive = p === safeCurrent;

          return (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              disabled={disabled || isActive}
              aria-current={isActive ? "page" : undefined}
              aria-label={`Page ${p}`}
              className={cn(
                "flex size-8 items-center justify-center rounded-md text-xs font-medium transition-all",
                isActive
                  ? activeStyles
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                disabled && "opacity-40 pointer-events-none",
              )}
            >
              {p}
            </button>
          );
        })}

        {/* Next button */}
        <button
          type="button"
          onClick={() => onPageChange(safeCurrent + 1)}
          disabled={disabled || isLastPage}
          aria-label="Next page"
          className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-40 disabled:pointer-events-none transition-colors"
        >
          <ChevronRight className="size-4" />
        </button>

        {showFirstLast && (
          <button
            type="button"
            onClick={() => onPageChange(safeTotal)}
            disabled={disabled || isLastPage}
            aria-label="Go to last page"
            className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            <ChevronsRight className="size-4" />
          </button>
        )}
      </div>
    </nav>
  );
}

export default Pagination;
