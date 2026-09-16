import { UserCheck, X } from "lucide-react";
import { StaffEditForm } from "@/features/staff/components/StaffEditForm";
import type { EditStaffModalProps } from "@/features/staff/types/staff-detail.types";

export function EditStaffModal({ isOpen, onClose, staff }: EditStaffModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-staff-modal-title"
    >
      <div className="relative w-full max-w-lg rounded-2xl bg-white border border-[#eddcd4] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#f3e6de] bg-[#fffcf9] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-[#fef3ec] flex items-center justify-center text-[#9a3412] border border-[#fae2d3]">
              <UserCheck className="size-4.5 text-[#e8631b]" />
            </div>
            <div>
              <h3
                id="edit-staff-modal-title"
                className="text-base font-bold text-neutral-900 leading-tight"
              >
                Edit Staff Information
              </h3>
              <p className="text-xs text-neutral-500">
                Update staff member's name and contact number
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Modal Body & Shared Form */}
        <div className="p-6 overflow-y-auto flex-1">
          <StaffEditForm staff={staff} onSuccess={onClose} onCancel={onClose} />
        </div>
      </div>
    </div>
  );
}
