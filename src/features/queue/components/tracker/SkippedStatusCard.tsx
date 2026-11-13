import { AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { CUSTOMER_ROUTES } from "@/app/router/routes.constants";
import { buttonVariants } from "@/components/ui/button";

export interface SkippedStatusCardProps {
  restaurantId: string;
  restaurantName?: string;
  reason?: string;
}

/**
 * Terminal card displayed when a party's queue turn is skipped without repositioning.
 */
export function SkippedStatusCard({
  restaurantId,
  restaurantName,
  reason,
}: SkippedStatusCardProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-amber-200 bg-linear-to-b from-amber-50/70 via-white to-amber-50/20 p-4 sm:p-6 text-center shadow-xs">
      <div className="flex size-12 sm:size-14 items-center justify-center rounded-full bg-amber-100 text-amber-700">
        <AlertTriangle className="size-6 sm:size-7" />
      </div>

      <div className="mt-3 inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-800">
        Skipped
      </div>

      <h2 className="mt-2 text-xl font-bold text-neutral-900">Turn Skipped</h2>
      <p className="mt-0.5 max-w-xs text-xs text-neutral-600">
        {reason ||
          `Your queue entry at ${restaurantName || "the restaurant"} was skipped because your party was not available at the host stand.`}
      </p>

      <div className="mt-5 w-full max-w-xs">
        <Link
          to={CUSTOMER_ROUTES.RESTAURANT_DETAIL(restaurantId)}
          className={buttonVariants({
            variant: "default",
            size: "sm",
            className: "w-full bg-[#2e1b12] text-white hover:bg-neutral-800 text-xs h-8.5 rounded-xl font-semibold",
          })}
        >
          Back to Restaurant
        </Link>
      </div>
    </div>
  );
}
