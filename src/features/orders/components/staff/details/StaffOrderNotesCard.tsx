import { MessageSquare } from "lucide-react";
import { STAFF_ORDER_DETAILS_MESSAGES } from "@/features/orders/constants/staff-orders.constants";

interface StaffOrderNotesCardProps {
  customerNotes?: string | null;
}

export function StaffOrderNotesCard({ customerNotes }: StaffOrderNotesCardProps) {
  if (!customerNotes?.trim()) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50/60 p-4 text-center text-xs text-neutral-400 shadow-2xs">
        <MessageSquare className="size-4 mx-auto mb-1.5 text-neutral-300" />
        <span>{STAFF_ORDER_DETAILS_MESSAGES.NO_CUSTOMER_NOTES}</span>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border-2 border-amber-300 bg-amber-50/70 p-4 sm:p-5 shadow-2xs">
      <div className="flex items-start gap-3 text-amber-950">
        <div className="size-8 rounded-xl bg-amber-200/80 flex items-center justify-center shrink-0 mt-0.5 text-amber-800">
          <MessageSquare className="size-4" />
        </div>
        <div className="space-y-1 min-w-0">
          <h3 className="text-xs font-black uppercase tracking-wider text-amber-900">
            {STAFF_ORDER_DETAILS_MESSAGES.CUSTOMER_DINING_NOTES_HEADING}
          </h3>
          <p className="text-xs sm:text-sm font-semibold leading-relaxed text-amber-950 break-words">
            {customerNotes}
          </p>
        </div>
      </div>
    </div>
  );
}
