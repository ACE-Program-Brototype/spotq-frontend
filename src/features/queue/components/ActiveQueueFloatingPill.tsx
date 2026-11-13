import { ArrowRight, UtensilsCrossed } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CUSTOMER_ROUTES } from "@/app/router/routes.constants";
import type { ActiveCustomerTicket } from "../types/ring-alert.types";
import { formatQueueNumber, getActiveCustomerTicket } from "../utils/active-queue.utils";

export function ActiveQueueFloatingPill() {
  const location = useLocation();
  const navigate = useNavigate();

  const [activeTicket, setActiveTicket] = useState<ActiveCustomerTicket | null>(() =>
    getActiveCustomerTicket(),
  );

  useEffect(() => {
    const syncTicket = () => {
      setActiveTicket(getActiveCustomerTicket());
    };

    window.addEventListener("storage", syncTicket);
    return () => window.removeEventListener("storage", syncTicket);
  }, []);

  const isOnTrackerPage = location.pathname.includes("/queue/status");

  if (!activeTicket || isOnTrackerPage) {
    return null;
  }

  const formattedQueueNumber = formatQueueNumber(activeTicket.queueNumber);

  const handleClick = () => {
    navigate(CUSTOMER_ROUTES.QUEUE_STATUS(activeTicket.restaurantId, activeTicket.queueEntryId));
  };

  return (
    <div className="fixed bottom-5 right-4 sm:right-6 z-40 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <button
        type="button"
        onClick={handleClick}
        className="group flex items-center gap-2.5 rounded-full bg-stone-900/95 backdrop-blur-md px-4 py-2.5 text-white shadow-xl shadow-stone-950/20 hover:bg-stone-900 hover:scale-102 transition-all cursor-pointer border border-stone-800"
        aria-label="View active queue status"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
        </span>

        <div className="flex items-center gap-1.5 text-xs font-semibold">
          <UtensilsCrossed className="h-3.5 w-3.5 text-orange-400" />
          <span>In Line{formattedQueueNumber ? ` • ${formattedQueueNumber}` : ""}</span>
        </div>

        <span className="text-[11px] font-bold text-orange-400 group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-0.5">
          Track Live
          <ArrowRight className="h-3 w-3" />
        </span>
      </button>
    </div>
  );
}
