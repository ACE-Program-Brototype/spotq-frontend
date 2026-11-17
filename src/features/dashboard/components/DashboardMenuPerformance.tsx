import { Link } from "react-router-dom";
import { RESTAURANT_ROUTES } from "@/app/router/routes.constants";
import {
  ANALYTICS_SECTION_STATUSES,
  type ProductSectionResultDto,
} from "@/features/analytics";

interface DashboardMenuPerformanceProps {
  products: ProductSectionResultDto;
}

export function DashboardMenuPerformance({ products }: DashboardMenuPerformanceProps) {
  if (products.status !== ANALYTICS_SECTION_STATUSES.AVAILABLE) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-[#eddcd4] bg-white p-5 sm:p-6 shadow-2xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-neutral-900">
            Menu Performance Highlights
          </h3>
          <p className="text-xs text-neutral-500">
            Top sellers and slow-moving items requiring inventory decisions.
          </p>
        </div>
        <Link
          to={RESTAURANT_ROUTES.ANALYTICS.MENU}
          className="text-xs font-semibold text-[#9a3412] hover:underline"
        >
          View All Items &amp; Threshold Rules &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Top Sellers Preview */}
        <div className="rounded-xl border border-[#eddcd4] bg-[#faf7f5]/50 p-4 space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-neutral-700">
            Top Selling Items
          </p>
          {products.topSelling.items.length === 0 ? (
            <p className="text-xs text-neutral-400">No sales recorded for this period.</p>
          ) : (
            <div className="space-y-2">
              {products.topSelling.items.slice(0, 3).map((item, idx) => (
                <div
                  key={item.menuItemId}
                  className="flex items-center justify-between text-xs py-1.5 border-b border-[#eddcd4]/50 last:border-0"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#fef3ec] text-[10px] font-bold text-[#9a3412]">
                      {idx + 1}
                    </span>
                    <span className="font-medium text-neutral-900 truncate">
                      {item.name}
                    </span>
                  </div>
                  <span className="font-semibold text-neutral-800 shrink-0 ml-2">
                    {item.quantitySold} sold
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Slow Moving Summary Preview */}
        <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-900">
              Slow-Moving Items
            </p>
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
              Threshold: &le; 3 sales
            </span>
          </div>
          {products.slowMoving.items.length === 0 ? (
            <p className="text-xs text-emerald-700 font-medium">
              &check; Healthy velocity! No items below threshold.
            </p>
          ) : (
            <div className="space-y-2">
              {products.slowMoving.items.slice(0, 3).map((item) => (
                <div
                  key={item.menuItemId}
                  className="flex items-center justify-between text-xs py-1.5 border-b border-amber-200/50 last:border-0"
                >
                  <span className="font-medium text-neutral-900 truncate">
                    {item.name}
                  </span>
                  <span className="font-semibold text-amber-800 shrink-0 ml-2">
                    {item.quantitySold} sales
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
