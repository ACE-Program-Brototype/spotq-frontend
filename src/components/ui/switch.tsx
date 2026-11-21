import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean;
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, checked, disabled, onChange, ...props }, ref) => {
    return (
      <label
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-within:outline-none focus-within:ring-2 focus-within:ring-[#e8631b] focus-within:ring-offset-2",
          checked ? "bg-[#e8631b]" : "bg-neutral-200",
          disabled && "cursor-not-allowed opacity-60",
          className,
        )}
      >
        <input
          type="checkbox"
          className="sr-only"
          ref={ref}
          checked={checked}
          disabled={disabled}
          onChange={onChange}
          {...props}
        />
        <span
          className={cn(
            "pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-xs ring-0 transition-transform duration-200 ease-in-out",
            checked ? "translate-x-5" : "translate-x-0",
          )}
        />
      </label>
    );
  },
);
Switch.displayName = "Switch";

export { Switch };
