import { Clock } from "lucide-react";

export interface EstimatedWaitChipProps {
  estimatedWaitMinutes: number | null;
}

export function EstimatedWaitChip({ estimatedWaitMinutes }: EstimatedWaitChipProps) {
  let label = "Calculating wait time...";
  if (typeof estimatedWaitMinutes === "number") {
    if (estimatedWaitMinutes <= 0) {
      label = "Table ready soon";
    } else if (estimatedWaitMinutes === 1) {
      label = "~1 min remaining";
    } else {
      label = `~${estimatedWaitMinutes} mins remaining`;
    }
  }

  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-stone-100/90 px-3 py-1.5 text-xs font-semibold text-stone-700 border border-stone-200">
      <Clock className="h-3.5 w-3.5 text-orange-600" />
      <span>{label}</span>
    </div>
  );
}
