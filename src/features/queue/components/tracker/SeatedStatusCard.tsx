import { CheckCircle2, Sparkles, UtensilsCrossed } from "lucide-react";
import { Link } from "react-router-dom";
import { CUSTOMER_ROUTES } from "@/app/router/routes.constants";
import { buttonVariants } from "@/components/ui/button";

export interface SeatedStatusCardProps {
  restaurantId: string;
  restaurantName?: string;
  tableNumber?: string | null;
}

export function SeatedStatusCard({
  restaurantId,
  restaurantName,
  tableNumber,
}: SeatedStatusCardProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-emerald-200 bg-linear-to-b from-emerald-50/70 via-white to-emerald-50/20 p-4 sm:p-6 text-center shadow-xs">
      <div className="relative flex size-14 sm:size-16 items-center justify-center rounded-full bg-emerald-600 text-white shadow-md shadow-emerald-600/20">
        <UtensilsCrossed className="size-7 sm:size-8" />
        <span className="absolute -top-0.5 -right-0.5 flex size-5 sm:size-6 items-center justify-center rounded-full bg-white text-emerald-600 shadow-xs">
          <CheckCircle2 className="size-3.5 sm:size-4" />
        </span>
      </div>

      <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-emerald-100/80 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800">
        <Sparkles className="size-3 text-emerald-600" />
        Seated
      </div>

      <h2 className="mt-2 text-xl font-black text-neutral-900">You are Seated!</h2>
      <p className="mt-0.5 max-w-xs text-xs text-neutral-600">
        Enjoy your dining experience{restaurantName ? ` at ${restaurantName}` : ""}.
      </p>

      {tableNumber && (
        <div className="mt-3 rounded-lg border border-emerald-300 bg-emerald-100/60 px-3 py-1.5 text-xs font-bold text-emerald-950">
          Table Number: {tableNumber}
        </div>
      )}

      <div className="mt-5 w-full max-w-xs">
        <Link
          to={CUSTOMER_ROUTES.RESTAURANT_DETAIL(restaurantId)}
          className={buttonVariants({
            variant: "default",
            size: "sm",
            className: "w-full bg-[#2e1b12] text-white hover:bg-neutral-800 text-xs h-8.5 rounded-xl font-semibold",
          })}
        >
          View Menu
        </Link>
      </div>
    </div>
  );
}
