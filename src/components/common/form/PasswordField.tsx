import { Eye, EyeOff } from "lucide-react";
import { type ComponentProps, forwardRef, type ReactNode, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";

export interface PasswordFieldProps extends Omit<ComponentProps<"input">, "type"> {
  leadingIcon?: ReactNode;
  error?: boolean | string | undefined;
}

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  (
    { className, leadingIcon, error, id, "aria-describedby": ariaDescribedBy, disabled, ...props },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const hasError = Boolean(error);
    const errorId = id ? `${id}-error` : undefined;
    const combinedDescribedBy =
      [ariaDescribedBy, hasError ? errorId : undefined].filter(Boolean).join(" ") || undefined;

    return (
      <div className="relative flex items-center">
        {leadingIcon && (
          <span className="pointer-events-none absolute left-3 flex items-center text-muted-foreground [&_svg]:size-4">
            {leadingIcon}
          </span>
        )}

        <Input
          ref={ref}
          id={id}
          type={showPassword ? "text" : "password"}
          aria-invalid={hasError}
          aria-describedby={combinedDescribedBy}
          disabled={disabled}
          className={cn(
            leadingIcon && "pl-9",
            "pr-10",
            hasError && "border-destructive focus-visible:ring-destructive/30",
            className,
          )}
          {...props}
        />

        <button
          type="button"
          disabled={disabled}
          onClick={() => setShowPassword((prev) => !prev)}
          aria-label={showPassword ? "Hide password" : "Show password"}
          className="absolute right-3 flex items-center text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xs transition-colors disabled:pointer-events-none disabled:opacity-50"
        >
          {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
    );
  },
);

PasswordField.displayName = "PasswordField";
