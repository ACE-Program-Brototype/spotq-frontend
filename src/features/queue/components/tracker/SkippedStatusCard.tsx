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
    <div className="flex flex-col items-center justify-center rounded-3xl border border-amber-200 bg-linear-to-b from-amber-50/70 via-white to-amber-50/20 p-8 text-center shadow-lg">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-700">
        <AlertTriangle className="h-8 w-8" />
      </div>

      <div className="mt-4 inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-800">
        Skipped
      </div>

      <h2 className="mt-3 text-2xl font-bold text-stone-900">Turn Skipped</h2>
      <p className="mt-1 max-w-sm text-sm text-stone-600">
        {reason ||
          `Your queue entry at ${restaurantName || "the restaurant"} was skipped because your party was not available at the host stand.`}
      </p>

      <div className="mt-6 flex flex-col sm:flex-row gap-3 w-full max-w-xs">
        <Link
          to={CUSTOMER_ROUTES.RESTAURANT_DETAIL(restaurantId)}
          className={buttonVariants({
            variant: "default",
            className: "w-full bg-stone-900 text-white hover:bg-stone-800",
          })}
        >
          Back to Restaurant
        </Link>
      </div>
    </div>
  );
}
