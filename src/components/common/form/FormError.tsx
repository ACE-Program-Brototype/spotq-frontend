import type { ComponentProps } from "react";
import { cn } from "@/lib/utils/cn";

export interface FormErrorProps extends ComponentProps<"p"> {
  message?: string | null | undefined;
}

export function FormError({ message, className, id, ...props }: FormErrorProps) {
  if (!message) return null;

  return (
    <p
      id={id}
      role="alert"
      data-slot="form-error"
      className={cn("text-xs font-medium text-destructive", className)}
      {...props}
    >
      {message}
    </p>
  );
}
