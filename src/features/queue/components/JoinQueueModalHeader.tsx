import { Sparkles, UtensilsCrossed, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface JoinQueueModalHeaderProps {
  restaurantName?: string;
  isPending: boolean;
  onClose: () => void;
}

export function JoinQueueModalHeader({
  restaurantName,
  isPending,
  onClose,
}: JoinQueueModalHeaderProps) {
  return (
    <div className="relative border-b border-neutral-100 bg-linear-to-r from-orange-50/60 via-amber-50/30 to-white px-4 py-3 sm:px-6 sm:py-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="flex size-8 sm:size-10 shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-orange-600 text-white shadow-md shadow-orange-600/20">
            <UtensilsCrossed className="size-4 sm:size-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h2
                id="join-queue-title"
                className="text-base sm:text-lg font-black text-neutral-900 tracking-tight"
              >
                Join the Queue
              </h2>
              <span className="inline-flex items-center gap-0.5 rounded-full bg-orange-100 px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-extrabold uppercase text-orange-800 shrink-0">
                <Sparkles className="size-2 sm:size-2.5" /> Live
              </span>
            </div>
            <p className="text-[11px] sm:text-xs font-semibold text-neutral-500 truncate max-w-[200px] sm:max-w-xs">
              {restaurantName || "Reserve your spot & track live updates"}
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          disabled={isPending}
          onClick={onClose}
          aria-label="Close dialog"
          className="size-8 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100/80 cursor-pointer shrink-0"
        >
          <X className="size-4" />
        </Button>
      </div>
    </div>
  );
}
