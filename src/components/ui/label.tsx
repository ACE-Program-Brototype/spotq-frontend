import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface LabelProps extends React.ComponentProps<"label"> {
  error?: boolean;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, error, ...props }, ref) => {
    return (
      // biome-ignore lint/a11y/noLabelWithoutControl: Generic reusable label component that uses htmlFor
      <label
        ref={ref}
        className={cn(
          "text-sm font-medium leading-none select-none text-foreground/80",
          error && "text-destructive",
          className,
        )}
        {...props}
      />
    );
  },
);
Label.displayName = "Label";

export { Label };
