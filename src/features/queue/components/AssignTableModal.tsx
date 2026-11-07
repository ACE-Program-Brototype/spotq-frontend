import {
  AlertCircle,
  AlertTriangle,
  Check,
  CheckCircle2,
  MessageSquare,
  Minus,
  Plus,
  Table as TableIcon,
  Users,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Spinner } from "@/components/common/LoadingIndicator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTables } from "@/features/tables/hooks/useTables";
import type { TableItem } from "@/features/tables/types/table.types";
import { QUEUE_MESSAGES } from "../constants/queue.constants";
import { useAssignTables } from "../hooks/use-assign-tables";
import type { QueueEntry } from "../types/queue.types";

interface AssignTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurantId: string;
  queueEntry: QueueEntry | null;
  onSuccess?: (updatedEntry: QueueEntry, tableIds: string[]) => void;
}

export function AssignTableModal({
  isOpen,
  onClose,
  restaurantId,
  queueEntry,
  onSuccess,
}: AssignTableModalProps) {
  // Query restaurant tables grouped by section
  const {
    allTables,
    sections,
    tablesBySection,
    isLoading: isLoadingTables,
    isError: isTablesError,
    error: tablesError,
    refetch: refetchTables,
  } = useTables(restaurantId);

  // Table assignment mutation hook
  const {
    assignTables,
    isSubmitting,
    error: apiError,
    reset: resetMutation,
  } = useAssignTables(restaurantId);

  // Selected tables and seat allocation: tableId -> seat count
  const [selectedTables, setSelectedTables] = useState<Record<string, number>>({});
  const [activeSectionFilter, setActiveSectionFilter] = useState<string>("ALL");

  // Reset state when modal opens with a new queue entry
  useEffect(() => {
    if (isOpen && queueEntry) {
      setSelectedTables({});
      setActiveSectionFilter("ALL");
      resetMutation();
    }
  }, [isOpen, queueEntry, resetMutation]);

  // Handle keyboard Escape to dismiss modal
  useEffect(() => {
    if (!isOpen || isSubmitting) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  const partySize = queueEntry?.partySize || 0;

  // Map of tableId -> sectionName resolved from tablesBySection dictionary
  const tableSectionMap = useMemo(() => {
    const map: Record<string, string> = {};
    for (const [secName, tables] of Object.entries(tablesBySection)) {
      for (const t of tables) {
        map[t.id] = secName;
      }
    }
    return map;
  }, [tablesBySection]);

  // Filter available tables in active section
  const displayedTables = useMemo(() => {
    if (activeSectionFilter === "ALL") return allTables;
    if (tablesBySection[activeSectionFilter]) {
      return tablesBySection[activeSectionFilter];
    }
    return allTables.filter(
      (table) =>
        table.sectionName === activeSectionFilter ||
        tableSectionMap[table.id] === activeSectionFilter,
    );
  }, [allTables, tablesBySection, activeSectionFilter, tableSectionMap]);

  // Calculate current seat allocation stats
  const totalAssignedSeats = useMemo(() => {
    return Object.values(selectedTables).reduce((acc, count) => acc + count, 0);
  }, [selectedTables]);

  const isCapacitySatisfied = totalAssignedSeats >= partySize && partySize > 0;
  const remainingNeeded = Math.max(0, partySize - totalAssignedSeats);
  const selectedTableIds = useMemo(() => Object.keys(selectedTables), [selectedTables]);

  // Toggle table selection
  const handleToggleTable = useCallback(
    (table: TableItem) => {
      if (isSubmitting) return;

      const availableSeats = Math.max(0, table.capacity - (table.currentOccupancy || 0));
      if (table.status === "MAINTENANCE" || availableSeats <= 0) return;

      setSelectedTables((prev) => {
        const next = { ...prev };
        if (next[table.id] !== undefined) {
          delete next[table.id];
        } else {
          // Pre-fill seat count with remaining needed seats up to table's available capacity
          const currentTotal = Object.values(next).reduce((acc, c) => acc + c, 0);
          const needed = Math.max(1, partySize - currentTotal);
          next[table.id] = Math.min(availableSeats, needed);
        }
        return next;
      });
    },
    [isSubmitting, partySize],
  );

  // Adjust allocated seat count for a selected table
  const handleAdjustSeatCount = useCallback(
    (tableId: string, delta: number, maxAvailable: number) => {
      if (isSubmitting) return;

      setSelectedTables((prev) => {
        const currentCount = prev[tableId];
        if (currentCount === undefined) return prev;

        const nextCount = Math.min(maxAvailable, Math.max(1, currentCount + delta));
        return {
          ...prev,
          [tableId]: nextCount,
        };
      });
    },
    [isSubmitting],
  );

  // Submit table assignment
  const handleConfirmAssignment = async () => {
    if (!queueEntry || !isCapacitySatisfied || selectedTableIds.length === 0 || isSubmitting) {
      return;
    }

    const payload = {
      tables: selectedTableIds.map((tableId) => ({
        tableId,
        count: selectedTables[tableId],
      })),
    };

    try {
      const response = await assignTables({
        queueEntryId: queueEntry.queueEntryId,
        input: payload,
      });

      const updatedEntry: QueueEntry = {
        ...queueEntry,
        status: response.data.status,
        position: 0,
      };

      onSuccess?.(updatedEntry, response.data.tableIds);
      onClose();
    } catch {
      // Error handling and toast are handled by useAssignTables
    }
  };

  if (!isOpen || !queueEntry) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <button
        type="button"
        aria-hidden="true"
        tabIndex={-1}
        onClick={onClose}
        disabled={isSubmitting}
        className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs cursor-default border-0 outline-none w-full h-full"
      />

      {/* Modal Container */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="assign-table-modal-title"
        className="relative z-10 w-full max-w-2xl rounded-2xl bg-white border border-[#eddcd4] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[#eddcd4] bg-[#fffcf9] shrink-0">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-[#fed7aa]/50 flex items-center justify-center text-[#9a3412] border border-[#fbd0a7]">
              <UtensilsCrossed className="size-5" />
            </div>
            <div>
              <h3
                id="assign-table-modal-title"
                className="text-base sm:text-lg font-black text-neutral-900"
              >
                Assign Table & Seat Party
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Allocate dining capacity for {queueEntry.guestName}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close dialog"
            className="size-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto">
          {/* Guest Party Summary Card */}
          <div className="rounded-xl border border-[#eddcd4] bg-[#faf7f5]/80 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-neutral-900">{queueEntry.guestName}</span>
                  <Badge className="bg-[#fed7aa] text-[#9a3412] border-[#fbd0a7] text-[10px] font-black">
                    #{queueEntry.position} in line
                  </Badge>
                  {queueEntry.guestPhone && (
                    <span className="text-xs text-neutral-500 font-mono">
                      {queueEntry.guestPhone}
                    </span>
                  )}
                </div>
                {queueEntry.specialNotes && (
                  <p className="text-xs text-neutral-600 flex items-center gap-1.5 pt-0.5">
                    <MessageSquare className="size-3 text-neutral-400 shrink-0" />
                    <span>{queueEntry.specialNotes}</span>
                  </p>
                )}
              </div>

              <div className="flex items-center gap-4 shrink-0 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-neutral-800 bg-white px-3 py-1.5 rounded-lg border border-[#eddcd4]">
                  <Users className="size-3.5 text-[#9a3412]" />
                  <span>
                    Party of {queueEntry.partySize}{" "}
                    {queueEntry.partySize === 1 ? "Guest" : "Guests"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Real-time Capacity Status Indicator */}
          <div
            className={`rounded-xl border p-3.5 text-xs flex items-center justify-between gap-3 transition-colors ${
              isCapacitySatisfied
                ? "border-emerald-200 bg-emerald-50/70 text-emerald-900"
                : selectedTableIds.length === 0
                  ? "border-[#eddcd4] bg-neutral-50 text-neutral-700"
                  : "border-amber-200 bg-amber-50/70 text-amber-900"
            }`}
          >
            <div className="flex items-center gap-2.5">
              {isCapacitySatisfied ? (
                <CheckCircle2 className="size-4.5 text-emerald-600 shrink-0" />
              ) : selectedTableIds.length === 0 ? (
                <TableIcon className="size-4.5 text-neutral-500 shrink-0" />
              ) : (
                <AlertTriangle className="size-4.5 text-amber-600 shrink-0" />
              )}
              <div>
                <span className="font-bold">
                  {isCapacitySatisfied
                    ? "Capacity Requirement Satisfied"
                    : selectedTableIds.length === 0
                      ? "Select Table(s) to Assign"
                      : "Insufficient Capacity Selected"}
                </span>
                <p className="text-[11px] opacity-85 mt-0.5">
                  {isCapacitySatisfied
                    ? `${totalAssignedSeats} seats allocated across ${selectedTableIds.length} table${selectedTableIds.length > 1 ? "s" : ""} (Required: ${partySize})`
                    : selectedTableIds.length === 0
                      ? `Choose one or more available tables to accommodate party size of ${partySize}.`
                      : `Need ${remainingNeeded} more seat${remainingNeeded > 1 ? "s" : ""} to accommodate ${partySize} guests.`}
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

          {/* Section Filter Chips (if multiple sections exist) */}
          {sections.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <button
                type="button"
                onClick={() => setActiveSectionFilter("ALL")}
                className={`h-7 px-3 rounded-lg text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                  activeSectionFilter === "ALL"
                    ? "bg-[#9a3412] text-white shadow-2xs"
                    : "bg-[#faf7f5] text-neutral-600 hover:bg-[#eddcd4]/50 border border-[#eddcd4]"
                }`}
              >
                All Sections ({allTables.length})
              </button>
              {sections.map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => setActiveSectionFilter(sec)}
                  className={`h-7 px-3 rounded-lg text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                    activeSectionFilter === sec
                      ? "bg-[#9a3412] text-white shadow-2xs"
                      : "bg-[#faf7f5] text-neutral-600 hover:bg-[#eddcd4]/50 border border-[#eddcd4]"
                  }`}
                >
                  {sec}
                </button>
              ))}
            </div>
          )}

          {/* Loading Tables State */}
          {isLoadingTables && (
            <div className="flex flex-col items-center justify-center p-10 text-center">
              <Spinner className="size-6 text-[#9a3412] mb-2" />
              <p className="text-xs text-neutral-500">Loading dining floor tables...</p>
            </div>
          )}

          {/* Tables Loading Error */}
          {isTablesError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="size-4 text-red-600 shrink-0" />
                <span>{tablesError?.message || "Failed to load tables"}</span>
              </div>
              <Button
                type="button"
                size="sm"
                onClick={() => refetchTables()}
                className="h-7 px-2.5 rounded-lg bg-red-700 text-white font-bold text-xs"
              >
                Retry
              </Button>
            </div>
          )}

          {/* No Tables Available State */}
          {!isLoadingTables && !isTablesError && displayedTables.length === 0 && (
            <div className="flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-[#eddcd4] bg-[#faf7f5]/60">
              <TableIcon className="size-7 text-[#9a3412] mb-2" />
              <p className="text-sm font-bold text-neutral-900">No Tables in This Section</p>
              <p className="text-xs text-neutral-500 mt-0.5">
                Switch section filter or create tables from the Tables management page.
              </p>
            </div>
          )}

          {/* Tables Grid */}
          {!isLoadingTables && !isTablesError && displayedTables.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-bold text-neutral-700">Select Available Tables:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-64 overflow-y-auto pr-1">
                {displayedTables.map((table) => {
                  const isSelected = selectedTables[table.id] !== undefined;
                  const availableCapacity = Math.max(
                    0,
                    table.capacity - (table.currentOccupancy || 0),
                  );
                  const isMaintenance = table.status === "MAINTENANCE";
                  const isFullyOccupied = table.status === "OCCUPIED" || availableCapacity <= 0;
                  const isSelectable = !isMaintenance && !isFullyOccupied;

                  return (
                    <div
                      key={table.id}
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
                        onClick={() => isSelectable && handleToggleTable(table)}
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
                              {table.sectionName || tableSectionMap[table.id] || "Dining"}
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
                                  : table.status === "PARTIAL_OCCUPIED"
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
                          <span className="text-[10px] text-neutral-400 block mt-0.5">
                            Cap: {table.capacity}
                          </span>
                        </div>
                      </button>

                      {/* Allocated Seat Stepper for Selected Table */}
                      {isSelected && (
                        <div className="px-3 pb-3 pt-2 border-t border-[#f3e6de] flex items-center justify-between text-xs">
                          <span className="text-neutral-600 font-medium">Allocate seats:</span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleAdjustSeatCount(table.id, -1, availableCapacity)}
                              disabled={selectedTables[table.id] <= 1 || isSubmitting}
                              className="size-6 rounded-md bg-white border border-[#eddcd4] hover:bg-[#faf7f5] flex items-center justify-center text-neutral-700 disabled:opacity-40"
                              aria-label={`Decrease seats for table ${table.tableCode}`}
                            >
                              <Minus className="size-3" />
                            </button>

                            <span className="font-black text-xs text-[#9a3412] min-w-5 text-center">
                              {selectedTables[table.id]}
                            </span>

                            <button
                              type="button"
                              onClick={() => handleAdjustSeatCount(table.id, 1, availableCapacity)}
                              disabled={
                                selectedTables[table.id] >= availableCapacity || isSubmitting
                              }
                              className="size-6 rounded-md bg-white border border-[#eddcd4] hover:bg-[#faf7f5] flex items-center justify-center text-neutral-700 disabled:opacity-40"
                              aria-label={`Increase seats for table ${table.tableCode}`}
                            >
                              <Plus className="size-3" />
                            </button>
                            <span className="text-[11px] text-neutral-400">
                              / {availableCapacity}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* API Submission Error Banner */}
          {apiError && (
            <div
              className="p-3.5 rounded-xl border border-red-200 bg-red-50 text-red-800 text-xs flex items-center gap-2"
              role="alert"
            >
              <AlertCircle className="size-4 text-red-600 shrink-0" />
              <span>{apiError.message || QUEUE_MESSAGES.ASSIGN_TABLE_FAILED}</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 px-5 sm:px-6 py-4 border-t border-[#eddcd4] bg-[#fffcf9] shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="h-10 px-4 rounded-xl border-[#eddcd4] text-neutral-700 hover:bg-[#faf7f5] text-xs font-bold"
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleConfirmAssignment}
            disabled={!isCapacitySatisfied || selectedTableIds.length === 0 || isSubmitting}
            className="h-10 px-5 rounded-xl bg-[#9a3412] hover:bg-[#7c2d12] text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Spinner className="size-4" />
                <span>Assigning & Seating...</span>
              </>
            ) : (
              <>
                <Check className="size-4" />
                <span>Confirm & Seat Party</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
