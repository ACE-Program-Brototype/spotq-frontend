import { AlertCircle, Check } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Spinner } from "@/components/common/LoadingIndicator";
import { Button } from "@/components/ui/button";
import { TABLE_STATUS } from "@/features/tables/constants/table.constants";
import { useTables } from "@/features/tables/hooks/useTables";
import type { TableItem } from "@/features/tables/types/table.types";
import { AssignTableCapacityBanner } from "@/features/queue/components/AssignTableCapacityBanner";
import { AssignTableGuestSummary } from "@/features/queue/components/AssignTableGuestSummary";
import { AssignTableList } from "@/features/queue/components/AssignTableList";
import { AssignTableModalHeader } from "@/features/queue/components/AssignTableModalHeader";
import { QUEUE_MESSAGES } from "@/features/queue/constants/queue.constants";
import { useAssignTables } from "@/features/queue/hooks/use-assign-tables";
import type { QueueEntry } from "@/features/queue/types/queue.types";

interface AssignTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurantId: string;
  queueEntry: QueueEntry;
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

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedTables({});
      setActiveSectionFilter("ALL");
      resetMutation();
    }
  }, [isOpen, resetMutation]);

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

  const partySize = queueEntry.partySize;

  // Filter available tables in active section
  const displayedTables = useMemo(() => {
    if (activeSectionFilter === "ALL") return allTables;
    if (tablesBySection[activeSectionFilter]) {
      return tablesBySection[activeSectionFilter];
    }
    return [];
  }, [allTables, tablesBySection, activeSectionFilter]);

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
      if (table.status === TABLE_STATUS.MAINTENANCE || availableSeats <= 0) return;

      setSelectedTables((prev) => {
        const next = { ...prev };
        if (next[table.id] !== undefined) {
          delete next[table.id];
        } else {
          // Pre-fill seat count with remaining needed seats up to table's available capacity
          const currentTotal = Object.values(next).reduce((acc, c) => acc + c, 0);
          const needed = Math.max(1, partySize - currentTotal);
          next[table.id] = Math.min(needed, availableSeats);
        }
        return next;
      });
    },
    [isSubmitting, partySize],
  );

  // Increment or decrement allocated seats for a table
  const handleAdjustSeatCount = useCallback(
    (tableId: string, delta: number, maxCapacity: number) => {
      if (isSubmitting) return;

      setSelectedTables((prev) => {
        const current = prev[tableId];
        if (current === undefined) return prev;
        const updated = Math.min(maxCapacity, Math.max(1, current + delta));
        return {
          ...prev,
          [tableId]: updated,
        };
      });
    },
    [isSubmitting],
  );

  // Submit table assignment
  const handleConfirmAssignment = async () => {
    if (!isCapacitySatisfied || selectedTableIds.length === 0 || isSubmitting) {
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
      onClose();
    }
  };

  if (!isOpen) return null;

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
        <AssignTableModalHeader
          guestName={queueEntry.guestName}
          onClose={onClose}
          disabled={isSubmitting}
        />

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto">
          {/* Guest Party Summary Card */}
          <AssignTableGuestSummary queueEntry={queueEntry} />

          {/* Real-time Capacity Status Indicator */}
          <AssignTableCapacityBanner
            isCapacitySatisfied={isCapacitySatisfied}
            totalAssignedSeats={totalAssignedSeats}
            partySize={partySize}
            selectedTablesCount={selectedTableIds.length}
            remainingNeeded={remainingNeeded}
          />

          {/* Tables Section & Selection Grid */}
          <AssignTableList
            sections={sections}
            activeSectionFilter={activeSectionFilter}
            onSelectSection={setActiveSectionFilter}
            allTablesCount={allTables.length}
            displayedTables={displayedTables}
            isLoadingTables={isLoadingTables}
            isTablesError={isTablesError}
            tablesErrorMessage={tablesError?.message}
            onRetryTables={() => refetchTables()}
            selectedTables={selectedTables}
            isSubmitting={isSubmitting}
            onToggleTable={handleToggleTable}
            onAdjustSeats={handleAdjustSeatCount}
          />

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
