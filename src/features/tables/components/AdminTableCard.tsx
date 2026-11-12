import { Clock, Eye, Pencil, Users } from "lucide-react";
import { statusLabels, statusStyles } from "../constants/table.constants";
import type { TableItem } from "../types/table.types";

type AdminTableCardProps = {
  /** The table data item */
  table: TableItem;
  /** Navigate to table detail view */
  onView: (table: TableItem) => void;
  /** Open staff table status update modal (AVAILABLE / MAINTENANCE) */
  onEdit: (table: TableItem) => void;
  /** Optional callback to open the EditTableModal */
  onEditDetails?: (table: TableItem) => void;
};

/**
 * AdminTableCard
 *
 * Renders an administrative card tile for a restaurant dining table.
 */
export function AdminTableCard({ table, onView, onEdit, onEditDetails }: AdminTableCardProps) {
  return (
    <article className="min-w-0 rounded-2xl border border-[#eee6e0] p-4 transition-shadow hover:shadow-xs">
      {/* Table code and operational status */}
      <div className="flex min-w-0 items-start justify-between gap-2">
        <span
          title={table.tableCode}
          className="flex h-10 min-w-0 max-w-[45%] items-center justify-center rounded-xl bg-[#f8f4f0] px-2 text-sm font-bold text-[#383b37]"
        >
          <span className="min-w-0 truncate">{table.tableCode}</span>
        </span>

        <span
          className={`shrink-0 rounded-full px-2 py-1 text-center text-[10px] font-semibold ring-1 ring-inset ${statusStyles[table.status]}`}
        >
          {statusLabels[table.status]}
        </span>
      </div>

      {/* Table label and capacity */}
      <p
        title={`Table ${table.tableCode}`}
        className="mt-4 min-w-0 truncate font-semibold text-[#282d29]"
      >
        Table {table.tableCode}
      </p>

      <p className="mt-1 flex min-w-0 items-center gap-1.5 overflow-hidden whitespace-nowrap text-xs text-[#838a83]">
        <Users className="size-3.5" />
        <span className="shrink-0">{table.capacity} seats</span>
        <span className="shrink-0 text-[#c3b9b1]">·</span>

        {table.currentOccupancy > 0 && (
          <>
            <span className="shrink-0">{table.currentOccupancy} guests</span>
            <span className="shrink-0 text-[#c3b9b1]">·</span>
          </>
        )}

        <span className="min-w-0 truncate" title={table.sectionName || "Dining"}>
          {table.sectionName || "Dining"}
        </span>
      </p>

      {/* Card action buttons */}
      <div
        className={`mt-4 grid gap-1.5 border-t border-[#f1ebe6] pt-3 ${
          onEditDetails ? "grid-cols-3" : "grid-cols-2"
        }`}
      >
        <button
          type="button"
          aria-label={`View table ${table.tableCode}`}
          onClick={() => onView(table)}
          className="flex min-h-9 items-center justify-center gap-1.5 rounded-xl border border-[#eee6e0] bg-white px-2 text-xs font-semibold text-[#59615a] transition-colors hover:border-[#e7cfc1] hover:bg-[#fbf6f2] hover:text-[#9a3412] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c47b55]"
        >
          <Eye className="size-3.5 shrink-0" aria-hidden="true" />
          View
        </button>

        <button
          type="button"
          aria-label={`Update status for table ${table.tableCode}`}
          onClick={() => onEdit(table)}
          className="flex min-h-9 min-w-0 items-center justify-center gap-1.5 rounded-xl border border-[#eee6e0] bg-white px-2 text-xs font-semibold text-[#59615a] whitespace-nowrap transition-colors hover:border-[#e7cfc1] hover:bg-[#fbf6f2] hover:text-[#9a3412] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c47b55]"
        >
          <Clock className="size-3.5 shrink-0" aria-hidden="true" />
          Status
        </button>

        {onEditDetails && (
          <button
            type="button"
            aria-label={`Edit details for table ${table.tableCode}`}
            onClick={() => onEditDetails(table)}
            className="flex min-h-9 min-w-0 items-center justify-center gap-1.5 rounded-xl border border-[#eee6e0] bg-white px-2 text-xs font-semibold text-[#59615a] whitespace-nowrap transition-colors hover:border-[#e7cfc1] hover:bg-[#fbf6f2] hover:text-[#9a3412] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c47b55]"
          >
            <Pencil className="size-3.5 shrink-0" aria-hidden="true" />
            Edit
          </button>
        )}
      </div>
    </article>
  );
}
