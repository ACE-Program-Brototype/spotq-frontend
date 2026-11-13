import { Phone, User } from "lucide-react";
import type { UseFormRegister } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { COUNTRY_DIAL_CODES } from "../constants/queue.constants";
import type { JoinQueueFormData } from "../schemas/join-queue.schema";

interface JoinQueueGuestFieldsProps {
  register: UseFormRegister<JoinQueueFormData>;
  isSubmitting: boolean;
  nameError?: string;
  phoneError?: string;
  countryCode: string;
}

export function JoinQueueGuestFields({
  register,
  isSubmitting,
  nameError,
  phoneError,
  countryCode,
}: JoinQueueGuestFieldsProps) {
  return (
    <>
      {/* Guest Name Field */}
      <div className="space-y-1 sm:space-y-1.5">
        <label
          htmlFor="guestName"
          className="text-xs font-bold text-neutral-800 flex items-center gap-1"
        >
          <User className="size-3 sm:size-3.5 text-orange-600" />
          Guest Name <span className="text-red-500">*</span>
        </label>
        <Input
          id="guestName"
          placeholder="e.g. Sarah Jenkins"
          disabled={isSubmitting}
          className="h-9 sm:h-10 text-xs sm:text-sm rounded-lg sm:rounded-xl border-neutral-200 focus-visible:border-orange-500 focus-visible:ring-orange-200"
          {...register("guestName")}
        />
        {nameError && <p className="text-xs font-medium text-red-600">{nameError}</p>}
      </div>

      {/* Phone Number Field with Country Selection */}
      <div className="space-y-1 sm:space-y-1.5">
        <label
          htmlFor="phone"
          className="text-xs font-bold text-neutral-800 flex items-center justify-between"
        >
          <span className="flex items-center gap-1">
            <Phone className="size-3 sm:size-3.5 text-orange-600" />
            Phone Number <span className="text-red-500">*</span>
          </span>
          <span className="text-[10px] sm:text-[11px] font-normal text-neutral-500">
            For live alerts
          </span>
        </label>

        <div className="flex gap-1.5 sm:gap-2">
          {/* Country Selection */}
          <select
            id="countryCode"
            aria-label="Country Dial Code"
            disabled={isSubmitting}
            {...register("countryCode")}
            className="h-9 sm:h-10 rounded-lg sm:rounded-xl border border-neutral-200 bg-white px-2 sm:px-2.5 text-xs font-semibold text-neutral-800 shadow-2xs focus-visible:border-orange-500 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-orange-200 disabled:opacity-60 cursor-pointer"
          >
            {COUNTRY_DIAL_CODES.map((item) => (
              <option key={item.code} value={item.code}>
                {item.flag} {item.code}
              </option>
            ))}
          </select>

          {/* Local Phone Input */}
          <div className="relative flex-1">
            <Input
              id="phone"
              type="tel"
              placeholder={countryCode === "+91" ? "10-digit mobile" : "Phone number"}
              disabled={isSubmitting}
              className="h-9 sm:h-10 text-xs sm:text-sm rounded-lg sm:rounded-xl border-neutral-200 focus-visible:border-orange-500 focus-visible:ring-orange-200"
              {...register("phone")}
            />
          </div>
        </div>

        {phoneError && <p className="text-xs font-medium text-red-600">{phoneError}</p>}
      </div>
    </>
  );
}
