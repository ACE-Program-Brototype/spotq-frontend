import { UserPlus, X } from "lucide-react";

interface WalkInModalHeaderProps {
  onClose: () => void;
  isSubmitting: boolean;
}

export function WalkInModalHeader({ onClose, isSubmitting }: WalkInModalHeaderProps) {
  return (
    <div className="flex items-center justify-between px-6 py-4.5 border-b border-[#eddcd4] bg-[#fffcf9]">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-xl bg-[#fed7aa]/50 flex items-center justify-center text-[#9a3412] border border-[#fbd0a7]">
          <UserPlus className="size-5 text-[#9a3412]" />
        </div>
        <div>
          <h3 id="walkin-modal-title" className="text-lg font-bold text-neutral-900 leading-tight">
            Add to Queue
          </h3>
          <p className="text-xs text-[#756c66] mt-0.5">
            Register arriving walk-in guest to the waitlist.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onClose}
        disabled={isSubmitting}
        className="rounded-lg p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-[#eddcd4]/40 transition-colors disabled:opacity-50"
        aria-label="Close modal"
      >
        <X className="size-5" />
      </button>
    </div>
  );
}
