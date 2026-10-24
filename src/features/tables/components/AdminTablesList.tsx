import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RESTAURANT_ROUTES } from "@/app/router/routes.constants";
import { Pagination } from "@/components/common/Pagination";
import { Button } from "@/components/ui/button";
import { ADMIN_TABLE_LIMIT } from "../constants/table.constants";
import type { TableItem, TableStatus } from "../types/table.types";
import { AdminTableCard } from "./AdminTableCard";
import { TableSkeletonGrid } from "./TableSkeletonGrid";
import { TableStatusModal } from "./TableStatusModal";

const statusOptions: { value: "ALL" | TableStatus; label: string }[] = [
  { value: "ALL", label: "All tables" },
  { value: "AVAILABLE", label: "Available" },
  { value: "OCCUPIED", label: "Occupied" },
  { value: "PARTIAL_OCCUPIED", label: "Partially occupied" },
  { value: "MAINTENANCE", label: "Maintenance" },
];

type AdminTablesListProps = {
  restaurantId: string;
  tables: TableItem[];
  total: number;
  totalPages: number;
  page: number;
  onPageChange: (page: number) => void;
  status: "ALL" | TableStatus;
  onStatusChange: (status: "ALL" | TableStatus) => void;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  onRetry: () => void;
};

export function AdminTablesList({
  restaurantId,
  tables,
  total,
  totalPages,
  page,
  onPageChange,
  status,
  onStatusChange,
  isLoading,
  isFetching,
  isError,
  onRetry,
}: AdminTablesListProps) {
  const navigate = useNavigate();
  // const [viewTable, setViewTable] = useState<TableItem | null>(null);
  const [selectedTable, setSelectedTable] = useState<TableItem | null>(null);

  const downloadTable = (_table: TableItem) => {
    console.log(`[ERROR]: Download not implemented`);
  };

  const printTable = (_table: TableItem) => {
    console.log(`[ERROR]: Print not implemented`);
  };

  const renderTableContent = () => {
    if (!restaurantId) {
      return (
        <p className="p-12 text-center text-sm text-[#858b85]">
          No restaurant is associated with this account.
        </p>
      );
    }

    if (isLoading) {
      return (
        <p className="p-12 text-center text-sm text-[#858b85]">
          <TableSkeletonGrid />
        </p>
      );
    }

    if (isError) {
      return (
        <div className="p-12 text-center" role="alert">
          <p className="text-sm text-red-700">Unable to load tables. Please try again.</p>
          <Button variant="outline" className="mt-3" onClick={onRetry}>
            Retry
          </Button>
        </div>
      );
    }

    if (tables.length === 0) {
      return (
        <p className="p-12 text-center text-sm text-[#858b85]">No tables match your filters.</p>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-3 p-3 min-[420px]:grid-cols-2 sm:p-5 lg:grid-cols-3 xl:grid-cols-4">
        {tables.map((table) => (
          <AdminTableCard
            key={table.id}
            table={table}
            onView={(table) => navigate(RESTAURANT_ROUTES.TABLE.VIEW(table.id))}
            onDownload={downloadTable}
            onPrint={printTable}
            onEdit={setSelectedTable}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <section className="overflow-hidden rounded-2xl border border-[#ede4de] bg-white shadow-[0_2px_10px_rgba(65,44,31,.03)]">
        <div className="flex flex-col gap-3 border-b border-[#f0e9e4] p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div>
            <h2 className="font-semibold text-[#282d29]">
              All tables{" "}
              <span className="ml-1 rounded-full bg-[#f7f2ee] px-2 py-0.5 text-xs text-[#766d66]">
                {total}
              </span>
            </h2>
            <p className="mt-1 text-xs text-[#858b85]">
              Select a table to see its details and take action.
            </p>
          </div>
          <div className="flex w-full gap-2 sm:w-auto">
            <div className="relative w-full sm:w-auto">
              <select
                aria-label="Filter tables"
                value={status}
                onChange={(event) => onStatusChange(event.target.value as "ALL" | TableStatus)}
                className="h-9 w-full appearance-none rounded-xl border border-[#e8e2dd] bg-white py-1 pl-3 pr-8 text-sm text-[#4d554e] outline-none focus:ring-2 focus:ring-orange-200 sm:w-auto"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-[#7c817c]" />
            </div>
          </div>
        </div>

        {renderTableContent()}

        {!isLoading && !isError && totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={total}
            pageSize={ADMIN_TABLE_LIMIT}
            onPageChange={onPageChange}
            disabled={isFetching}
            theme="restaurant"
          />
        )}
      </section>

      <TableStatusModal
        table={selectedTable}
        isOpen={Boolean(selectedTable)}
        onClose={() => setSelectedTable(null)}
        restaurantId={restaurantId}
      />
    </>
  );
}
