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
    <div className="inline-flex items-center gap-1.5 rounded-full bg-[#fcf5f0] px-2.5 py-1 text-xs font-semibold text-[#9a3412] border border-[#eddcd4]">
      <Clock className="h-3.5 w-3.5 text-[#e8631b]" />
      <span>{label}</span>
    </div>
  );
}
