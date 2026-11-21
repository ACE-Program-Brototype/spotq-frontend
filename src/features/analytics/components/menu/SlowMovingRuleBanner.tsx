import { Info } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface SlowMovingRuleBannerProps {
  className?: string;
  threshold?: number;
}

export function SlowMovingRuleBanner({ className, threshold = 3 }: SlowMovingRuleBannerProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 p-3.5 sm:p-4 rounded-xl border border-amber-200 bg-amber-50/60 text-xs text-amber-900 shadow-2xs",
        className,
      )}
    >
      <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-amber-200/80 text-amber-800 mt-0.5">
        <Info className="size-3.5" />
      </div>
      <div>
        <p className="font-bold text-amber-950">Slow-Moving Classification Rule</p>
        <p className="mt-0.5 text-amber-900/90 leading-relaxed">
          Dishes are classified as <span className="font-semibold text-rose-700">Zero Sales</span>{" "}
          if they are active in your menu catalog but had no orders in this period, and{" "}
          <span className="font-semibold text-amber-800">Low Volume</span> if sales were {threshold}{" "}
          or fewer units. Consider updating dish visibility, modifiers, or promotional pricing.
        </p>
      </div>
    </div>
  );
}
