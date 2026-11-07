import type { ClipboardEvent, KeyboardEvent, MutableRefObject } from "react";

export interface OtpSlotInputsProps {
  digits: string[];
  slotIds: string[];
  inputRefs: MutableRefObject<Array<HTMLInputElement | null>>;
  disabled: boolean;
  hasError: boolean;
  onChange: (index: number, val: string) => void;
  onKeyDown: (index: number, e: KeyboardEvent<HTMLInputElement>) => void;
  onPaste: (e: ClipboardEvent<HTMLInputElement>) => void;
}

export function OtpSlotInputs({
  digits,
  slotIds,
  inputRefs,
  disabled,
  hasError,
  onChange,
  onKeyDown,
  onPaste,
}: OtpSlotInputsProps) {
  return (
    <div className="mt-5 flex justify-between gap-2" onPaste={onPaste}>
      {slotIds.map((slotId) => {
        const index = Number(slotId.replace("otp-digit-", "")) - 1;
        const digit = digits[index] ?? "";

        return (
          <input
            key={slotId}
            ref={(el: HTMLInputElement | null) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            disabled={disabled}
            onChange={(e) => onChange(index, e.target.value)}
            onKeyDown={(e) => onKeyDown(index, e)}
            aria-label={`Digit ${index + 1} of OTP`}
            aria-invalid={hasError}
            className={`h-11 w-full rounded-md border text-center text-lg font-semibold text-neutral-900 focus:outline-none focus:ring-2 disabled:bg-neutral-50 disabled:text-neutral-400 ${
              hasError
                ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                : "border-neutral-300 focus:border-orange-500 focus:ring-orange-100"
            }`}
          />
        );
      })}
    </div>
  );
}
