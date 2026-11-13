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
    <div className="flex flex-col items-center justify-center rounded-2xl border border-[#eddcd4] bg-white p-4 sm:p-6 text-center shadow-xs">
      <div className="flex size-12 sm:size-14 items-center justify-center rounded-full bg-[#fcf5f0] text-[#9a3412]">
        <Ban className="size-6 sm:size-7" />
      </div>

      <div className="mt-3 inline-flex items-center rounded-full bg-[#fcf5f0] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#9a3412] border border-[#eddcd4]">
        Entry Cancelled
      </div>

      <h2 className="mt-2 text-xl font-bold text-neutral-900">Queue Entry Cancelled</h2>
      <p className="mt-0.5 max-w-xs text-xs text-neutral-600">
        {reason ||
          `Your queue entry for ${restaurantName || "the restaurant"} is no longer active.`}
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
