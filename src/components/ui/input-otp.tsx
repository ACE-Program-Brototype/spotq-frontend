import { OTPInput, OTPInputContext } from "input-otp";
import { Dot } from "lucide-react";
import { type ComponentProps, useContext } from "react";
import { cn } from "@/lib/utils/cn";

export function InputOTP({
  className,
  containerClassName,
  ...props
}: ComponentProps<typeof OTPInput>) {
  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cn("flex items-center gap-2 has-disabled:opacity-50", containerClassName)}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  );
}

export function InputOTPGroup({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn("flex items-center gap-2 sm:gap-3", className)}
      {...props}
    />
  );
}

export function InputOTPSlot({
  index,
  className,
  ...props
}: ComponentProps<"div"> & {
  index: number;
}) {
  const inputOTPContext = useContext(OTPInputContext);
  const slot = inputOTPContext?.slots[index];

  return (
    <div
      data-slot="input-otp-slot"
      data-active={slot?.isActive}
      className={cn(
        "relative flex h-12 w-10 sm:w-12 items-center justify-center border-b-2 border-border/80 bg-transparent text-xl font-bold text-foreground transition-all",
        "data-[active=true]:border-foreground data-[active=true]:ring-1 data-[active=true]:ring-ring/20",
        className,
      )}
      {...props}
    >
      {slot?.char}
      {slot?.hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-5 w-px animate-caret-blink bg-foreground duration-1000" />
        </div>
      )}
    </div>
  );
}

export function InputOTPSeparator({ ...props }: ComponentProps<"div">) {
  return (
    <div data-slot="input-otp-separator" role="presentation" aria-hidden="true" {...props}>
      <Dot className="size-4 text-muted-foreground" />
    </div>
  );
}
