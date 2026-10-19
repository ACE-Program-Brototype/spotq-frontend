import {
  AlertCircle,
  Filter,
  RefreshCw,
  Search,
  Table as TableIcon,
  UtensilsCrossed,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { TableCard } from "../components/TableCard";
import { TableSectionTabs } from "../components/TableSectionTabs";
import { TableSkeletonGrid } from "../components/TableSkeletonGrid";
import { TableStatusModal } from "../components/TableStatusModal";
import { TableSummaryBar } from "../components/TableSummaryBar";
import { TABLE_MESSAGES, TABLE_STATUS } from "../constants/table.constants";
import { useTables } from "../hooks/useTables";
import type { TableItem, TableStatus } from "../types/table.types";

export default function StaffTablePage() {
  const user = useAuthStore((state) => state.user);
  const restaurantId = user?.restaurantId || "";

  const { tablesBySection, sections, stats, isLoading, isFetching, isError, error, refetch } =
    useTables(restaurantId);

  // Active section tab
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    if (sections.length > 0 && (!activeSection || !sections.includes(activeSection))) {
      setActiveSection(sections[0]);
    }
  }, [sections, activeSection]);

  // Filtering & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TableStatus | "ALL">("ALL");

  // Selected table for status modal
  const [selectedTable, setSelectedTable] = useState<TableItem | null>(null);

  // Filter tables in active section
  const visibleTables = useMemo(() => {
    const sectionTables = activeSection ? tablesBySection[activeSection] || [] : [];
    return sectionTables.filter((table) => {
      const matchesSearch =
        !searchQuery.trim() ||
        table.tableCode.toLowerCase().includes(searchQuery.trim().toLowerCase());
      const matchesStatus =
        statusFilter === "ALL"
          ? true
          : statusFilter === TABLE_STATUS.OCCUPIED
            ? table.status === TABLE_STATUS.OCCUPIED ||
              table.status === TABLE_STATUS.PARTIAL_OCCUPIED
            : table.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [tablesBySection, activeSection, searchQuery, statusFilter]);

  return (
    <div className="space-y-6 max-w-full">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[#eadfd8] bg-white p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#1c1714]">
              {TABLE_MESSAGES.TITLE}
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Floor Grid
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-[#756c66]">{TABLE_MESSAGES.SUBTITLE}</p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={!restaurantId || isFetching}
          className="h-10 px-3.5 rounded-xl border-[#eddcd4] text-neutral-700 hover:bg-[#faf7f5] font-semibold text-xs flex items-center gap-2"
        >
          <RefreshCw className={`size-3.5 text-[#9a3412] ${isFetching ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Summary KPI Bar */}
      {Boolean(restaurantId) && !isLoading && !isError && <TableSummaryBar stats={stats} />}

      {/* Error Banner */}
      {isError && (
        <div
          className="flex items-center justify-between p-4 rounded-2xl border border-red-200 bg-red-50 text-red-800 text-xs"
          role="alert"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="size-4 text-red-600 shrink-0" />
            <span>{error?.message || TABLE_MESSAGES.FETCH_FAILED}</span>
          </div>
          <Button
            type="button"
            size="sm"
            onClick={() => refetch()}
            className="h-7 px-2.5 rounded-lg bg-red-700 text-white text-xs font-bold"
          >
            Retry
          </Button>
        </div>
      )}

      {/* Main Floor Content Card */}
      <div className="rounded-2xl border border-[#eadfd8] bg-white p-5 sm:p-6 shadow-xs space-y-6">
        {/* Section Tabs */}
        {sections.length > 0 && (
          <div className="space-y-4">
            <TableSectionTabs
              sections={sections}
              activeSection={activeSection}
              onSelectSection={setActiveSection}
              tablesBySection={tablesBySection}
            />

            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
              <div className="relative flex-1 max-w-xs">
                <Search className="size-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  type="text"
                  placeholder="Search table code (e.g. T1)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 text-xs rounded-xl border-[#eddcd4] focus-visible:border-[#9a3412] focus-visible:ring-[#fed7aa]"
                />
              </div>

              {/* Status Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
                <Filter className="size-3.5 text-neutral-400 shrink-0 mr-1" />
                {(
                  [
                    { id: "ALL", label: "All" },
                    { id: TABLE_STATUS.AVAILABLE, label: "Available" },
                    { id: TABLE_STATUS.OCCUPIED, label: "Occupied" },
                    { id: TABLE_STATUS.MAINTENANCE, label: "Maintenance" },
                  ] as const
                ).map((opt) => {
                  const isSelected = statusFilter === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setStatusFilter(opt.id)}
                      className={`h-8 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                        isSelected
                          ? "bg-[#9a3412] text-white shadow-2xs"
                          : "bg-[#faf7f5] text-neutral-600 hover:bg-[#eddcd4]/50 border border-[#eddcd4]"
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Missing Restaurant Empty State */}
        {!restaurantId && (
          <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-[#eddcd4] bg-[#faf7f5]/60">
            <AlertCircle className="size-8 text-amber-600 mb-2" />
            <h3 className="text-base font-bold text-neutral-900">{TABLE_MESSAGES.NO_RESTAURANT}</h3>
            <p className="text-xs text-[#756c66] mt-0.5 max-w-sm">
              {TABLE_MESSAGES.NO_RESTAURANT_DESC}
            </p>
          </div>
        )}

        {/* Loading State */}
        {Boolean(restaurantId) && isLoading && <TableSkeletonGrid count={8} />}

        {/* No Sections Empty State */}
        {Boolean(restaurantId) && !isLoading && !isError && sections.length === 0 && (
          <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-[#eddcd4] bg-[#faf7f5]/60">
            <TableIcon className="size-8 text-[#9a3412] mb-2" />
            <h3 className="text-base font-bold text-neutral-900">{TABLE_MESSAGES.NO_SECTIONS}</h3>
            <p className="text-xs text-[#756c66] mt-0.5 max-w-sm">
              {TABLE_MESSAGES.NO_SECTIONS_DESC}
            </p>
          </div>
        )}

        {/* No Tables in Active Section or Matching Search */}
        {Boolean(restaurantId) &&
          !isLoading &&
          !isError &&
          sections.length > 0 &&
          visibleTables.length === 0 && (
            <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-[#eddcd4] bg-[#faf7f5]/60">
              <UtensilsCrossed className="size-8 text-[#9a3412] mb-2" />
              <h3 className="text-base font-bold text-neutral-900">
                {searchQuery || statusFilter !== "ALL"
                  ? "No matching tables"
                  : TABLE_MESSAGES.NO_TABLES_IN_SECTION}
              </h3>
              <p className="text-xs text-[#756c66] mt-0.5 max-w-sm">
                {searchQuery || statusFilter !== "ALL"
                  ? "Try adjusting your search query or status filter."
                  : TABLE_MESSAGES.NO_TABLES_IN_SECTION_DESC}
              </p>
              {(searchQuery || statusFilter !== "ALL") && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("ALL");
                  }}
                  className="mt-4 h-8 px-3 rounded-xl border-[#eddcd4] text-xs font-semibold"
                >
                  Reset Filters
                </Button>
              )}
            </div>
          )}

        {/* Table Cards Grid */}
        {Boolean(restaurantId) && !isLoading && !isError && visibleTables.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-4">
            {visibleTables.map((table) => (
              <TableCard key={table.id} table={table} onClick={setSelectedTable} />
            ))}
          </div>
        )}
      </div>

      {/* Status Update Modal */}
      <TableStatusModal
        table={selectedTable}
        isOpen={Boolean(selectedTable)}
        onClose={() => setSelectedTable(null)}
        restaurantId={restaurantId}
        sectionName={activeSection}
      />
    </div>
  );
}
