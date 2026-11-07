import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils/cn";
import { FormError } from "./FormError";

export interface FormFieldProps {
  id?: string;
  htmlFor?: string;
  label?: ReactNode;
  labelAction?: ReactNode;
  labelClassName?: string;
  error?: string | null | undefined;
  hint?: ReactNode;
  hintId?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}

export function FormField({
  id,
  htmlFor,
  label,
  labelAction,
  labelClassName,
  error,
  hint,
  hintId,
  required,
  className,
  children,
}: FormFieldProps) {
  const targetId = htmlFor || id;
  const errorId = targetId ? `${targetId}-error` : undefined;
  const effectiveHintId = hintId || (targetId ? `${targetId}-hint` : undefined);

  return (
    <div data-slot="form-field" className={cn("space-y-2", className)}>
      {(label || labelAction) && (
        <div className="flex items-center justify-between">
          {label && (
            <Label htmlFor={targetId} error={Boolean(error)} className={labelClassName}>
              {label}
              {required && <span className="text-destructive ml-0.5">*</span>}
            </Label>
          )}
          {labelAction}
        </div>
      )}

      {children}

      {hint && !error && (
        <p id={effectiveHintId} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}

      {error && <FormError id={errorId} message={error} />}
    </div>
  );
}
