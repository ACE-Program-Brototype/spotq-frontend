import { Users } from "lucide-react";
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

  return (
    <button
      type="button"
      onClick={() => onClick(table)}
      aria-label={`Table ${table.tableCode}, ${config.label}, ${occupancyText}`}
      className={cn(
        "group relative flex flex-col justify-between rounded-2xl p-3.5 sm:p-4 bg-white border transition-all duration-200 cursor-pointer select-none text-left w-full min-w-0 overflow-hidden",
        "shadow-2xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0",
        config.cardBgClass,
        config.cardBorderClass,
        config.topBorderClass,
        className,
      )}
    >
      {/* Top Row: Table Code + Status Badge */}
      <div className="flex items-center justify-between gap-1.5 mb-3 w-full min-w-0">
        <h3 className="text-xl sm:text-2xl font-black tracking-tight text-neutral-800 group-hover:text-neutral-950 transition-colors shrink-0">
          {table.tableCode}
        </h3>
        <TableStatusBadge status={table.status} size="sm" useShortLabel />
      </div>

      {/* Bottom Row: Capacity/Occupancy */}
      <div className="flex items-center text-xs font-semibold text-neutral-600 pt-1 w-full min-w-0">
        <div className="flex items-center gap-1.5 text-neutral-700 shrink-0">
          <Users className="size-3.5 sm:size-4 text-neutral-500 shrink-0" />
          <span>{occupancyText}</span>
        </div>
      </div>
    </button>
  );
}
