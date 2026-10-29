import { Phone, User } from "lucide-react";
import type { UseFormRegister } from "react-hook-form";
import { Input } from "@/components/ui/input";
import type { WalkInFormData } from "../schemas/walk-in.schema";

interface WalkInGuestFieldsProps {
  register: UseFormRegister<WalkInFormData>;
  isSubmitting: boolean;
  nameError?: string;
  phoneError?: string;
}

export function WalkInGuestFields({
  register,
  isSubmitting,
  nameError,
  phoneError,
}: WalkInGuestFieldsProps) {
  return (
    <>
      <div className="space-y-1.5">
        <label
          htmlFor="guestName"
          className="text-xs font-bold text-neutral-800 flex items-center gap-1"
        >
          <User className="size-3.5 text-[#9a3412]" />
          Guest Name <span className="text-red-500">*</span>
        </label>
        <Input
          id="guestName"
          placeholder="e.g. David Miller"
          autoFocus
          disabled={isSubmitting}
          className="h-10 text-sm border-[#eddcd4] focus-visible:border-[#9a3412] focus-visible:ring-[#fed7aa]"
          {...register("guestName")}
        />
        {nameError && <p className="text-xs font-medium text-red-600">{nameError}</p>}
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="guestPhone"
          className="text-xs font-bold text-neutral-800 flex items-center justify-between"
        >
          <span className="flex items-center gap-1">
            <Phone className="size-3.5 text-[#9a3412]" />
            Phone Number <span className="text-red-500">*</span>
          </span>
          <span className="text-[11px] font-normal text-neutral-500">10-digit mobile number</span>
        </label>
        <div className="relative flex rounded-xl border border-[#eddcd4] focus-within:border-[#9a3412] focus-within:ring-2 focus-within:ring-[#fed7aa] bg-white overflow-hidden transition-all">
          <span className="inline-flex items-center px-3 bg-[#faf7f5] text-xs font-bold text-neutral-700 border-r border-[#eddcd4] select-none">
            +91
          </span>
          <input
            id="guestPhone"
            type="tel"
            placeholder="9876543210"
            maxLength={14}
            disabled={isSubmitting}
            className="flex-1 h-10 px-3 text-sm bg-transparent outline-none disabled:opacity-50 text-neutral-900 placeholder:text-neutral-400"
            {...register("guestPhone")}
          />
        </div>
        {phoneError && <p className="text-xs font-medium text-red-600">{phoneError}</p>}
      </div>
    </>
  );
}
