import { AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PRODUCT_CLASSIFICATIONS } from "@/features/analytics/constants/restaurant-analytics.constants";
import type {
  ProductItemDto,
  ProductRankingPaginationDto,
} from "@/features/analytics/types/restaurant-analytics.types";
import { cn } from "@/lib/utils/cn";
import { formatCurrency } from "@/lib/utils/currency";

export interface SlowMovingTableProps {
  items: ProductItemDto[];
  pagination: ProductRankingPaginationDto;
  onPageChange: (page: number) => void;
  className?: string;
}

export function SlowMovingTable({
  items,
  pagination,
  onPageChange,
  className,
}: SlowMovingTableProps) {
  const { currentPage, totalPages, totalItems, hasNextPage, hasPrevPage } = pagination;

  return (
    <div
      className={cn(
        "rounded-2xl border border-[#eddcd4] bg-white p-5 sm:p-6 shadow-2xs space-y-4",
        className,
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
            <AlertCircle className="size-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-neutral-900">Slow-Moving Menu Items</h3>
            <p className="text-xs text-neutral-500">
              Dishes with 3 or fewer orders (or zero orders) during this period
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 self-start sm:self-auto">
          {totalItems} items flagged
        </span>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-xl border border-[#eddcd4]">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#faf7f5] text-[11px] font-bold uppercase tracking-wider text-neutral-500 border-b border-[#eddcd4]">
            <tr>
              <th className="py-3 px-3.5">Dish Name</th>
              <th className="py-3 px-3.5">Classification</th>
              <th className="py-3 px-3.5">Catalog Status</th>
              <th className="py-3 px-3.5 text-right">Qty Sold</th>
              <th className="py-3 px-3.5 text-right">Revenue</th>
              <th className="py-3 px-3.5 text-right">Action Needed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eddcd4]/60 text-neutral-800">
            {items.map((item, index) => {
              const isZeroSales =
                item.classification === PRODUCT_CLASSIFICATIONS.ZERO_SALES ||
                item.quantitySold === 0;

              return (
                <tr
                  key={item.menuItemId || `${item.name}-${index}`}
                  className="hover:bg-[#faf7f5]/80 transition-colors"
                >
                  <td className="py-3 px-3.5 font-bold text-neutral-900">{item.name}</td>
                  <td className="py-3 px-3.5">
                    {isZeroSales ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                        Zero Sales
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        Low Volume (&le; 3)
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3.5">
                    <span
                      className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border",
                        item.isAvailable
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-neutral-100 text-neutral-600 border-neutral-200",
                      )}
                    >
                      {item.isAvailable ? "Active" : "Unavailable"}
                    </span>
                  </td>
                  <td className="py-3 px-3.5 text-right font-extrabold text-neutral-900">
                    {item.quantitySold}
                  </td>
                  <td className="py-3 px-3.5 text-right font-bold text-neutral-700">
                    {formatCurrency(item.salesRupees)}
                  </td>
                  <td className="py-3 px-3.5 text-right">
                    <span className="text-[11px] font-medium text-amber-800">
                      {isZeroSales ? "Review placement" : "Evaluate pricing"}
                    </span>
                  </td>
                </tr>
              );
            })}

            {items.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-neutral-400">
                  Great job! No slow-moving or zero-sale items found in this period.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-1">
          <p className="text-xs text-neutral-500">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!hasPrevPage}
              onClick={() => onPageChange?.(currentPage - 1)}
              className="h-8 gap-1 rounded-lg border-[#eddcd4] px-2 text-xs"
            >
              <ChevronLeft className="size-3.5" />
              <span>Prev</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!hasNextPage}
              onClick={() => onPageChange?.(currentPage + 1)}
              className="h-8 gap-1 rounded-lg border-[#eddcd4] px-2 text-xs"
            >
              <span>Next</span>
              <ChevronRight className="size-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
