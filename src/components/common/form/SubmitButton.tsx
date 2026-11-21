import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

export interface SubmitButtonProps extends React.ComponentProps<typeof Button> {
  isLoading?: boolean;
  loadingText?: ReactNode;
}

export function SubmitButton({
  children,
  isLoading = false,
  loadingText,
  disabled,
  className,
  ...props
}: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      className={className}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="size-4 animate-spin shrink-0" aria-hidden="true" />
          <span>{loadingText || children}</span>
        </>
      ) : (
        children
      )}
    </Button>
  );
}
