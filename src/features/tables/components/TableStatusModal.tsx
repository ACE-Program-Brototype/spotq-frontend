import { AlertCircle, CheckCircle2, Table as TableIcon, Users, Wrench, X } from "lucide-react";
import { useEffect } from "react";
import { Spinner } from "@/components/common/LoadingIndicator";
import { Button } from "@/components/ui/button";
import { getStaffStatusTransition, TABLE_STATUS_CONFIG } from "../constants/table.constants";
import { useUpdateTableStatus } from "../hooks/useUpdateTableStatus";
import type { TableItem } from "../types/table.types";
import { TableStatusBadge } from "./TableStatusBadge";

interface TableStatusModalProps {
  table: TableItem | null;
  isOpen: boolean;
  onClose: () => void;
  restaurantId: string;
  sectionName?: string;
}

export function TableStatusModal({
  table,
  isOpen,
  onClose,
  restaurantId,
  sectionName,
}: TableStatusModalProps) {
  const { mutate: updateStatus, isPending, error: apiError } = useUpdateTableStatus(restaurantId);

  // Close on Escape key press when not pending
  useEffect(() => {
    if (!isOpen || isPending) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isPending, onClose]);

  if (!isOpen || !table) return null;

  const transitionRule = getStaffStatusTransition(table.status);
  const targetStatus = transitionRule.targetStatus;
  const targetConfig = targetStatus ? TABLE_STATUS_CONFIG[targetStatus] : null;

  const handleApplyStatusChange = () => {
    if (!targetStatus) return;

    updateStatus(
      {
        tableId: table.id,
        tableCode: table.tableCode,
        status: targetStatus,
      },
      {
        onSuccess: () => onClose(),
      },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <button
        type="button"
        aria-hidden="true"
        tabIndex={-1}
        onClick={onClose}
        disabled={isPending}
        className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs cursor-default border-0 outline-none w-full h-full"
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="table-modal-title"
        className="relative z-10 w-full max-w-md rounded-2xl bg-white border border-[#eddcd4] shadow-xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#eddcd4] bg-[#fffcf9]">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-[#fed7aa]/50 flex items-center justify-center text-[#9a3412] border border-[#fbd0a7]">
              <TableIcon className="size-4.5" />
            </div>
            <div>
              <h3 id="table-modal-title" className="text-base font-bold text-neutral-900">
                Table {table.tableCode}
              </h3>
              <p className="text-xs text-neutral-500 flex items-center gap-1.5 mt-0.5">
                <span>{sectionName || table.sectionName || "Dining"}</span>
                <span>•</span>
                <Users className="size-3 text-neutral-400" />
                <span>{table.capacity} Seats</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-[#eddcd4]/30"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* API Error Alert */}
          {apiError && (
            <div className="flex items-center gap-2 p-3 rounded-xl border border-red-200 bg-red-50 text-xs text-red-700">
              <AlertCircle className="size-4 text-red-600 shrink-0" />
              <span>{apiError.message}</span>
            </div>
          )}

          {/* Current Status Showcase */}
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-[#eddcd4] bg-[#faf7f5]">
            <span className="text-xs font-semibold text-neutral-600">Current Status</span>
            <TableStatusBadge status={table.status} size="sm" />
          </div>

          {/* Action / Guidance based on business rule */}
          {transitionRule.allowed && targetStatus && targetConfig ? (
            <div className="space-y-2">
              <span className="text-xs font-semibold text-neutral-700">Available Action:</span>
              <div
                className={`p-3.5 rounded-xl border flex items-center gap-3 ${
                  targetStatus === "AVAILABLE"
                    ? "border-emerald-200 bg-emerald-50/50"
                    : "border-neutral-200 bg-neutral-50"
                }`}
              >
                <div
                  className={`size-8 rounded-lg flex items-center justify-center shrink-0 ${
                    targetStatus === "AVAILABLE"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-neutral-200 text-neutral-700"
                  }`}
                >
                  {targetStatus === "AVAILABLE" ? (
                    <CheckCircle2 className="size-4" />
                  ) : (
                    <Wrench className="size-4" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-neutral-900">
                    Change to {targetConfig.label}
                  </p>
                  <p className="text-[11px] text-neutral-500 mt-0.5">{transitionRule.reason}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/80 text-xs text-amber-900">
              <p className="font-bold">Manual Update Restricted</p>
              <p className="mt-1 text-amber-800 leading-relaxed">{transitionRule.reason}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 px-5 py-3.5 border-t border-[#eddcd4] bg-[#fffcf9]">
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={onClose}
            className="h-9 px-4 rounded-xl border-[#eddcd4] text-xs font-semibold"
          >
            Cancel
          </Button>

          {transitionRule.allowed && targetStatus && (
            <Button
              type="button"
              disabled={isPending}
              onClick={handleApplyStatusChange}
              className={`h-9 px-4 rounded-xl text-xs font-bold text-white shadow-sm flex items-center gap-1.5 ${
                targetStatus === "AVAILABLE"
                  ? "bg-emerald-700 hover:bg-emerald-800"
                  : "bg-neutral-800 hover:bg-neutral-900"
              }`}
            >
              {isPending ? (
                <>
                  <Spinner className="size-3.5 mr-1" />
                  Updating...
                </>
              ) : targetStatus === "AVAILABLE" ? (
                <>
                  <CheckCircle2 className="size-4" />
                  Set to Available
                </>
              ) : (
                <>
                  <Wrench className="size-4" />
                  Set to Maintenance
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
