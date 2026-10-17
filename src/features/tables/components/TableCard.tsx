import { Clock, Users } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { TABLE_STATUS_CONFIG } from "../constants/table.constants";
import type { TableItem } from "../types/table.types";
import { TableStatusBadge } from "./TableStatusBadge";

interface TableCardProps {
  table: TableItem;
  onClick: (table: TableItem) => void;
  className?: string;
}

export function TableCard({ table, onClick, className }: TableCardProps) {
  const config = TABLE_STATUS_CONFIG[table.status] || TABLE_STATUS_CONFIG.AVAILABLE;

  // Format capacity or occupancy display
  const isOccupiedOrPartial = table.status === "OCCUPIED" || table.status === "PARTIAL_OCCUPIED";

  const occupancyText = isOccupiedOrPartial
    ? `${table.currentOccupancy || 0}/${table.capacity}`
    : `${table.capacity} Seats`;

  const formatDuration = (mins?: number): string | null => {
    if (!mins || mins <= 0) return null;
    const hours = Math.floor(mins / 60);
    const remMins = mins % 60;
    if (hours > 0 && remMins > 0) return `${hours}h ${remMins}m`;
    if (hours > 0) return `${hours}h`;
    return `${remMins}m`;
  };

  const durationStr = formatDuration(table.occupiedDurationMinutes);

  return (
    <button
      type="button"
      onClick={() => onClick(table)}
      aria-label={`Table ${table.tableCode}, ${config.label}, ${occupancyText}`}
      className={cn(
        "group relative flex flex-col justify-between rounded-2xl p-4.5 bg-white border transition-all duration-200 cursor-pointer select-none text-left w-full",
        "shadow-2xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0",
        config.cardBgClass,
        config.cardBorderClass,
        config.topBorderClass,
        className,
      )}
    >
      {/* Top Row: Table Code + Status Badge */}

      <div className="flex items-center justify-between gap-2 mb-4">
        <h3 className="text-2xl font-black tracking-tight text-neutral-800 group-hover:text-neutral-950 transition-colors">
          {table.tableCode}
        </h3>
        <TableStatusBadge status={table.status} size="sm" />
      </div>

      {/* Bottom Row: Capacity/Occupancy + Time Meta */}
      <div className="flex items-center justify-between text-xs font-semibold text-neutral-600 pt-1">
        <div className="flex items-center gap-1.5 text-neutral-700">
          <Users className="size-4 text-neutral-500 shrink-0" />
          <span>{occupancyText}</span>
        </div>

        {/* Time elapsed or reservation */}
        {durationStr && (
          <div className="flex items-center gap-1 text-[11px] font-medium text-neutral-500">
            <Clock className="size-3 text-neutral-400" />
            <span>{durationStr}</span>
          </div>
        )}

        {table.reservationTime && (
          <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
            {table.reservationTime}
          </span>
        )}
      </div>
    </button>
  );
}
