import { type ComponentProps, forwardRef, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export interface InputProps extends ComponentProps<"input"> {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  error?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, leftIcon, rightIcon, error, ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        {leftIcon && (
          <div className="absolute left-3.5 flex items-center text-muted-foreground [&_svg]:size-5">
            {leftIcon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            "flex h-12 w-full rounded-xl border bg-spotq-cream text-sm text-foreground transition-all placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-spotq-orange/50 disabled:cursor-not-allowed disabled:opacity-50",
            leftIcon ? "pl-11" : "pl-4",
            rightIcon ? "pr-11" : "pr-4",
            error
              ? "border-destructive focus-visible:ring-destructive/30"
              : "border-spotq-border hover:border-spotq-orange/30 focus-visible:border-spotq-orange",
            className,
          )}
          ref={ref}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3.5 flex items-center text-muted-foreground [&_svg]:size-5">
            {rightIcon}
          </div>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
