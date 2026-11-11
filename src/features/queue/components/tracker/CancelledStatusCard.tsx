import { Ban } from "lucide-react";
import { Link } from "react-router-dom";
import { CUSTOMER_ROUTES } from "@/app/router/routes.constants";
import { buttonVariants } from "@/components/ui/button";

export interface CancelledStatusCardProps {
  restaurantId: string;
  restaurantName?: string;
  reason?: string;
}

export function CancelledStatusCard({
  restaurantId,
  restaurantName,
  reason,
}: CancelledStatusCardProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-stone-200 bg-white p-8 text-center shadow-lg">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-stone-100 text-stone-500">
        <Ban className="h-8 w-8" />
      </div>

      <div className="mt-4 inline-flex items-center rounded-full bg-stone-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-stone-700">
        Entry Cancelled
      </div>

      <h2 className="mt-3 text-2xl font-bold text-stone-900">Queue Entry Cancelled</h2>
      <p className="mt-1 max-w-sm text-sm text-stone-600">
        {reason ||
          `Your queue entry for ${restaurantName || "the restaurant"} is no longer active.`}
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
