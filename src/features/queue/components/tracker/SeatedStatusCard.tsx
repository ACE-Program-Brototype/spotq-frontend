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
    <div className="flex flex-col items-center justify-center rounded-2xl sm:rounded-3xl border border-emerald-200 bg-linear-to-b from-emerald-50 via-white to-emerald-50/20 p-5 sm:p-8 text-center shadow-lg sm:shadow-xl">
      <div className="relative flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xl shadow-emerald-600/30">
        <UtensilsCrossed className="h-8 w-8 sm:h-10 sm:w-10" />
        <span className="absolute -top-1 -right-1 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-white text-emerald-600 shadow-sm">
          <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
        </span>
      </div>

      <div className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-emerald-100/80 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-800">
        <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
        Seated
      </div>

      <h2 className="mt-3 text-2xl font-black text-stone-900">You are Seated!</h2>
      <p className="mt-1 max-w-sm text-sm text-stone-600">
        Enjoy your dining experience{restaurantName ? ` at ${restaurantName}` : ""}.
      </p>

      {tableNumber && (
        <div className="mt-4 rounded-xl border border-emerald-300 bg-emerald-100/60 px-4 py-2 text-sm font-bold text-emerald-950">
          Table Number: {tableNumber}
        </div>
      )}

      <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full max-w-xs">
        <Link
          to={CUSTOMER_ROUTES.RESTAURANT_DETAIL(restaurantId)}
          className={buttonVariants({
            variant: "default",
            className: "w-full bg-stone-900 text-white hover:bg-stone-800",
          })}
        >
          View Menu
        </Link>
      </div>
    </div>
  );
}
