import { UtensilsCrossed, X } from "lucide-react";

interface AssignTableModalHeaderProps {
  guestName: string;
  onClose: () => void;
  disabled?: boolean;
}

export function AssignTableModalHeader({
  guestName,
  onClose,
  disabled = false,
}: AssignTableModalHeaderProps) {
  return (
    <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[#eddcd4] bg-[#fffcf9] shrink-0">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-xl bg-[#fed7aa]/50 flex items-center justify-center text-[#9a3412] border border-[#fbd0a7]">
          <UtensilsCrossed className="size-5" />
        </div>
        <div>
          <h3
            id="assign-table-modal-title"
            className="text-base sm:text-lg font-black text-neutral-900"
          >
            Assign Table & Seat Party
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Allocate dining capacity for {guestName}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onClose}
        disabled={disabled}
        aria-label="Close dialog"
        className="size-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
