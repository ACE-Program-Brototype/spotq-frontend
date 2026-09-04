/**
 * Universal Reusable Pagination Component
 * Supports page jumping, ellipsis truncation, items-per-page summaries, and theme variants across portals.
 */

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { PaginationProps } from "./types";

export type { PaginationProps };

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize = 10,
  siblingCount = 1,
  showFirstLast = false,
  theme = "admin",
  disabled = false,
  className,
  ...props
}: PaginationProps) {
  const effectivePageSize = Math.max(1, pageSize);

  const effectiveTotalPages =
    typeof totalPages === "number"
      ? totalPages
      : typeof totalItems === "number"
        ? Math.ceil(totalItems / effectivePageSize)
        : 1;

  const safeTotal = Math.max(1, effectiveTotalPages || 1);
  const safeCurrent = Math.max(1, Math.min(currentPage || 1, safeTotal));

  const activeTheme = theme;

  const getPageNumbers = (): (number | "dots")[] => {
    const totalNumbers = siblingCount * 2 + 3;
    const totalBlocks = totalNumbers + 2;

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

  const activeStyles = {
    admin: "bg-[#0052cc] text-white hover:bg-[#0052cc]/90 shadow-sm",
    restaurant: "bg-[#ff6b00] text-white hover:bg-[#e05e00] shadow-sm",
    customer: "bg-[#ff6b00] text-white hover:bg-[#e05e00] shadow-sm",
    brand: "bg-[#ff6b00] text-white hover:bg-[#e05e00] shadow-sm",
    dark: "bg-slate-900 text-white hover:bg-slate-800 shadow-sm",
  }[activeTheme];

  let entriesText: string | null = null;
  if (typeof totalItems === "number") {
    if (totalItems === 0) {
      entriesText = "Showing 0 to 0 of 0 entries";
    } else {
      const from = (safeCurrent - 1) * effectivePageSize + 1;
      const to = Math.min(safeCurrent * effectivePageSize, totalItems);
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

        <button
          type="button"
          onClick={() => onPageChange(safeCurrent - 1)}
          disabled={disabled || isFirstPage}
          aria-label="Previous page"
          className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-40 disabled:pointer-events-none transition-colors"
        >
          <ChevronLeft className="size-4" />
        </button>

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
