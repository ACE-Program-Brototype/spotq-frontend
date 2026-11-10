import { AlertTriangle } from "lucide-react";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { TABLE_STATUS } from "../constants/table.constants";
import type { RestaurantTableDetails } from "../types/table.types";

interface DeleteTableDialogProps {
  /** Target table to delete */
  table: RestaurantTableDetails | null;
  /** Whether the dialog is open */
  isOpen: boolean;
  /** Callback invoked when the dialog is closed or cancelled */
  onClose: () => void;
  /** Callback invoked when the user confirms soft deletion */
  onConfirm: (tableId: string) => Promise<void> | void;
  /** Loading state during mutation */
  isLoading?: boolean;
}

/**
 * DeleteTableDialog
 *
 * Implements the soft deletion workflow for restaurant dining tables.
 *
 * Safety Guards:
 * - If the table is OCCUPIED or PARTIAL_OCCUPIED, deletion is strictly blocked.
 *   An informative alert explains that active guest sessions must be concluded first.
 * - If the table is AVAILABLE or MAINTENANCE, a confirmation dialog is shown.
 */
export function DeleteTableDialog({
  table,
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: DeleteTableDialogProps) {
  if (!table || !isOpen) return null;

  const tableId = table.tableId;
  const isOccupied =
    table.status === TABLE_STATUS.OCCUPIED || table.status === TABLE_STATUS.PARTIAL_OCCUPIED;

  // GUARD 1: Active Occupancy Block
  // When a table is actively occupied by guests, deleting it would orphan active guest sessions.
  if (isOccupied) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="occupied-table-title"
      >
        <div className="w-full max-w-md overflow-hidden rounded-2xl border border-amber-200 bg-white p-6 shadow-xl">
          {/* Header with warning icon and title */}
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <AlertTriangle className="size-5" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <h2
                id="occupied-table-title"
                className="break-all text-lg font-bold text-[#202522]"
                title={`Cannot Delete Table ${table.tableCode}`}
              >
                Cannot Delete Table {table.tableCode}
              </h2>
              <p className="mt-1 break-words text-sm text-[#5d655f]">
                This table is currently marked as{" "}
                <span className="font-semibold text-amber-700">
                  {table.status === TABLE_STATUS.OCCUPIED ? "Occupied" : "Partially Occupied"}
                </span>
                {table.currentOccupancy > 0
                  ? ` with ${table.currentOccupancy} guest(s) seated.`
                  : "."}
              </p>
            </div>
          </div>

          {/* Detailed explanation message */}
          <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50/70 p-3 text-xs text-amber-900">
            Tables with active dining parties cannot be removed from the floor layout. Please clear
            orders or conclude customer checkouts before deleting this table.
          </div>

          {/* Dismiss button only (destructive action button is omitted) */}
          <div className="mt-6 flex justify-end">
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-xl px-4"
              onClick={onClose}
            >
              Understood
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // GUARD 2: Normal Deletion Confirmation
  // Table is either AVAILABLE or in MAINTENANCE. Safe to perform deletion.
  return (
    <ConfirmDialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !isLoading) onClose();
      }}
      title={`Delete Table "${table.tableCode}"?`}
      description={`Are you sure you want to delete Table ${table.tableCode}? This will remove it from your active floor layout.`}
      confirmText="Delete Table"
      cancelText="Cancel"
      confirmVariant="destructive"
      isLoading={isLoading}
      loadingText="Deleting…"
      onConfirm={() => onConfirm(tableId)}
      onCancel={onClose}
    />
  );
}
