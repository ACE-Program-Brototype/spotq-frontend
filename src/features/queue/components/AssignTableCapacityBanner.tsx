import { AlertTriangle, CheckCircle2, Table as TableIcon } from "lucide-react";

interface AssignTableCapacityBannerProps {
  isCapacitySatisfied: boolean;
  totalAssignedSeats: number;
  partySize: number;
  selectedTablesCount: number;
  remainingNeeded: number;
}

export function AssignTableCapacityBanner({
  isCapacitySatisfied,
  totalAssignedSeats,
  partySize,
  selectedTablesCount,
  remainingNeeded,
}: AssignTableCapacityBannerProps) {
  return (
    <div
      className={`rounded-xl border p-3.5 text-xs flex items-center justify-between gap-3 transition-colors ${
        isCapacitySatisfied
          ? "border-emerald-200 bg-emerald-50/70 text-emerald-900"
          : selectedTablesCount === 0
            ? "border-[#eddcd4] bg-neutral-50 text-neutral-700"
            : "border-amber-200 bg-amber-50/70 text-amber-900"
      }`}
    >
      <div className="flex items-center gap-2.5">
        {isCapacitySatisfied ? (
          <CheckCircle2 className="size-4.5 text-emerald-600 shrink-0" />
        ) : selectedTablesCount === 0 ? (
          <TableIcon className="size-4.5 text-neutral-500 shrink-0" />
        ) : (
          <AlertTriangle className="size-4.5 text-amber-600 shrink-0" />
        )}
        <div>
          <span className="font-bold">
            {isCapacitySatisfied
              ? "Capacity Requirement Satisfied"
              : selectedTablesCount === 0
                ? "Select Table(s) to Assign"
                : "Insufficient Capacity Selected"}
          </span>
          <p className="text-[11px] opacity-85 mt-0.5">
            {isCapacitySatisfied
              ? `${totalAssignedSeats} seats allocated across ${selectedTablesCount} table${
                  selectedTablesCount > 1 ? "s" : ""
                } (Required: ${partySize})`
              : selectedTablesCount === 0
                ? `Choose one or more available tables to accommodate party size of ${partySize}.`
                : `Need ${remainingNeeded} more seat${
                    remainingNeeded > 1 ? "s" : ""
                  } to accommodate ${partySize} guests.`}
          </p>
        </div>
      </div>

      <div className="text-right font-black text-sm shrink-0">
        <span className={isCapacitySatisfied ? "text-emerald-700" : "text-[#9a3412]"}>
          {totalAssignedSeats}
        </span>
        <span className="text-neutral-400 font-semibold"> / {partySize}</span>
      </div>
    </div>
  );
}

