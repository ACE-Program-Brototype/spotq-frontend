import { Minus, Plus, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  MAX_PARTY_SIZE,
  MIN_CUSTOM_PARTY_SIZE,
  PARTY_SIZE_PRESETS,
} from "../constants/queue.constants";

interface PartySizeSelectorProps {
  partySize: number;
  selectedPreset: number | "6+";
  isSubmitting: boolean;
  onPresetSelect: (preset: number | "6+") => void;
  onIncrement: () => void;
  onDecrement: () => void;
  onDirectChange: (raw: string) => void;
  onBlur: () => void;
  error?: string;
}

export function PartySizeSelector({
  partySize,
  selectedPreset,
  isSubmitting,
  onPresetSelect,
  onIncrement,
  onDecrement,
  onDirectChange,
  onBlur,
  error,
}: PartySizeSelectorProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-neutral-800 flex items-center gap-1">
          <Users className="size-3.5 text-orange-600" />
          Party Size <span className="text-red-500">*</span>
        </span>
        <span className="text-xs font-semibold text-orange-600">
          {!partySize || Number.isNaN(partySize)
            ? ""
            : `${partySize} ${partySize === 1 ? "Guest" : "Guests"}`}
        </span>
      </div>

      <div className="grid grid-cols-6 gap-1.5">
        {PARTY_SIZE_PRESETS.map((preset) => {
          const isSelected =
            preset === "6+"
              ? selectedPreset === "6+"
              : partySize === preset && selectedPreset !== "6+";

          return (
            <button
              key={String(preset)}
              type="button"
              onClick={() => onPresetSelect(preset)}
              disabled={isSubmitting}
              aria-pressed={isSelected}
              aria-label={`Party size ${preset}`}
              className={`h-10 rounded-xl text-sm font-bold border transition-all flex items-center justify-center ${
                isSelected
                  ? "bg-orange-600 text-white border-orange-600 shadow-xs"
                  : "bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100"
              }`}
            >
              {preset}
            </button>
          );
        })}
      </div>

      {selectedPreset === "6+" && (
        <div className="flex items-center justify-between p-2.5 rounded-xl border border-orange-200/80 bg-orange-50/40 mt-2">
          <span className="text-xs font-medium text-neutral-700">Exact Party Size:</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onDecrement}
              disabled={isSubmitting || partySize <= MIN_CUSTOM_PARTY_SIZE}
              className="size-8 rounded-lg border border-neutral-200 bg-white flex items-center justify-center text-neutral-700 hover:bg-neutral-50 disabled:opacity-40"
              aria-label="Decrease party size"
            >
              <Minus className="size-3.5" />
            </button>

            <Input
              type="number"
              min={MIN_CUSTOM_PARTY_SIZE}
              max={MAX_PARTY_SIZE}
              value={partySize && !Number.isNaN(partySize) ? partySize : ""}
              onChange={(e) => onDirectChange(e.target.value)}
              onBlur={onBlur}
              disabled={isSubmitting}
              className="w-16 h-8 text-center font-bold text-sm border-neutral-200 focus-visible:border-orange-500 focus-visible:ring-orange-200"
            />

            <button
              type="button"
              onClick={onIncrement}
              disabled={isSubmitting || partySize >= MAX_PARTY_SIZE}
              className="size-8 rounded-lg border border-neutral-200 bg-white flex items-center justify-center text-neutral-700 hover:bg-neutral-50 disabled:opacity-40"
              aria-label="Increase party size"
            >
              <Plus className="size-3.5" />
            </button>
          </div>
        </div>
      )}

      {error && <p className="text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}
