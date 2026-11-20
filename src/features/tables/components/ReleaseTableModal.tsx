import { AlertCircle, LogOut, Table as TableIcon, Users, X } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { Spinner } from "@/components/common/LoadingIndicator";
import { Button } from "@/components/ui/button";
import { DOM_EVENTS, KEYBOARD_KEYS } from "@/features/tables/constants/table.constants";
import { useReleaseTable } from "@/features/tables/hooks/useReleaseTable";
import type { TableItem } from "@/features/tables/types/table.types";
import { ReleaseTableOccupancyFields } from "@/features/tables/components/ReleaseTableOccupancyFields";

interface ReleaseTableModalProps {
  table: TableItem | null;
  isOpen: boolean;
  onClose: () => void;
  restaurantId: string;
  sectionName?: string;
}

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * ReleaseTableModal
 *
 * Implements releasing table occupancy modal.
 *
 * @deprecated SpotQ domain strictly encompasses digital takeaway ordering and virtual queue ticketing.
 * Table management UI violates takeaway-only business scope and is preserved only for legacy compatibility.
 */
export function ReleaseTableModal({
  table,
  isOpen,
  onClose,
  restaurantId,
  sectionName,
}: ReleaseTableModalProps) {
  const { mutate: releaseTable, isPending, error: apiError, reset } = useReleaseTable(restaurantId);

  const maxOccupancy = Math.max(table?.currentOccupancy ?? 0, 1);
  const [seatsInput, setSeatsInput] = useState<string>(String(maxOccupancy));
  const [validationError, setValidationError] = useState<string | null>(null);

  const dialogCardRef = useRef<HTMLDivElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen && table) {
      const initialSeats = table.currentOccupancy > 0 ? table.currentOccupancy : 1;
      setSeatsInput(String(initialSeats));
      setValidationError(null);
      reset();
      previousActiveElementRef.current = document.activeElement as HTMLElement | null;
    }
  }, [isOpen, table, reset]);

  useEffect(() => {
    if (!isOpen) {
      if (previousActiveElementRef.current) {
        previousActiveElementRef.current.focus?.();
        previousActiveElementRef.current = null;
      }
      return;
    }

    const card = dialogCardRef.current;
    if (card) {
      const focusables = card.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      focusables[0]?.focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === KEYBOARD_KEYS.ESCAPE && !isPending) {
        onClose();
        return;
      }

      if (e.key === KEYBOARD_KEYS.TAB && card) {
        const focusables = Array.from(card.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
        if (focusables.length === 0) return;

        const firstElement = focusables[0];
        const lastElement = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    window.addEventListener(DOM_EVENTS.KEY_DOWN, handleKeyDown);
    return () => window.removeEventListener(DOM_EVENTS.KEY_DOWN, handleKeyDown);
  }, [isOpen, isPending, onClose]);

  if (!isOpen || !table) return null;

  const currentOccupancy = table.currentOccupancy;
  const parsedSeats = Number(seatsInput);
  const isValidSeats =
    seatsInput.trim() !== "" &&
    Number.isInteger(parsedSeats) &&
    parsedSeats >= 1 &&
    parsedSeats <= currentOccupancy;

  const handleSeatsChange = (value: string) => {
    setSeatsInput(value);
    setValidationError(null);
  };

  const handleStep = (delta: number) => {
    const base = Number.isInteger(parsedSeats) ? parsedSeats : 1;
    const next = Math.min(Math.max(base + delta, 1), currentOccupancy);
    handleSeatsChange(String(next));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (currentOccupancy <= 0) {
      setValidationError("This table currently has no occupied seats to release.");
      return;
    }

    if (!isValidSeats) {
      setValidationError(`Enter a whole number between 1 and ${currentOccupancy}.`);
      return;
    }

    releaseTable(
      {
        tableId: table.id,
        tableCode: table.tableCode,
        occupancyToRelease: parsedSeats,
      },
      {
        onSuccess: () => onClose(),
      },
    );
  };

  const remainingAfterRelease = isValidSeats ? currentOccupancy - parsedSeats : null;

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
        ref={dialogCardRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="release-table-modal-title"
        data-testid="release-table-modal"
        className="relative z-10 w-full max-w-md rounded-2xl bg-white border border-[#eddcd4] shadow-xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#eddcd4] bg-[#fffcf9]">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-[#fed7aa]/50 flex items-center justify-center text-[#9a3412] border border-[#fbd0a7]">
              <TableIcon className="size-4.5" />
            </div>
            <div>
              <h3 id="release-table-modal-title" className="text-base font-bold text-neutral-900">
                Release Table {table.tableCode}
              </h3>
              <p className="text-xs text-neutral-500 flex items-center gap-1.5 mt-0.5">
                <span>{sectionName || table.sectionName || "Dining"}</span>
                <span>•</span>
                <Users className="size-3 text-neutral-400" />
                <span>
                  {currentOccupancy}/{table.capacity} Occupied
                </span>
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

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="p-5 space-y-4">
            {/* API Error Alert */}
            {apiError && (
              <div
                role="alert"
                className="flex items-center gap-2 p-3 rounded-xl border border-red-200 bg-red-50 text-xs text-red-700"
              >
                <AlertCircle className="size-4 text-red-600 shrink-0" />
                <span>{apiError.message}</span>
              </div>
            )}

            <ReleaseTableOccupancyFields
              table={table}
              currentOccupancy={currentOccupancy}
              parsedSeats={parsedSeats}
              seatsInput={seatsInput}
              isPending={isPending}
              validationError={validationError}
              remainingAfterRelease={remainingAfterRelease}
              onSeatsChange={handleSeatsChange}
              onStep={handleStep}
            />
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

            <Button
              type="submit"
              disabled={isPending || currentOccupancy <= 0}
              data-testid="confirm-release-table-btn"
              className="h-9 px-4 rounded-xl bg-[#9a3412] hover:bg-[#7c2d12] text-xs font-bold text-white shadow-sm flex items-center gap-1.5"
            >
              {isPending ? (
                <>
                  <Spinner className="size-3.5 mr-1" />
                  <span>Releasing...</span>
                </>
              ) : (
                <>
                  <LogOut className="size-3.5" />
                  <span>Confirm Release</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
