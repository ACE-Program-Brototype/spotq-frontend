import { Check, Minus, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TABLE_STATUS } from "@/features/tables/constants/table.constants";
import type { TableItem } from "@/features/tables/types/table.types";

interface AssignTableCardProps {
  table: TableItem;
  isSelected: boolean;
  allocatedSeats?: number;
  isSubmitting?: boolean;
  onToggle: (table: TableItem) => void;
  onAdjustSeats: (tableId: string, delta: number, maxCapacity: number) => void;
}

export function AssignTableCard({
  table,
  isSelected,
  allocatedSeats = 0,
  isSubmitting = false,
  onToggle,
  onAdjustSeats,
}: AssignTableCardProps) {
  const availableCapacity = Math.max(0, table.capacity - (table.currentOccupancy || 0));
  const isMaintenance = table.status === TABLE_STATUS.MAINTENANCE;
  const isFullyOccupied = table.status === TABLE_STATUS.OCCUPIED || availableCapacity <= 0;
  const isSelectable = !isMaintenance && !isFullyOccupied;

  return (
    <div
      className={`relative rounded-xl border transition-all overflow-hidden ${
        isSelected
          ? "border-[#9a3412] bg-[#fffaf5] shadow-xs"
          : isSelectable
            ? "border-[#eddcd4] bg-white hover:border-[#fed7aa]"
            : "border-neutral-200 bg-neutral-50/60 opacity-60"
      }`}
    >
      {/* Selection Toggle Header Button */}
      <button
        type="button"
        onClick={() => isSelectable && onToggle(table)}
        disabled={!isSelectable || isSubmitting}
        aria-pressed={isSelected}
        className={`w-full p-3 text-left flex items-start justify-between gap-2 transition-colors ${
          isSelectable ? "cursor-pointer" : "cursor-not-allowed"
        }`}
      >
        <div className="flex items-center gap-2">
          {/* Selection Checkbox indicator */}
          <div
            className={`size-4.5 rounded-md flex items-center justify-center border transition-colors ${
              isSelected
                ? "bg-[#9a3412] border-[#9a3412] text-white"
                : "border-neutral-300 bg-white"
            }`}
          >
            {isSelected && <Check className="size-3" />}
          </div>

          <div>
            <span className="font-black text-sm text-neutral-900 block">
              Table {table.tableCode}
            </span>
            <span className="text-[11px] text-neutral-500 block">
              {table.sectionName || "Dining"}
            </span>
          </div>
        </div>

        {/* Status & Capacity Badge */}
        <div className="text-right">
          <Badge
            className={`text-[10px] font-bold ${
              isMaintenance
                ? "bg-neutral-200 text-neutral-700 border-neutral-300"
                : isFullyOccupied
                  ? "bg-red-50 text-red-700 border-red-200"
                  : table.status === TABLE_STATUS.PARTIAL_OCCUPIED
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : "bg-emerald-50 text-emerald-700 border-emerald-200"
            }`}
          >
            {isMaintenance
              ? "Maintenance"
              : isFullyOccupied
                ? "Full"
                : `${availableCapacity} Avail`}
          </Badge>
          <span className="text-[10px] text-neutral-400 block mt-0.5">Cap: {table.capacity}</span>
        </div>
      </button>

      {/* Allocated Seat Stepper for Selected Table */}
      {isSelected && (
        <div className="px-3 pb-3 pt-2 border-t border-[#f3e6de] flex items-center justify-between text-xs">
          <span className="text-neutral-600 font-medium">Allocate seats:</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onAdjustSeats(table.id, -1, availableCapacity)}
              disabled={allocatedSeats <= 1 || isSubmitting}
              className="size-6 rounded-md bg-white border border-[#eddcd4] hover:bg-[#faf7f5] flex items-center justify-center text-neutral-700 disabled:opacity-40"
              aria-label={`Decrease seats for table ${table.tableCode}`}
            >
              <Minus className="size-3" />
            </button>

            <span className="font-black text-xs text-[#9a3412] min-w-5 text-center">
              {allocatedSeats}
            </span>

            <button
              type="button"
              onClick={() => onAdjustSeats(table.id, 1, availableCapacity)}
              disabled={allocatedSeats >= availableCapacity || isSubmitting}
              className="size-6 rounded-md bg-white border border-[#eddcd4] hover:bg-[#faf7f5] flex items-center justify-center text-neutral-700 disabled:opacity-40"
              aria-label={`Increase seats for table ${table.tableCode}`}
            >
              <Plus className="size-3" />
            </button>
            <span className="text-[11px] text-neutral-400">/ {availableCapacity}</span>
          </div>
        </div>
      )}
    </div>
  );
}
