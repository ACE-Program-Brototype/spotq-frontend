import { Armchair, Check, Clock3, Users } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { AdminTablesList } from "../components/AdminTablesList";
import { ADMIN_TABLE_LIMIT } from "../constants/table.constants";
import { useRestaurantAdminTables } from "../hooks/useRestaurantAdminTables";
import type { TableStatus } from "../types/table.types";

export default function RestaurantTablePage() {
  const restaurantId = useAuthStore((state) => state.user?.restaurantId || "");
  const [status, setStatus] = useState<"ALL" | TableStatus>("ALL");
  const [page, setPage] = useState(1);
  const tablesQuery = useRestaurantAdminTables(restaurantId, {
    page,
    limit: ADMIN_TABLE_LIMIT,
    status,
  });
  const { tables, stats, total } = tablesQuery;
  const totalPages = Math.max(1, Math.ceil(total / ADMIN_TABLE_LIMIT));
  const occupiedCount =
    stats?.occupied ??
    tables.filter((table) => table.status === "OCCUPIED" || table.status === "PARTIAL_OCCUPIED")
      .length;
  const availableCount =
    stats?.available ?? tables.filter((table) => table.status === "AVAILABLE").length;
  const maintenanceCount =
    stats?.maintenance ?? tables.filter((table) => table.status === "MAINTENANCE").length;

  const summary = [
    ["Total tables", stats?.totalTables ?? total, Armchair, "#f4eee9"],
    ["Occupied", occupiedCount, Users, "#eaf5fb"],
    ["Available", availableCount, Check, "#eaf6ee"],
    ["Maintenance", maintenanceCount, Clock3, "#f1f2f4"],
  ] as const;

  return (
    <main className="mx-auto max-w-7xl space-y-5 px-3 pb-8 sm:space-y-7 sm:px-5 sm:pb-10">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.16em] text-[#b4532a]">
            Floor management
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#202522] sm:text-3xl">
            Tables
          </h1>
          <p className="mt-1 text-sm text-[#778078]">
            Manage your seating, table status, and guest sessions.
          </p>
        </div>
      </header>

      <section className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
        {summary.map(([label, value, Icon, color]) => (
          <div
            key={label}
            className="flex min-w-0 items-center gap-2.5 rounded-2xl border border-[#ede4de] bg-white p-3 shadow-[0_2px_10px_rgba(65,44,31,.03)] sm:gap-3 sm:p-5"
          >
            <div
              className="flex size-9 shrink-0 items-center justify-center rounded-xl sm:size-11"
              style={{ backgroundColor: color }}
            >
              <Icon className="size-5 text-[#51483f]" />
            </div>
            <div>
              <p className="text-[11px] font-medium leading-tight text-[#858b85] sm:text-xs">
                {label}
              </p>
              <p className="mt-0.5 text-xl font-bold text-[#252a26] sm:text-2xl">{value}</p>
            </div>
          </div>
        ))}
      </section>

      <AdminTablesList
        restaurantId={restaurantId}
        tables={tables}
        total={total}
        totalPages={totalPages}
        page={page}
        onPageChange={setPage}
        status={status}
        onStatusChange={(status) => {
          setStatus(status);
          setPage(1);
        }}
        isLoading={tablesQuery.isLoading}
        isFetching={tablesQuery.isFetching}
        isError={tablesQuery.isError}
        onRetry={() => void tablesQuery.refetch()}
      />
    </main>
  );
}
