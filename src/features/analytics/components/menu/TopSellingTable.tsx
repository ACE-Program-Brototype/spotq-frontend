import { ChevronLeft, ChevronRight, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import type {
  ProductItemDto,
  ProductRankingPaginationDto,
} from "@/features/analytics/types/restaurant-analytics.types";
import { cn } from "@/lib/utils/cn";
import { formatCurrency } from "@/lib/utils/currency";

export interface TopSellingTableProps {
  items: ProductItemDto[];
  pagination: ProductRankingPaginationDto;
  onPageChange?: (page: number) => void;
  className?: string;
}

export function TopSellingTable({
  items,
  pagination,
  onPageChange,
  className,
}: TopSellingTableProps) {
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
          <div className="flex size-7 items-center justify-center rounded-lg bg-[#fef3ec] text-[#e8631b] border border-[#fae2d3]">
            <Flame className="size-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-neutral-900">Top-Selling Menu Items</h3>
            <p className="text-xs text-neutral-500">
              Ranked by quantity sold and revenue contribution
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#faf7f5] border border-[#eddcd4] text-neutral-700 self-start sm:self-auto">
          {totalItems} items ranked
        </span>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-xl border border-[#eddcd4]">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#faf7f5] text-[11px] font-bold uppercase tracking-wider text-neutral-500 border-b border-[#eddcd4]">
            <tr>
              <th className="py-3 px-3.5 w-12 text-center">#</th>
              <th className="py-3 px-3.5">Dish Name</th>
              <th className="py-3 px-3.5">Catalog Status</th>
              <th className="py-3 px-3.5 text-right">Qty Sold</th>
              <th className="py-3 px-3.5 text-right">Revenue</th>
              <th className="py-3 px-3.5 text-right w-36">Sales Share</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eddcd4]/60 text-neutral-800">
            {items.map((item, index) => {
              const rank = (currentPage - 1) * pagination.limit + index + 1;
              const salesPercent = item.percentageOfTotalSales ?? 0;

              return (
                <tr
                  key={item.menuItemId || `${item.name}-${index}`}
                  className="hover:bg-[#faf7f5]/80 transition-colors"
                >
                  <td className="py-3 px-3.5 text-center font-bold text-neutral-400">
                    {rank <= 3 ? (
                      <span className="inline-flex size-5 items-center justify-center rounded-full bg-[#fef3ec] text-[#9a3412] text-[11px] font-black border border-[#fae2d3]">
                        {rank}
                      </span>
                    ) : (
                      rank
                    )}
                  </td>
                  <td className="py-3 px-3.5 font-bold text-neutral-900">{item.name}</td>
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
                    {item.quantitySold.toLocaleString()}
                  </td>
                  <td className="py-3 px-3.5 text-right font-bold text-emerald-800">
                    {formatCurrency(item.salesRupees)}
                  </td>
                  <td className="py-3 px-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-neutral-100 overflow-hidden hidden sm:block">
                        <div
                          style={{ width: `${Math.min(100, salesPercent)}%` }}
                          className="h-full bg-[#9a3412] rounded-full"
                        />
                      </div>
                      <span className="font-semibold text-neutral-700 w-10 text-right">
                        {salesPercent}%
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}

            {items.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-neutral-400">
                  No sales recorded for any menu items in this period.
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
