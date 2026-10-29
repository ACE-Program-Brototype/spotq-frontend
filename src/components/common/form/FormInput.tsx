import { type ComponentProps, forwardRef, type ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";

export interface FormInputProps extends ComponentProps<"input"> {
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  error?: boolean | string | undefined;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      className,
      leadingIcon,
      trailingIcon,
      error,
      id,
      "aria-describedby": ariaDescribedBy,
      ...props
    },
    ref,
  ) => {
    const hasError = Boolean(error);
    const errorId = id ? `${id}-error` : undefined;
    const combinedDescribedBy =
      [ariaDescribedBy, hasError ? errorId : undefined].filter(Boolean).join(" ") || undefined;

    if (!leadingIcon && !trailingIcon) {
      return (
        <Input
          ref={ref}
          id={id}
          aria-invalid={hasError}
          aria-describedby={combinedDescribedBy}
          className={cn(
            hasError && "border-destructive focus-visible:ring-destructive/30",
            className,
          )}
          {...props}
        />
      );
    }

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
          aria-invalid={hasError}
          aria-describedby={combinedDescribedBy}
          className={cn(
            leadingIcon && "pl-9",
            trailingIcon && "pr-9",
            hasError && "border-destructive focus-visible:ring-destructive/30",
            className,
          )}
          {...props}
        />

        {trailingIcon && (
          <span className="absolute right-3 flex items-center text-muted-foreground [&_svg]:size-4">
            {trailingIcon}
          </span>
        )}
      </div>
    );
  },
);

FormInput.displayName = "FormInput";
