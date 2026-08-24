import { type ComponentProps, forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

export interface CheckboxProps extends Omit<ComponentProps<"input">, "type"> {}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({ className, ...props }, ref) => {
  return (
    <input
      type="checkbox"
      ref={ref}
      className={cn(
        "peer h-4 w-4 shrink-0 rounded border border-spotq-border text-spotq-orange bg-spotq-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-spotq-orange/50 disabled:cursor-not-allowed disabled:opacity-50 accent-spotq-orange cursor-pointer transition-all",
        className,
      )}
      {...props}
    />
  );
});
Checkbox.displayName = "Checkbox";

export { Checkbox };
