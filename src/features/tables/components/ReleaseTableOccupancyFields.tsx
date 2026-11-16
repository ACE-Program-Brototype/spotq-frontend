import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableStatusBadge } from "@/features/tables/components/TableStatusBadge";
import type { TableItem } from "@/features/tables/types/table.types";

interface ReleaseTableOccupancyFieldsProps {
  table: TableItem;
  currentOccupancy: number;
  parsedSeats: number;
  seatsInput: string;
  isPending: boolean;
  validationError: string | null;
  remainingAfterRelease: number | null;
  onSeatsChange: (val: string) => void;
  onStep: (delta: number) => void;
}

export function ReleaseTableOccupancyFields({
  table,
  currentOccupancy,
  parsedSeats,
  seatsInput,
  isPending,
  validationError,
  remainingAfterRelease,
  onSeatsChange,
  onStep,
}: ReleaseTableOccupancyFieldsProps) {
  return (
    <>
      {/* Current Occupancy Showcase */}
      <div className="flex items-center justify-between p-3.5 rounded-xl border border-[#eddcd4] bg-[#faf7f5]">
        <div>
          <span className="text-xs font-semibold text-neutral-600 block">Current Status</span>
          <span className="text-[11px] text-neutral-500">
            {currentOccupancy} of {table.capacity} seats occupied
          </span>
        </div>
        <TableStatusBadge status={table.status} size="sm" />
      </div>

      {/* Occupancy To Release Controls */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="occupancy-to-release-input"
            className="text-xs font-semibold text-neutral-700"
          >
            Seats to Release
          </label>
          {currentOccupancy > 1 && (
            <button
              type="button"
              disabled={isPending}
              onClick={() => onSeatsChange(String(currentOccupancy))}
              className="text-[11px] font-bold text-[#9a3412] hover:underline disabled:opacity-50"
            >
              Release All ({currentOccupancy})
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isPending || parsedSeats <= 1}
            onClick={() => onStep(-1)}
            aria-label="Decrease seats to release"
            className="h-10 w-10 p-0 rounded-xl border-[#eddcd4] shrink-0"
          >
            <Minus className="size-4" />
          </Button>

          <Input
            id="occupancy-to-release-input"
            data-testid="occupancy-to-release-input"
            type="number"
            min={1}
            max={currentOccupancy}
            step={1}
            disabled={isPending}
            value={seatsInput}
            onChange={(e) => onSeatsChange(e.target.value)}
            className="h-10 text-center font-bold text-sm rounded-xl border-[#eddcd4] focus-visible:border-[#9a3412] focus-visible:ring-[#fed7aa]"
          />

          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isPending || parsedSeats >= currentOccupancy}
            onClick={() => onStep(1)}
            aria-label="Increase seats to release"
            className="h-10 w-10 p-0 rounded-xl border-[#eddcd4] shrink-0"
          >
            <Plus className="size-4" />
          </Button>
        </div>

        {validationError ? (
          <p
            role="alert"
            data-testid="release-validation-error"
            className="text-xs font-medium text-red-600"
          >
            {validationError}
          </p>
        ) : remainingAfterRelease !== null ? (
          <p className="text-[11px] text-neutral-500">
            {remainingAfterRelease === 0
              ? `Table will become Available (0/${table.capacity} occupied).`
              : `Remaining occupancy after release: ${remainingAfterRelease}/${table.capacity} (Partially Occupied).`}
          </p>
        ) : null}
      </div>
    </>
  );
}
