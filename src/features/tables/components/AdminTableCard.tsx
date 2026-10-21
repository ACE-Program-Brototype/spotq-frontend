import { Download, Eye, Pencil, Printer, Users } from "lucide-react";
import type { TableItem, TableStatus } from "../types/table.types";

const statusStyles: Record<TableStatus, string> = {
  AVAILABLE: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  OCCUPIED: "bg-sky-50 text-sky-700 ring-sky-200",
  PARTIAL_OCCUPIED: "bg-amber-50 text-amber-700 ring-amber-200",
  MAINTENANCE: "bg-slate-100 text-slate-600 ring-slate-200",
};

const statusLabels: Record<TableStatus, string> = {
  AVAILABLE: "Available",
  OCCUPIED: "Occupied",
  PARTIAL_OCCUPIED: "Partially occupied",
  MAINTENANCE: "Maintenance",
};

type AdminTableCardProps = {
  table: TableItem;
  onView: (table: TableItem) => void;
  onDownload: (table: TableItem) => void;
  onPrint: (table: TableItem) => void;
  onEdit: (table: TableItem) => void;
};

export function AdminTableCard({
  table,
  onView,
  onDownload,
  onPrint,
  onEdit,
}: AdminTableCardProps) {
  return (
    <article className="min-w-0 rounded-2xl border border-[#eee6e0] p-4">
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
      <div className="mt-4 flex items-center justify-around gap-1 border-t border-[#f1ebe6] pt-3">
        <button
          type="button"
          aria-label={`View table ${table.tableCode}`}
          title="View"
          onClick={() => onView(table)}
          className="rounded-lg p-2 text-[#727a73] hover:bg-[#f7f2ee] hover:text-[#9a3412]"
        >
          <Eye className="size-4" />
        </button>
        <button
          type="button"
          aria-label={`Download table ${table.tableCode}`}
          title="Download details"
          onClick={() => onDownload(table)}
          className="rounded-lg p-2 text-[#727a73] hover:bg-[#f7f2ee] hover:text-[#9a3412]"
        >
          <Download className="size-4" />
        </button>
        <button
          type="button"
          aria-label={`Print table ${table.tableCode}`}
          title="Print details"
          onClick={() => onPrint(table)}
          className="rounded-lg p-2 text-[#727a73] hover:bg-[#f7f2ee] hover:text-[#9a3412]"
        >
          <Printer className="size-4" />
        </button>
        <button
          type="button"
          aria-label={`Update status for table ${table.tableCode}`}
          title="Update status"
          onClick={() => onEdit(table)}
          className="rounded-lg p-2 text-[#727a73] hover:bg-[#f7f2ee] hover:text-[#9a3412]"
        >
          <Pencil className="size-4" />
        </button>
      </div>
    </article>
  );
}
