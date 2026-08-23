import { type ComponentProps, forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

export interface LabelProps extends ComponentProps<"label"> {
  error?: boolean;
}

const Label = forwardRef<HTMLLabelElement, LabelProps>(({ className, error, ...props }, ref) => {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: Generic reusable label component that uses htmlFor
    <label
      ref={ref}
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm font-medium leading-none select-none text-foreground/80 group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        error && "text-destructive",
        className,
      )}
      {...props}
    />
  );
});
Label.displayName = "Label";

export { Label };
